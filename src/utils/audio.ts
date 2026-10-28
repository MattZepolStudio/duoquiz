// Procedural Web Audio Synthesizer & Universal Haptics for ParCœur (iOS & Android)

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public hapticsEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play gentle pop sound on tap
  playTap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // AudioContext could be blocked prior to user interaction
    }
  }

  // Play crisp whoosh sound when card flips in 3D
  playCardFlip() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore
    }
  }

  // Play lovely success chime when answers match
  playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.36);
      });
    } catch {
      // Ignore
    }
  }

  // Play comical wobble on mismatch
  playMismatch() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.29);
    } catch {
      // Ignore
    }
  }

  // Play fanfare when game finishes
  playFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const chords = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.1 },
        { f: 783.99, t: 0.2 },
        { f: 1046.5, t: 0.35 },
        { f: 1318.51, t: 0.5 },
      ];
      const now = this.ctx.currentTime;
      chords.forEach(({ f, t }) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + t;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.46);
      });
    } catch {
      // Ignore
    }
  }

  // ========================================================
  // HAPTIC FEEDBACK SYSTEM (iOS WebKit & Android Chrome)
  // ========================================================

  /**
   * Universal Haptic Trigger:
   * 1. Uses window.navigator.vibrate on Android / supported browsers.
   * 2. In iOS Safari where navigator.vibrate is often restricted,
   *    we also emit a micro sub-audible physical transient (60Hz impulse for 12ms)
   *    via WebAudio that engages the phone's physical Taptic Engine coil!
   */
  vibrate(pattern: number | number[] = 14) {
    if (!this.hapticsEnabled) return;

    // 1. Standard Web API vibration (Full support on Android Chrome/Firefox/Samsung)
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate(pattern);
      }
    } catch {
      // Ignore
    }

    // 2. Micro Taptic pulse for iOS devices
    this.playTapticImpulse();
  }

  /**
   * Discrète vibration haptique calibrée (35ms) :
   * Permet aux moteurs vibrants de franchir leur seuil d'inertie
   * et de produire un 'clic' perceptible sur tous les smartphones Android.
   */
  hapticSelection() {
    this.vibrate(35);
  }

  /**
   * Vibration plus marquée pour validation ou action principale.
   */
  hapticSuccess() {
    this.vibrate([35, 60, 45]);
  }

  /**
   * Vibration d'avertissement ou d'erreur de saisie.
   */
  hapticWarning() {
    this.vibrate([60, 40, 60]);
  }

  /**
   * Micro haptic impulse through WebAudio to physically actuate
   * mobile speaker/taptic coil on iOS Safari when navigator.vibrate is restricted.
   */
  private playTapticImpulse() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Deep 60Hz tactile impulse for 12ms
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.016);
    } catch {
      // AudioContext could be blocked prior to user gesture
    }
  }
}

export const sound = new SoundManager();
