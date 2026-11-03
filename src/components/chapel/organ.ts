/**
 * Nhạc nền nhẹ trong Nhà nguyện: tiếng organ tự tổng hợp bằng Web Audio (không dùng bản nhạc có bản quyền).
 * Vòng hợp âm chậm F – Dm – B♭ – C, mỗi hợp âm ~7 giây, có vang nhẹ.
 */
const CHORDS = [
  [41, 53, 57, 60, 65], // F
  [38, 50, 57, 62, 65], // Dm
  [46, 50, 53, 58, 62], // Bb
  [48, 52, 55, 60, 64], // C
];
const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export class Organ {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private timer: number | null = null;
  private step = 0;

  start() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx(); this.ctx = ctx;
    const out = ctx.createGain(); out.gain.value = 0; out.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 3); this.out = out;
    // vang: 2 nhánh trễ có phản hồi
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
    out.connect(lp); lp.connect(ctx.destination);
    for (const [t, fb] of [[0.23, 0.45], [0.37, 0.4]]) {
      const d = ctx.createDelay(1); d.delayTime.value = t; const g = ctx.createGain(); g.gain.value = fb;
      lp.connect(d); d.connect(g); g.connect(d); g.connect(ctx.destination);
    }
    const play = () => {
      const now = ctx.currentTime, dur = 7.4, notes = CHORDS[this.step++ % CHORDS.length];
      notes.forEach((m, i) => {
        for (const [type, mul, vol] of [['sine', 1, 0.5], ['triangle', 2, 0.18], ['sine', 4, 0.06]] as const) {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = type; o.frequency.value = hz(m) * mul; o.detune.value = (i - 2) * 3;
          g.gain.setValueAtTime(0, now); g.gain.linearRampToValueAtTime(vol * (i === 0 ? 0.9 : 0.55), now + 1.6);
          g.gain.setValueAtTime(vol * (i === 0 ? 0.9 : 0.55), now + dur - 1.8); g.gain.linearRampToValueAtTime(0, now + dur + 0.4);
          o.connect(g); g.connect(out); o.start(now); o.stop(now + dur + 0.5);
        }
      });
    };
    play();
    this.timer = window.setInterval(play, 7000);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const ctx = this.ctx, out = this.out;
    this.ctx = null; this.out = null;
    if (ctx && out) { out.gain.cancelScheduledValues(ctx.currentTime); out.gain.linearRampToValueAtTime(0, ctx.currentTime + 1); setTimeout(() => ctx.close(), 1200); }
  }
}
