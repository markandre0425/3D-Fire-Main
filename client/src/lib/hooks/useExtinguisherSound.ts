import { useRef, useEffect, useCallback } from "react";

type Maybe<T> = T | null;

export const useExtinguisherSound = () => {
  const audioContextRef = useRef<Maybe<AudioContext>>(null);
  const sourceRef = useRef<Maybe<AudioBufferSourceNode>>(null);
  const gainRef = useRef<Maybe<GainNode>>(null);

  const initAudio = () => {
    if (typeof window === "undefined") return;
    if (!audioContextRef.current) {
      const AudioCtx =
        window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioCtx) return;
      audioContextRef.current = new AudioCtx();
    }
  };

  const startSpray = useCallback(() => {
    initAudio();
    const ctx = audioContextRef.current;

    // Already playing or context missing
    if (!ctx || sourceRef.current) return;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2173;
    filter.Q.value = 1;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 0.1);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();

    sourceRef.current = noise;
    gainRef.current = gainNode;
  }, []);

  const stopSpray = useCallback(() => {
    const ctx = audioContextRef.current;
    const gain = gainRef.current;
    const source = sourceRef.current;

    if (!ctx || !gain || !source) return;

    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    const stopSource = () => {
      try {
        source.stop();
      } catch {
        // ignore stop errors
      }

      source.disconnect();
      gain.disconnect();
      sourceRef.current = null;
      gainRef.current = null;
    };

    if (typeof window !== "undefined") {
      window.setTimeout(stopSource, 200);
    } else {
      stopSource();
    }
  }, []);

  useEffect(() => {
    return () => {
      stopSpray();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [stopSpray]);

  return { startSpray, stopSpray };
};

