// Sons da urna. Se existirem sounds/tecla.mp3 e sounds/confirma.mp3 eles sao usados;
// caso contrario, usa um som sintetizado parecido (fallback).
const Sons = (() => {
  let ctx = null;
  const buffers = {};

  async function carregar(nome, url) {
    try {
      const r = await fetch(url);
      if (!r.ok) return;
      buffers[nome] = await ctx.decodeAudioData(await r.arrayBuffer());
    } catch { /* arquivo ausente: usa o fallback */ }
  }

  function init() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      carregar('tecla', 'sounds/tecla.mp3');
      carregar('confirma', 'sounds/confirma.mp3');
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  function arquivo(nome) {
    if (!ctx || !buffers[nome]) return false;
    const s = ctx.createBufferSource();
    s.buffer = buffers[nome];
    s.connect(ctx.destination);
    s.start();
    return true;
  }

  function tom(freq, dur, vol) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square';
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  }

  return {
    init,
    tecla() { if (ctx && !arquivo('tecla')) tom(1100, 0.07, 0.15); },
    confirma() { if (ctx && !arquivo('confirma')) tom(780, 1.2, 0.2); },
  };
})();
