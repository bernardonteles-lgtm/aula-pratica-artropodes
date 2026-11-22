// Geradores de diagramas SVG (árvores, cladogramas, ciclos) em estilo "giz".
import { ART } from './art.js';

const esc = (t) => t;

// Árvore retangular (filogenia tradicional). node: {c:[...], y, label, hl, s, dash} | {leaf:'Nome', hl, dash}
export function rectTree(root, { W = 1000, H = 600, leafY = 150, x0 = 60, x1 = 940, step } = {}) {
  const leaves = [];
  const walk = (n) => { if (n.leaf) leaves.push(n); else n.c.forEach(walk); };
  walk(root);
  const dx = (x1 - x0) / (leaves.length - 1);
  leaves.forEach((l, i) => (l.x = x0 + i * dx));
  const pos = (n) => { if (n.leaf) return n.x; n.x = n.c.map(pos).reduce((a, b) => a + b, 0) / n.c.length; return n.x; };
  pos(root);
  let out = '';
  const attr = (n) => `${n.hl != null ? `data-hl="${n.hl}"` : ''} ${n.s != null ? `data-s="${n.s}"` : ''}`;
  const draw = (n) => {
    if (n.leaf) {
      out += `<text x="${n.x + 4}" y="${leafY - 10}" transform="rotate(-62 ${n.x + 4} ${leafY - 10})" class="lbl2 ${n.hl != null ? 'hl' : ''}" ${attr(n)} font-size="15">${n.leaf}</text>`;
      return;
    }
    for (const ch of n.c) {
      const top = ch.leaf ? leafY : ch.y;
      const da = ch.dash ? 'stroke-dasharray="5 5"' : '';
      out += `<polyline class="chalk ${ch.hl != null ? 'hl' : ''}" ${ch.hl != null ? `data-hl="${ch.hl}"` : ''} ${da} stroke-width="2.4" points="${ch.x},${top} ${ch.x},${n.y} ${n.x},${n.y}"/>`;
      draw(ch);
    }
    if (n.label) {
      const lines = n.label.split('|');
      const w = Math.max(...lines.map((l) => l.length)) * 6.6 + 14;
      const h = lines.length * 15 + 8;
      const lx = Math.min(Math.max(n.x - w / 2, 4), W - w - 4), ly = n.y + 8;
      out += `<g ${n.s != null ? `data-s="${n.s}"` : ''}><rect class="nodebox ${n.hl != null ? 'hl' : ''}" ${n.hl != null ? `data-hl="${n.hl}"` : ''} x="${lx}" y="${ly}" rx="5" width="${w}" height="${h}"/>`;
      lines.forEach((l, i) => (out += `<text x="${lx + w / 2}" y="${ly + 16 + i * 15}" text-anchor="middle" font-size="${i ? 11.5 : 13}" class="${i ? 'small' : 'lbl2'}">${l}</text>`));
      out += `</g>`;
    }
  };
  draw(root);
  out += `<polyline class="chalk ${root.hl != null ? 'hl' : ''}" ${root.hl != null ? `data-hl="${root.hl}"` : ''} stroke-width="2.4" points="${root.x},${root.y} ${root.x},${H - 10}"/>`;
  return out;
}

