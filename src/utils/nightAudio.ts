/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Browser Web Audio API sound synthesizer for soothing night study ambience
// 100% client-side, zero external assets, lightweight and respectful of user privacy.

class NightAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentTrack: 'drone' | 'rain' | 'fireplace' = 'drone';
  private activeNodes: { stop: () => void; disconnect: () => void }[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.masterGain.gain.setTargetAtTime(clamped * 0.25, this.ctx.currentTime, 0.05);
    }
  }

  public play(track: 'drone' | 'rain' | 'fireplace' = 'drone') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.currentTrack = track;
    this.isPlaying = true;

    try {
      if (track === 'drone') {
        this.startBinauralDrone();
      } else if (track === 'rain') {
        this.startRainSynth();
      } else {
        this.startWarmHearth();
      }
    } catch {
      // Audio autoplay policy fallback
      this.isPlaying = false;
    }
  }

  public stop() {
    this.activeNodes.forEach(node => {
      try {
        node.stop();
      } catch {
        // already stopped
      }
      try {
        node.disconnect();
      } catch {
        // already disconnected
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  public toggle(track?: 'drone' | 'rain' | 'fireplace'): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play(track || this.currentTrack);
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): string {
    return this.currentTrack;
  }

  // 432 Hz Soothing Harmonic Deep Space Drone with gentle slow filter sweep
  private startBinauralDrone() {
    if (!this.ctx || !this.masterGain) return;

    const baseFreqs = [108, 216, 432]; // Sacred calm proportions
    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, this.ctx!.currentTime);

      const vol = 0.08 / (idx + 1);
      gain.gain.setValueAtTime(0, this.ctx!.currentTime);
      gain.gain.linearRampToValueAtTime(vol, this.ctx!.currentTime + 2.5);

      // Subtle LFO modulation for breathing oceanic drift
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.03, this.ctx!.currentTime);
      lfoGain.gain.setValueAtTime(15, this.ctx!.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start();
      lfo.start();

      this.activeNodes.push({
        stop: () => {
          osc.stop();
          lfo.stop();
        },
        disconnect: () => {
          gain.disconnect();
          filter.disconnect();
        }
      });
    });
  }

  // Gentle nocturnal rain shower noise synthesizer
  private startRainSynth() {
    if (!this.ctx || !this.masterGain) return;

    // Buffer of pink-ish noise
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.12;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();

    this.activeNodes.push({
      stop: () => whiteNoise.stop(),
      disconnect: () => {
        gain.disconnect();
        filter.disconnect();
      }
    });
  }

  // Cozy library hearth / warm resonance
  private startWarmHearth() {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(144, this.ctx.currentTime); // Warm harmonic fifth
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(216, this.ctx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + 2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();

    this.activeNodes.push({
      stop: () => {
        osc1.stop();
        osc2.stop();
      },
      disconnect: () => {
        gain.disconnect();
        filter.disconnect();
      }
    });
  }
}

export const nightAudio = new NightAudioSynthesizer();
