/**
 * TRAVORA Sound Synthesizer & Speech Engine
 * Web Audio API synthesizer for discreet ringtones, gentle chimes,
 * and Web Speech Synthesis for realistic Fake Call voice dialogue.
 * (SOS siren alarm sound has been removed per safety specifications)
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private ringtoneInterval: any = null;
  private isRinging: boolean = false;

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
      return null;
    }
  }

  /**
   * Realistic Phone Ringtone (gentle electronic ring cadence)
   */
  startRingtone() {
    if (this.isRinging) return;
    this.isRinging = true;

    // Trigger device vibration if supported
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([1000, 800, 1000, 800, 1000]);
      } catch (e) {
        // Ignore vibration errors
      }
    }

    const playChimeSequence = () => {
      const ctx = this.getContext();
      if (!ctx || !this.isRinging) return;

      const now = ctx.currentTime;
      const notes = [
        { freq: 440, time: 0, dur: 0.12 },
        { freq: 554.37, time: 0.14, dur: 0.14 },
        { freq: 659.25, time: 0.30, dur: 0.16 },
        { freq: 880, time: 0.48, dur: 0.25 },
        { freq: 659.25, time: 0.85, dur: 0.14 },
        { freq: 880, time: 1.02, dur: 0.35 },
      ];

      notes.forEach(({ freq, time, dur }) => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + time);

          gain.gain.setValueAtTime(0, now + time);
          gain.gain.linearRampToValueAtTime(0.18, now + time + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + time);
          osc.stop(now + time + dur);
        } catch (e) {
          // ignore
        }
      });
    };

    playChimeSequence();
    this.ringtoneInterval = setInterval(() => {
      if (this.isRinging) {
        playChimeSequence();
      }
    }, 2800);
  }

  stopRingtone() {
    this.isRinging = false;
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(0);
      } catch (e) {
        // ignore
      }
    }
  }

  /**
   * Trip Timer Warning Chime (soft discreet double tone)
   */
  playWarningChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [
      { freq: 523.25, time: 0 },
      { freq: 659.25, time: 0.2 },
    ].forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);
      gain.gain.setValueAtTime(0.15, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + 0.3);
    });
  }

  /**
   * Loud Audible Alarm for SOS has been completely disabled per user requirement:
   * "Remove SOS alarms sound only."
   */
  playSirenAlarm(_durationMs: number = 3000) {
    // Intentionally silent - discreet emergency broadcast with zero audible alarm
    return;
  }

  /**
   * Speak persona voice dialogue in realistic caller pitch and cadence for up to 1 minute
   */
  speakPersonaDialogue(text: string, pitch: number = 1.0, rate: number = 1.0) {
    if ('speechSynthesis' in window && text && text.trim()) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = Math.max(0.75, Math.min(1.15, rate));
      utterance.pitch = Math.max(0.7, Math.min(1.4, pitch));

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const femaleVoice = voices.find(
          (v) =>
            v.lang.includes('en') &&
            (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen'))
        );
        const maleVoice = voices.find(
          (v) =>
            v.lang.includes('en') &&
            (v.name.includes('Male') || v.name.includes('Alex') || v.name.includes('Daniel') || v.name.includes('Fred'))
        );
        if (pitch < 0.9 && maleVoice) {
          utterance.voice = maleVoice;
        } else if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    }
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundEffects = new SoundSynthesizer();
