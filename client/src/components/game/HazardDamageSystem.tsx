import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { usePlayer } from "@/lib/stores/usePlayer";
import { useFireSafety } from "@/lib/stores/useFireSafety";
import { useAudio } from "@/lib/stores/useAudio";
import { useSettings } from "@/lib/stores/useSettings";
import { GAME_CONSTANTS, PLAYER_CONSTANTS, DIFFICULTY_PROFILES } from "@/lib/constants";
import { HazardType, DifficultyLevel } from "@/lib/types";

/**
 * HazardDamageSystem - Handles fire damage and oxygen depletion
 * 
 * Features:
 * - Fire damage when player is too close to active fires
 * - Oxygen depletion in smoke/gas areas
 * - Gas mask protection reduces oxygen depletion
 * - Oxygen recovery when in safe areas
 * - Health damage when oxygen reaches 0
 * - Coughing sound when in smoke without gas mask
 */
export default function HazardDamageSystem() {
  const damageIndicatorRef = useRef(false);
  const lastCoughTime = useRef(0);
  const lastFireDamageSoundTime = useRef(0);
  const deathSoundPlayed = useRef(false);
  const invulnerabilityEndTime = useRef(0);
  const COUGH_COOLDOWN = 3000; // Minimum 3 seconds between coughs
  const FIRE_DAMAGE_SOUND_COOLDOWN = 2000; // Minimum 2 seconds between fire damage sounds
  
  // Track if player recently took damage for visual feedback
  const setDamageIndicator = (value: boolean) => {
    damageIndicatorRef.current = value;
  };

  useFrame((state, delta) => {
    const playerState = usePlayer.getState();
    const { hazards } = useFireSafety.getState();
    const { difficulty } = useSettings.getState();
    const { position, health, oxygen, hasGasMask, lastRespawnTime } = playerState;

    // Apply difficulty profile to damage/oxygen rates
    const profile =
      DIFFICULTY_PROFILES[difficulty] ?? DIFFICULTY_PROFILES[DifficultyLevel.Beginner];
    const FIRE_DAMAGE_RATE = GAME_CONSTANTS.FIRE_DAMAGE_RATE * profile.fireDamageMultiplier;
    const OXYGEN_DEPLETION_RATE =
      GAME_CONSTANTS.OXYGEN_DEPLETION_RATE * profile.oxygenDepletionMultiplier;
    
    // Update post-respawn invulnerability window (e.g. 2.5 seconds after respawn/reset)
    const nowMs = performance.now();
    if (lastRespawnTime && lastRespawnTime > 0) {
      // Convert Date.now() (ms since start) to a relative window using performance.now()
      if (invulnerabilityEndTime.current === 0) {
        invulnerabilityEndTime.current = nowMs + 2500;
      } else if (nowMs > invulnerabilityEndTime.current) {
        invulnerabilityEndTime.current = 0;
      }
    }

    const isInvulnerable = invulnerabilityEndTime.current > nowMs;

    // Check for player death
    if (health <= 0) {
      // Play death sound once
      if (!deathSoundPlayed.current) {
        useAudio.getState().playDeath();
        deathSoundPlayed.current = true;
      }
      return;
    }
    
    // Reset death sound flag if player is alive (for respawn scenarios)
    if (deathSoundPlayed.current && health > 0) {
      deathSoundPlayed.current = false;
    }
    
    let isNearFire = false;
    let isInSmoke = false;
    let closestFireDistance = Infinity;
    let maxFireSeverity = 0;
    
    // Check proximity to all active hazards
    for (const hazard of hazards) {
      if (!hazard.isActive || hazard.isExtinguished) continue;
      
      // Calculate distance to hazard
      const dx = position.x - hazard.position.x;
      const dz = position.z - hazard.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      // Check if this is a fire-type hazard
      const isFireHazard = [
        HazardType.ClassAFire,
        HazardType.ClassBFire,
        HazardType.ClassCFire,
        HazardType.ClassDFire,
        HazardType.ClassKFire,
        HazardType.StoveTop,
        HazardType.Fireplace,
        HazardType.Candle,
        HazardType.SpacerHeater,
        HazardType.CloggedDryer
      ].includes(hazard.type);
      
      // Check if this is a smoke/gas hazard
      const isSmokeHazard = [
        HazardType.GasLeak,
        HazardType.SmokeScreen,
        HazardType.ChemicalSpill
      ].includes(hazard.type) || hazard.isSmoking;
      
      // Fire damage check
      if (isFireHazard && distance < GAME_CONSTANTS.FIRE_DAMAGE_RANGE) {
        isNearFire = true;
        if (distance < closestFireDistance) {
          closestFireDistance = distance;
          maxFireSeverity = Math.max(maxFireSeverity, hazard.severity);
        }
      }
      
      // Smoke/oxygen depletion check
      if ((isSmokeHazard || (isFireHazard && hazard.isSmoking)) && distance < GAME_CONSTANTS.SMOKE_RANGE) {
        isInSmoke = true;
      }
    }
    
    // === FIRE DAMAGE ===
    if (isNearFire && !isInvulnerable) {
      // Damage scales with proximity and fire severity
      // Closer = more damage, higher severity = more damage
      const proximityFactor = 1 - (closestFireDistance / GAME_CONSTANTS.FIRE_DAMAGE_RANGE);
      const damageAmount = FIRE_DAMAGE_RATE * delta * proximityFactor * (0.5 + maxFireSeverity * 0.5);
      
      playerState.takeDamage(damageAmount);
      setDamageIndicator(true);
      
      // Play fire damage sound with cooldown
      const now = Date.now();
      if (now - lastFireDamageSoundTime.current > FIRE_DAMAGE_SOUND_COOLDOWN) {
        useAudio.getState().playFireDamage();
        lastFireDamageSoundTime.current = now;
      }
      
    } else {
      setDamageIndicator(false);
    }
    
    // === COUGHING - Enclosed space with fire means smoke everywhere ===
    // Player coughs periodically when they don't have a gas mask
    // This simulates being in a smoke-filled burning building
    if (!hasGasMask && !isInvulnerable) {
      const now = Date.now();
      // Cough more frequently when near fire/smoke, less when further away
      const coughInterval = isInSmoke || isNearFire ? COUGH_COOLDOWN : COUGH_COOLDOWN * 2;
      
      if (now - lastCoughTime.current > coughInterval) {
        useAudio.getState().playCough();
        lastCoughTime.current = now;
      }
    }
    
    // === OXYGEN DEPLETION ===
    if (isInSmoke && !isInvulnerable) {
      // Gas mask blocks oxygen depletion (kid-friendly, clear feedback)
      const protectionFactor = hasGasMask ? 0 : 1;
      const oxygenLoss = OXYGEN_DEPLETION_RATE * delta * protectionFactor;
      
      playerState.depleteOxygen(oxygenLoss);
    } else if (!hasGasMask) {
      // Even outside direct smoke areas, enclosed space has ambient smoke
      // Much slower oxygen depletion when not directly in smoke (10% of main rate)
      const ambientOxygenLoss = OXYGEN_DEPLETION_RATE * delta * 0.1;
      playerState.depleteOxygen(ambientOxygenLoss);
    } else {
      // With gas mask and not in direct smoke, oxygen recovers slowly
      if (oxygen < PLAYER_CONSTANTS.MAX_OXYGEN) {
        playerState.replenishOxygen(GAME_CONSTANTS.OXYGEN_RECOVERY_RATE * delta);
      }
    }
  });

  // This component doesn't render anything visible
  return null;
}
