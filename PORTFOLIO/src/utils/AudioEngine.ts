class WebAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientGains: GainNode[] = [];
  private isMuted: boolean = false;
  
  public getIsMuted() {
    return this.isMuted;
  }
  
  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.70, this.ctx.currentTime, 0.1);
    }
    if (muted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
  
  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const compressor = this.ctx.createDynamicsCompressor();
      compressor.threshold.value = -18;
      compressor.knee.value = 12;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;
      compressor.connect(this.ctx.destination);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.70; // 70% master volume
      this.masterGain.connect(compressor);

      this.convolver = this.ctx.createConvolver();
      this.convolver.buffer = this.createSyntheticReverb(this.ctx, 4.0, 3.0);
      this.convolver.connect(this.masterGain);

      const handleTabHide = () => {
        if (this.masterGain && this.ctx) {
          try {
            this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
          } catch (e) {}
        }
        if (this.ctx && this.ctx.state === 'running') {
          try {
            this.ctx.suspend();
          } catch (e) {}
        }
      };

      const handleTabShow = () => {
        if (!this.isMuted && !document.hidden) {
          if (this.masterGain && this.ctx) {
            try {
              this.masterGain.gain.setValueAtTime(0.70, this.ctx.currentTime);
            } catch (e) {}
          }
          if (this.ctx && this.ctx.state === 'suspended') {
            try {
              this.ctx.resume();
            } catch (e) {}
          }
        }
      };

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) handleTabHide();
        else handleTabShow();
      });

      window.addEventListener('pagehide', handleTabHide);
      window.addEventListener('pageshow', handleTabShow);
      window.addEventListener('freeze', handleTabHide);
      window.addEventListener('resume', handleTabShow);
      window.addEventListener('blur', handleTabHide);
      window.addEventListener('focus', handleTabShow);

      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended' && !document.hidden) {
          this.ctx.resume().then(() => {
            if (!this.isMuted && this.ambientOscillators.length === 0) {
              this.startContinuousAtmosphere();
            }
          });
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
      };
      
      document.addEventListener('click', unlockAudio);
      document.addEventListener('keydown', unlockAudio);
      document.addEventListener('touchstart', unlockAudio);
      document.addEventListener('pointerdown', unlockAudio);
    }
    if (this.ctx.state === 'suspended' && !document.hidden) {
      this.ctx.resume();
    }
  }

  public resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended' && !document.hidden) {
      this.ctx.resume().then(() => {
        if (!this.isMuted && this.ambientOscillators.length === 0) {
          this.startContinuousAtmosphere();
        }
      });
    }
  }

  private createSyntheticReverb(ctx: AudioContext, duration: number, decay: number) {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, sampleRate);
    
    for (let i = 0; i < 2; i++) {
      const channel = impulse.getChannelData(i);
      for (let j = 0; j < length; j++) {
        channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, decay);
      }
    }
    return impulse;
  }

  // =========================================================
  // ADVANCED ROBOTICS INTRO SOUNDS
  // =========================================================

  public playWireMovement() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.3);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.1);
    gain.gain.linearRampToValueAtTime(0, t + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playWireConnection(pitchOffset: number = 0) {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220 + pitchOffset, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.4);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    if (this.convolver) gain.connect(this.convolver);
    
    osc.start(t);
    osc.stop(t + 0.6);
  }

  public playSignalRun() {
    if (!this.ctx || !this.masterGain) return;
  }

  public playComponentActivation(_type: 'processor' | 'sensor' | 'motor' | 'servo') {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(329.63, t); // E4
    osc.frequency.linearRampToValueAtTime(440, t + 0.5); // A4
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    if (this.convolver) gain.connect(this.convolver);
    osc.start(t);
    osc.stop(t + 0.8);
  }

  public playFinalInitialization() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t); // A2
    osc.frequency.linearRampToValueAtTime(55, t + 1.0); // A1
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.5);
    gain.gain.linearRampToValueAtTime(0, t + 1.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    if (this.convolver) gain.connect(this.convolver);
    
    osc.start(t);
    osc.stop(t + 1.2);
  }

  public playCinematicLowResonance() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(65.41, t); // C2
    osc.frequency.exponentialRampToValueAtTime(32.7, t + 3.0); // C1
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 1.0); 
    gain.gain.linearRampToValueAtTime(0, t + 4.0); 
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    if (this.convolver) gain.connect(this.convolver);
    osc.start(t);
    osc.stop(t + 4.0);
  }

  public playIdentitySound() {
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, t); 
    osc.frequency.exponentialRampToValueAtTime(80, t + 1.0); 
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.05); 
    gain.gain.linearRampToValueAtTime(0, t + 2.0); 
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    if (this.convolver) gain.connect(this.convolver);
    osc.start(t);
    osc.stop(t + 2.0);
  }

  private musicIntervalId: any = null;
  private currentStep: number = 0;

  public startContinuousAtmosphere() {
    if (!this.ctx || !this.masterGain) return;
    
    if (this.ambientOscillators.length > 0) return;
    
    const t = this.ctx.currentTime;
    
    // 1. Soft Warm Musical Chord Pad (D Major 9 - Soothing background harmony)
    const padFreqs = [146.83, 220.00, 277.18, 369.99]; // D3, A3, C#4, F#4
    padFreqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const filter = this.ctx!.createBiquadFilter();
      const gain = this.ctx!.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, t);
      filter.frequency.linearRampToValueAtTime(500, t + 6.0);
      filter.frequency.linearRampToValueAtTime(350, t + 12.0);
      
      // Soft background volume
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.02, t + 3.0); 
      
      osc.connect(filter);
      filter.connect(gain);
      if (this.convolver) gain.connect(this.convolver);
      else gain.connect(this.masterGain!); 
      
      osc.start(t);
      this.ambientOscillators.push(osc);
      this.ambientGains.push(gain);
    });

    // 2. Continuous Musical Arpeggio / Chill Piano Tune (Plays relaxing melodic notes)
    if (this.musicIntervalId) clearInterval(this.musicIntervalId);
    this.currentStep = 0;

    // Peaceful Pentatonic Musical Notes (D4, E4, F#4, A4, B4, C#5, D5, F#5)
    const melodyNotes = [
      293.66, 369.99, 440.00, 554.37, 
      493.88, 369.99, 329.63, 440.00,
      587.33, 554.37, 440.00, 369.99,
      329.63, 293.66, 369.99, 440.00
    ];

    this.musicIntervalId = setInterval(() => {
      if (this.isMuted || !this.ctx || !this.masterGain || document.hidden || this.ctx.state !== 'running') return;
      
      const noteFreq = melodyNotes[this.currentStep % melodyNotes.length];
      this.playPianoNote(noteFreq);
      this.currentStep++;
    }, 1400); // Gentle 1.4s musical tempo
  }

  private playPianoNote(freq: number) {
    if (!this.ctx || !this.masterGain || this.isMuted || document.hidden || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Soft warm synth piano tone
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, t);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, t); // Soft octave harmonic

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, t);
    filter.frequency.exponentialRampToValueAtTime(200, t + 1.8);

    // Envelope: Fast soft attack, smooth exponential decay
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.03); 
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);

    if (this.convolver) gain.connect(this.convolver);
    else gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 2.3);
    osc2.stop(t + 2.3);
  }

  public stopContinuousAtmosphere() {
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }

    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    
    this.ambientGains.forEach(gain => {
      try {
        gain.gain.cancelScheduledValues(t);
        gain.gain.linearRampToValueAtTime(0, t + 2.0);
      } catch (e) {}
    });
    
    this.ambientOscillators.forEach(osc => {
      try {
        osc.stop(t + 2.1);
      } catch (e) {}
    });
    
    setTimeout(() => {
      this.ambientOscillators = [];
      this.ambientGains = [];
    }, 2500);
  }

  public playRoboticVoice(_text: string) {
    // Removed voice over as per user request
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public stopAll() {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
    
    this.ambientOscillators = [];
    this.ambientGains = [];
    this.masterGain = null;
    this.convolver = null;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const AudioEngine = new WebAudioEngine();
