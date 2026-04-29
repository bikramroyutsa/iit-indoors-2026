import { useCallback, useRef, useEffect, useState } from "react";

// Global state for mute to persist across component re-renders
let globalIsMuted = false;
let globalBgmAudio: HTMLAudioElement | null = null;

export const useSound = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(globalIsMuted);

  const toggleMute = useCallback(() => {
    globalIsMuted = !globalIsMuted;
    setIsMuted(globalIsMuted);

    // Also mute/unmute active BGM
    if (globalBgmAudio) {
      globalBgmAudio.muted = globalIsMuted;
    }
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const getAudioContext = useCallback(() => {
    if (globalIsMuted) return null;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Digital Birds: Randomized high-pitched chirps with variety
  const playDigitalBird = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Choose a random chirp style (0 to 3)
    const style = Math.floor(Math.random() * 4);
    // Expanded pitch range for more variety (Low: 1500Hz, High: 6500Hz)
    const baseFreq = 1500 + Math.random() * 5000;

    const playChirp = (startTime: number, duration: number, startFreq: number, endFreq: number, type: OscillatorType = "sine") => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

      // Calculate gain based on frequency (inverse relationship to avoid piercing highs)
      const targetGain = 0.12 - (startFreq / 10000) * 0.1;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(targetGain, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    };

    switch (style) {
      case 0: // Quick Slide Down (Original)
        playChirp(now, 0.15, baseFreq, baseFreq * 0.4);
        break;
      case 1: // Slide Up
        playChirp(now, 0.2, baseFreq * 0.6, baseFreq * 1.2);
        break;
      case 2: // Double Chirp
        playChirp(now, 0.08, baseFreq, baseFreq * 0.7);
        playChirp(now + 0.12, 0.1, baseFreq * 1.1, baseFreq * 0.8);
        break;
      case 3: // Warble / Techy
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq, now);

        lfo.type = "sine";
        lfo.frequency.setValueAtTime(20, now);
        lfoGain.gain.setValueAtTime(baseFreq * 0.2, now);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        lfo.start(now);
        osc.start(now);
        lfo.stop(now + 0.3);
        osc.stop(now + 0.3);
        break;
    }
  }, [getAudioContext]);

  // Dice Roll: Filtered noise "thump"
  const playDiceThump = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    // Add slight variety to the thump pitch
    const baseFreq = 400 + Math.random() * 100;
    filter.frequency.setValueAtTime(baseFreq, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.1);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }, [getAudioContext]);

  // Success Chime: Retro digital arpeggio
  const playSuccessChime = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Major arpeggio
    playNote(523.25, now, 0.1); // C5
    playNote(659.25, now + 0.1, 0.1); // E5
    playNote(783.99, now + 0.2, 0.1); // G5
    playNote(1046.50, now + 0.3, 0.4); // C6
  }, [getAudioContext]);

  // Battle Drum: Dramatic low-frequency thump for TechUnderground
  const playBattleDrum = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Deep sine wave for the body
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Noise burst for the "thump" attack
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.8);
    noise.start(now);
  }, [getAudioContext]);

  // Background Music (BGM) Management
  const startBGM = useCallback((url: string) => {
    if (typeof window === "undefined") return;

    if (!globalBgmAudio) {
      globalBgmAudio = new Audio(url);
      globalBgmAudio.loop = true;
      globalBgmAudio.volume = 0;
      globalBgmAudio.muted = globalIsMuted;
    } else if (globalBgmAudio.src !== window.location.origin + url) {
      globalBgmAudio.src = url;
    }

    globalBgmAudio.play().catch(e => console.log("BGM Play failed:", e));

    // Fade in
    let vol = 0;
    const fadeIn = setInterval(() => {
      if (!globalBgmAudio) return clearInterval(fadeIn);
      vol += 0.02;
      if (vol >= 0.012) {
        globalBgmAudio.volume = 0.012;
        clearInterval(fadeIn);
      } else {
        globalBgmAudio.volume = vol;
      }
    }, 100);
  }, []);

  const stopBGM = useCallback(() => {
    if (!globalBgmAudio) return;

    // Fade out
    let vol = globalBgmAudio.volume;
    const fadeOut = setInterval(() => {
      if (!globalBgmAudio) return clearInterval(fadeOut);
      vol -= 0.05;
      if (vol <= 0) {
        globalBgmAudio.volume = 0;
        globalBgmAudio.pause();
        clearInterval(fadeOut);
      } else {
        globalBgmAudio.volume = vol;
      }
    }, 100);
  }, []);

  return { playDigitalBird, playDiceThump, playSuccessChime, playBattleDrum, startBGM, stopBGM, toggleMute, isMuted };
};
