// Uses Web Audio API to generate sound effects without external assets

class AudioService {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    // AudioContext must be initialized after a user interaction
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      if (this.gainNode) {
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSuccess() {
    this.init();
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.1);
    
    const gain = this.ctx.createGain();
    gain.connect(this.ctx.destination);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  public playError() {
    this.init();
    if (!this.ctx || !this.gainNode) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.2);

    const gain = this.ctx.createGain();
    gain.connect(this.ctx.destination);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  public playVictory() {
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major Arpeggio
    let time = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(time);
      osc.stop(time + 0.5);
      
      time += 0.1;
    });
  }
}

export const audioService = new AudioService();