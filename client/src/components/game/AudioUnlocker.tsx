import { useEffect, useRef } from "react";
import { Howler } from "howler";

/**
 * AudioUnlocker component that unlocks the AudioContext after user interaction.
 * This prevents the "AudioContext was not allowed to start" warnings.
 */
export default function AudioUnlocker() {
  const unlockedRef = useRef(false);

  useEffect(() => {
    if (unlockedRef.current) return;

    const unlockAudio = () => {
      if (unlockedRef.current) return;
      
      // Unlock Howler's AudioContext
 
      const ctx = (Howler as any).ctx;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          unlockedRef.current = true;
        }).catch((err: unknown) => {
          console.warn('Failed to unlock audio context:', err);
        });
      } else if (ctx) {
        // Context exists but is already running
        unlockedRef.current = true;
      } else {
        // Create a dummy sound to initialize the context, then unlock it
        // ensures Howler's AudioContext is created
        try {
          const dummySound = new (window as any).Howl({
            src: ['data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='],
            volume: 0,
            html5: false,
          });
          // Play and immediately stop to initialize the context
          dummySound.play();
          dummySound.stop();
          dummySound.unload();
          
          // Try to unlock after a short delay to ensure context is created
          setTimeout(() => {
            const newCtx = (Howler as any).ctx;
            if (newCtx && newCtx.state === 'suspended') {
              newCtx.resume().then(() => {
                unlockedRef.current = true;
              });
            } else {
              unlockedRef.current = true;
            }
          }, 100);
        } catch (err) {
          // If that fails, just mark as unlocked to avoid repeated attempts
          unlockedRef.current = true;
        }
      }
    };

    // Try to unlock on any user interaction
    const events = ['click', 'touchstart', 'keydown', 'mousedown'];
    
    const handlers: Array<() => void> = [];
    
    const createHandler = (eventIndex: number) => {
      return () => {
        unlockAudio();
        // Remove all listeners after first unlock
        events.forEach((e, idx) => {
          if (handlers[idx]) {
            document.removeEventListener(e, handlers[idx]);
          }
        });
      };
    };

    events.forEach((event, index) => {
      const handler = createHandler(index);
      handlers.push(handler);
      document.addEventListener(event, handler, { once: true, passive: true });
    });

    return () => {
      handlers.forEach((handler, index) => {
        if (handler) {
          document.removeEventListener(events[index], handler);
        }
      });
    };
  }, []);

  return null;
}