// Cladograma inclinado com caracteres (estilo Hickman). node: {name, c, chars:[], s, hl, art}
export function slantTree(root, { W = 1000, H = 560, top = 120, x0 = 90, x1 = 910, k = 0.62, rootLen = 40, artH = 0, fs = 12.5 } = {}) {
  const leaves = [];
  const walk = (n) => { if (!n.c) leaves.push(n); else n.c.forEach(walk); };
  walk(root);
  const dx = leaves.length > 1 ? (x1 - x0) / (leaves.length - 1) : 0;
  leaves.forEach((l, i) => { l.x = x0 + i * dx; l.y = top; l.lo = l.hi = l.x; });
  const pos = (n) => { if (!n.c) return; n.c.forEach(pos); n.lo = Math.min(...n.c.map((c) => c.lo)); n.hi = Math.max(...n.c.map((c) => c.hi)); n.x = (n.lo + n.hi) / 2; n.y = top + (n.hi - n.lo) * k; };
  pos(root);
  let out = '';
  const ticks = (a, b, chars, s, side) => {
    if (!chars || !chars.length) return;
    const n = chars.length;
    chars.forEach((c, i) => {
      const t = (i + 1) / (n + 1);
      const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      const right = side === 'r';
      out += `<g ${s != null ? `data-s="${s}"` : ''}><line class="tick" x1="${x - 7}" y1="${y}" x2="${x + 7}" y2="${y}"/>`;
      out += `<line class="tick" stroke-dasharray="2 3" x1="${right ? x + 8 : x - 8}" y1="${y}" x2="${right ? x + 22 : x - 22}" y2="${y}" style="opacity:.5"/>`;
      out += `<text class="ch" font-size="${fs}" x="${right ? x + 26 : x - 26}" y="${y + 4}" text-anchor="${right ? 'start' : 'end'}">${c}</text></g>`;
    });
  };
  const draw = (n) => {
    if (n.c) for (const ch of n.c) {
      out += `<line class="chalk ${ch.hl != null ? 'hl' : ''}" ${ch.hl != null ? `data-hl="${ch.hl}"` : ''} ${ch.s != null ? `data-s="${ch.s}"` : ''} stroke-width="5" stroke-opacity=".55" x1="${n.x}" y1="${n.y}" x2="${ch.x}" y2="${ch.y}"/>`;
      const side = ch.side || (ch.x < n.x ? 'l' : 'r');
      ticks([n.x, n.y], [ch.x, ch.y], ch.chars, ch.cs ?? ch.s, side);
      draw(ch);
    } else {
      if (n.art && ART[n.art]) out += `<g ${n.s != null ? `data-s="${n.s}"` : ''}><rect x="${n.x - 52}" y="${n.y - 42 - artH}" width="104" height="${artH}" rx="6" fill="#f4eedd"/><svg x="${n.x - 50}" y="${n.y - 40 - artH}" width="100" height="${artH - 4}" viewBox="0 0 200 120">${ART[n.art]().replace(/^<svg[^>]*>|<\/svg>$/g, '').replace(/<text[^>]*>.*?<\/text>/g, '')}</svg></g>`;
      out += `<text x="${n.x}" y="${n.y - 14}" text-anchor="middle" class="lbl2 hand ${n.hl != null ? 'hl' : ''}" ${n.hl != null ? `data-hl="${n.hl}"` : ''} ${n.s != null ? `data-s="${n.s}"` : ''} font-size="${(n.fs || 19) * 1.15}">${n.name}</text>`;
    }
    if (n.c && n.name) out += `<text x="${n.x + 10}" y="${n.y + 18}" class="small" ${n.s != null ? `data-s="${n.s}"` : ''} font-style="italic">${n.name}</text>`;
  };
  draw(root);
  out += `<line class="chalk" stroke-width="5" stroke-opacity=".55" x1="${root.x}" y1="${root.y}" x2="${root.x - rootLen * 0.7}" y2="${root.y + rootLen}"/>`;
  ticks([root.x - rootLen * 0.7, root.y + rootLen], [root.x, root.y], root.chars, root.cs, 'r');
  return out;
}

export const embed = (key, x, y, w, h, bg = true) =>
  `${bg ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#f4eedd"/>` : ''}<svg x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" viewBox="0 0 200 120">${ART[key]().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`;

export const arrow = (x1, y1, x2, y2, cls = '') => {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 11;
  return `<g class="${cls}"><line class="chalk" stroke-width="2.4" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><polyline class="chalk" stroke-width="2.4" points="${x2 - L * Math.cos(a - 0.45)},${y2 - L * Math.sin(a - 0.45)} ${x2},${y2} ${x2 - L * Math.cos(a + 0.45)},${y2 - L * Math.sin(a + 0.45)}"/></g>`;
};
