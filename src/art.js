// Desenhos esquemáticos (SVG) dos organismos sem modelo 3D.
// Vista dorsal com a cabeça à esquerda, salvo indicação. viewBox 0 0 200 120, eixo médio y = 60.
const W = '#e4d8b6', W2 = '#d6c79c';
const f = (n) => Math.round(n * 10) / 10;
const pl = (pts, w = 1.8) => `<polyline class="ink" fill="none" stroke-width="${w}" points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}"/>`;
const el = (cx, cy, rx, ry, fill = W, rot = 0, w = 1.8) => `<ellipse class="ink" stroke-width="${w}" cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${rot ? `transform="rotate(${rot} ${f(cx)} ${f(cy)})"` : ''}/>`;
const path = (d, fill = W, w = 1.8) => `<path class="ink" stroke-width="${w}" d="${d}" fill="${fill}"/>`;
const dot = (x, y, r = 2) => `<circle class="fillk" cx="${f(x)}" cy="${f(y)}" r="${r}"/>`;
// par de patas espelhado: steps = [[dx,dy],...] para a pata de cima (dy positivo = para fora)
const legs = (x, off, steps, w = 1.6, cy = 60) => {
  const up = [[x, cy - off]], dn = [[x, cy + off]];
  let a = [x, cy - off], b = [x, cy + off];
  for (const [dx, dy] of steps) { a = [a[0] + dx, a[1] - dy]; b = [b[0] + dx, b[1] + dy]; up.push(a); dn.push(b); }
  return pl(up, w) + pl(dn, w);
};
const svg = (inner, vb = '0 0 200 120') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

export const ART = {
  trilobite: () => {
    let s = path('M30,60 C30,22 70,14 78,16 L78,104 C70,106 30,98 30,60Z', W);
    for (const sg of [1, -1]) s += pl([[78, 60 - 44 * sg], [86, 60 - 52 * sg]], 1.6);
    for (let i = 0; i < 10; i++) { const x = 80 + i * 7.5; const h = 40 - i * 1.2; s += path(`M${x},${60 - h} L${x + 7},${60 - h + 1} L${x + 7},${60 + h - 1} L${x},${60 + h}Z`, i % 2 ? W : W2, 1.4); }
    s += path('M155,26 C182,34 186,86 155,94Z', W);
    s += path('M40,60 C40,48 60,44 76,48 L76,72 C60,76 40,72 40,60Z', W2, 1.4); // glabela
    s += pl([[80, 50], [168, 54]], 1.2) + pl([[80, 70], [168, 66]], 1.2);
    s += el(60, 40, 6, 4, '#bfb08a') + el(60, 80, 6, 4, '#bfb08a');
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">cefalão · tórax · pigídio (3 lobos)</text>`;
    return svg(s);
  },
  pycnogonid: () => {
    let s = '';
    for (const [x, a] of [[72, -40], [88, -15], [104, 15], [120, 40]]) {
      const r = (a * Math.PI) / 180;
      s += legs(x, 5, [[Math.sin(r) * 18, 16], [Math.sin(r) * 22 + 6, 18], [Math.sin(r) * 10 + 10, 8], [8, -8]], 1.5);
    }
    s += el(96, 60, 32, 5, W) + el(56, 60, 12, 4, W2) + el(132, 60, 6, 3, W);
    s += legs(66, 4, [[-4, 9], [-6, 4]], 1.1);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">tronco fino · probóscide · 4 pares de patas</text>`;
    return svg(s);
  },
  limulus: () => {
    let s = '';
    s += path('M25,60 C25,15 85,12 96,22 L100,34 L100,86 L96,98 C85,108 25,105 25,60Z', W);
    s += path('M100,36 L136,42 L146,60 L136,78 L100,84Z', W2);
    for (let i = 0; i < 6; i++) { const x = 106 + i * 6; s += pl([[x, 42 + i], [x + 4, 36 + i]], 1.2) + pl([[x, 78 - i], [x + 4, 84 - i]], 1.2); }
    s += pl([[146, 60], [192, 60]], 2.4);
    s += el(70, 38, 5, 2.5, '#2b2a26') + el(70, 82, 5, 2.5, '#2b2a26');
    s += pl([[40, 60], [98, 60]], 1) + path('M45,40 C70,36 90,40 98,44', 'none', 1) + path('M45,80 C70,84 90,80 98,76', 'none', 1);
    return svg(s);
  },
  spider: () => {
    let s = '';
    const L = [[78, [[-8, 14], [-14, 18], [-12, 10], [-6, 2]]], [86, [[-2, 16], [-6, 20], [-6, 12], [-2, 4]]], [94, [[4, 16], [8, 18], [8, 12], [4, 2]]], [101, [[8, 14], [16, 16], [16, 10], [8, 2]]]];
    for (const [x, st] of L) s += legs(x, 8, st, 1.6);
    s += legs(68, 5, [[-8, 6], [-8, 3]], 1.3);
    s += el(88, 60, 21, 16, W) + el(132, 60, 28, 21, W2) + pl([[108, 60], [104, 60]], 4);
    for (const [x, y] of [[71, 57], [71, 63], [74, 54], [74, 66], [69, 59], [69, 61]]) s += dot(x, y, 1.2);
    return svg(s);
  },
  scorpion: () => {
    let s = '';
    for (const [x, st] of [[62, [[-2, 12], [-6, 10], [-4, 4]]], [68, [[0, 13], [-2, 11], [0, 4]]], [74, [[4, 12], [4, 11], [4, 3]]], [80, [[6, 11], [8, 10], [6, 3]]]]) s += legs(x, 8, st, 1.4);
    // pedipalpos com quelas
    for (const sg of [1, -1]) { s += pl([[50, 60 - 6 * sg], [40, 60 - 20 * sg], [24, 60 - 24 * sg]], 2.2); s += el(16, 60 - 25 * sg, 9, 5, W2, -20 * sg); s += pl([[8, 60 - 22 * sg], [2, 60 - 18 * sg]], 1.6) + pl([[8, 60 - 28 * sg], [2, 60 - 30 * sg]], 1.6); }
    s += el(62, 60, 14, 11, W);
    for (let i = 0; i < 7; i++) s += path(`M${74 + i * 7},${50 - (i < 4 ? i : 7 - i)} L${81 + i * 7},${50 - (i < 4 ? i : 7 - i)} L${81 + i * 7},${70 + (i < 4 ? i : 7 - i)} L${74 + i * 7},${70 + (i < 4 ? i : 7 - i)}Z`, W2, 1.3);
    let x = 123, y = 60;
    for (let i = 0; i < 5; i++) { const nx = x + 10, ny = y - (i > 1 ? 7 : 2); s += el((x + nx) / 2, (y + ny) / 2, 6, 4, W, Math.atan2(ny - y, nx - x) * 57); x = nx; y = ny; }
    s += el(x + 2, y - 7, 5, 4, W2) + pl([[x + 2, y - 11], [x - 4, y - 18]], 1.8);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">prossoma · mesossoma · metassoma + aguilhão</text>`;
    return svg(s);
  },
  harvestman: () => {
    let s = '';
    for (const [x, a] of [[94, -1], [98, -0.4], [102, 0.4], [106, 1]]) s += legs(x, 8, [[a * 20, 18], [a * 32, 24], [a * 30, 10]], 1.2);
    s += el(100, 60, 14, 10, W);
    s += dot(96, 60, 2);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">corpo num só bloco · patas muito longas</text>`;
    return svg(s);
  },
  mite: () => {
    let s = '';
    for (const [x, a] of [[86, -1], [94, -0.4], [104, 0.4], [112, 1]]) s += legs(x, 18, [[a * 8, 10], [a * 8, 8]], 1.8);
    s += el(102, 60, 24, 22, W) + el(76, 60, 6, 5, W2);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">corpo sem divisão visível · 4 pares de patas</text>`;
    return svg(s);
  },
  remipede: () => {
    let s = '';
    for (let i = 0; i < 26; i++) { const x = 46 + i * 5; s += legs(x, 6, [[2, 8], [3, 4]], 1); }
    for (let i = 0; i < 26; i++) s += el(48 + i * 5, 60, 3.2, 7 - i * 0.12, i % 2 ? W : W2, 0, 1);
    s += el(38, 60, 8, 7, W) + pl([[32, 57], [10, 46]], 1.3) + pl([[32, 63], [10, 74]], 1.3) + pl([[32, 58], [16, 54]], 1.3) + pl([[32, 62], [16, 66]], 1.3);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">tronco com muitos segmentos iguais (cavernas marinhas)</text>`;
    return svg(s);
  },
  cephalocarid: () => {
    let s = '';
    for (let i = 0; i < 9; i++) s += legs(58 + i * 7, 9, [[2, 8], [4, 5]], 1.1);
    s += path('M30,60 C30,44 44,42 52,44 L54,76 C44,78 30,76 30,60Z', W);
    for (let i = 0; i < 9; i++) s += el(58 + i * 7, 60, 4, 10, W, 0, 1.2);
    for (let i = 0; i < 11; i++) s += el(124 + i * 5, 60, 2.6, 5 - i * 0.2, W2, 0, 1);
    s += pl([[178, 58], [194, 52]], 1.2) + pl([[178, 62], [194, 68]], 1.2);
    s += pl([[30, 57], [16, 50]], 1.2) + pl([[30, 63], [16, 70]], 1.2);
    return svg(s);
  },
  triops: () => {
    let s = '';
    for (let i = 0; i < 12; i++) s += legs(70 + i * 4, 10, [[1, 9], [1, 3]], 0.9);
    s += path('M30,60 C30,20 110,18 128,30 L128,90 C110,102 30,100 30,60Z', W);
    for (let i = 0; i < 8; i++) s += el(132 + i * 5, 60, 3, 7 - i * 0.5, W2, 0, 1);
    s += pl([[170, 58], [196, 46]], 1.4) + pl([[170, 62], [196, 74]], 1.4);
    s += el(52, 54, 3, 2, '#2b2a26') + el(52, 66, 3, 2, '#2b2a26');
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">Triops — escudo dorsal, muitas patas foliáceas</text>`;
    return svg(s);
  },
  ostracod: () => {
    let s = path('M50,62 C50,30 140,26 152,52 C158,78 120,96 80,92 C60,90 50,80 50,62Z', W);
    s += path('M54,62 C70,56 120,54 150,56', 'none', 1.2);
    s += pl([[60, 50], [44, 34], [34, 30]], 1.4) + pl([[64, 74], [46, 88], [36, 96]], 1.4);
    s += dot(70, 50, 2.2);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">Ostracoda — carapaça bivalve (vista lateral)</text>`;
    return svg(s);
  },
  copepod: () => {
    let s = '';
    s += pl([[60, 56], [40, 30], [10, 18]], 1.4) + pl([[60, 64], [40, 90], [10, 102]], 1.4);
    s += path('M58,60 C58,44 82,40 104,46 L104,74 C82,80 58,76 58,60Z', W);
    for (let i = 0; i < 4; i++) s += el(108 + i * 7, 60, 4, 12 - i * 1.5, W, 0, 1.2);
    for (let i = 0; i < 4; i++) s += el(138 + i * 6, 60, 3, 4, W2, 0, 1.1);
    s += pl([[160, 58], [184, 48]], 1.2) + pl([[160, 62], [184, 72]], 1.2);
    s += dot(62, 60, 2.2);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">Copepoda — antênulas longas, olho naupliar</text>`;
    return svg(s);
  },
  barnacle: () => {
    let s = '';
    s += path('M50,100 L68,40 L100,30 L132,40 L150,100Z', W);
    s += pl([[68, 40], [78, 100]], 1.2) + pl([[100, 30], [100, 100]], 1.2) + pl([[132, 40], [122, 100]], 1.2);
    s += path('M86,36 C90,26 110,26 114,36', W2);
    for (let i = 0; i < 6; i++) { const a = -1.2 + i * 0.48; s += path(`M100,30 C${100 + Math.sin(a) * 14},${18} ${100 + Math.sin(a) * 30},${8} ${100 + Math.sin(a) * 34},${14 + Math.abs(a) * 4}`, 'none', 1.2); }
    s += pl([[40, 100], [160, 100]], 2);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">Cirripedia — placas calcárias, cirros filtradores</text>`;
    return svg(s);
  },
  argulus: () => {
    let s = path('M40,60 C40,20 120,16 140,34 L150,60 L140,86 C120,104 40,100 40,60Z', W);
    s += el(68, 46, 8, 8, W2) + el(68, 74, 8, 8, W2);
    for (let i = 0; i < 4; i++) s += legs(96 + i * 10, 18, [[4, 10], [6, 6]], 1.2);
    s += path('M148,52 C170,46 176,60 170,62 C176,64 170,74 148,68', W2);
    s += dot(56, 54, 2) + dot(56, 66, 2);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">Branchiura (Argulus) — ventosas, parasita de peixes</text>`;
    return svg(s);
  },
  isopod: () => {
    let s = '';
    for (let i = 0; i < 7; i++) s += legs(62 + i * 11, 22, [[1, 8], [3, 5]], 1.3);
    s += pl([[42, 52], [26, 36], [16, 32]], 1.4) + pl([[42, 68], [26, 84], [16, 88]], 1.4);
    s += el(46, 60, 9, 14, W2);
    for (let i = 0; i < 7; i++) s += el(62 + i * 11, 60, 6.5, 27 - Math.abs(i - 3) * 1.5, W, 0, 1.3);
    for (let i = 0; i < 5; i++) s += el(140 + i * 6, 60, 3.5, 17 - i * 2.5, W2, 0, 1.2);
    s += path('M168,52 L180,60 L168,68Z', W);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">Isopoda — achatado dorsoventralmente, 7 pares de patas</text>`;
    return svg(s);
  },
  amphipod: () => {
    let s = '';
    s += path('M40,54 C60,30 130,28 160,48 C172,58 172,74 160,82 L150,76 C150,64 140,56 120,54 C90,52 60,58 48,66Z', W);
    for (let i = 0; i < 7; i++) s += pl([[60 + i * 13, 58 - i * 0.5], [58 + i * 13, 74], [62 + i * 13, 88]], 1.4);
    s += pl([[42, 52], [20, 36], [8, 34]], 1.3) + pl([[42, 56], [22, 50], [10, 52]], 1.3);
    s += dot(46, 50, 2.2);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">Amphipoda — comprimido lateralmente (vista lateral)</text>`;
    return svg(s);
  },
  krill: () => {
    let s = '';
    s += path('M30,56 C40,44 90,42 120,48 C150,52 172,60 186,70 L176,74 C150,66 120,66 90,68 C60,70 36,66 30,56Z', W);
    for (let i = 0; i < 8; i++) s += pl([[50 + i * 8, 64], [46 + i * 8, 80], [42 + i * 8, 88]], 1.2);
    for (let i = 0; i < 5; i++) s += pl([[118 + i * 10, 66], [116 + i * 10, 78]], 1.1);
    s += pl([[32, 54], [6, 40]], 1.2) + pl([[32, 56], [10, 54]], 1.2);
    s += el(40, 50, 5, 5, '#2b2a26');
    for (let i = 0; i < 6; i++) s += dot(60 + i * 18, 70, 1.5);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">Euphausiacea (krill) — fotóforos; base das cadeias antárticas</text>`;
    return svg(s);
  },
  crab: () => {
    let s = '';
    for (const [x, a] of [[92, -0.3], [100, 0], [108, 0.3], [116, 0.6]]) s += legs(x, 24, [[a * 10, 16], [a * 16 + 4, 14], [a * 8 + 4, 8]], 1.8);
    for (const sg of [1, -1]) { s += pl([[78, 60 - 16 * sg], [64, 60 - 30 * sg], [48, 60 - 32 * sg]], 2.4); s += el(40, 60 - 32 * sg, 10, 6, W2, 10 * sg); }
    s += path('M70,60 C70,30 130,26 136,44 C142,60 142,60 136,76 C130,94 70,90 70,60Z', W);
    s += dot(74, 52, 2.2) + dot(74, 68, 2.2);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">Decapoda (caranguejo) — abdómen dobrado por baixo</text>`;
    return svg(s);
  },
  centipede: () => {
    let s = '';
    const n = 15;
    for (let i = 0; i < n; i++) { const x = 40 + i * 9; const last = i === n - 1; s += legs(x, 6, last ? [[8, 10], [16, 8], [10, 2]] : [[2, 9], [3, 6]], 1.3); }
    for (let i = 0; i < n; i++) s += el(40 + i * 9, 60, 5, 7, i % 2 ? W : W2, 0, 1.2);
    s += el(28, 60, 7, 7, W) + pl([[22, 57], [10, 44], [4, 30]], 1.3) + pl([[22, 63], [10, 76], [4, 90]], 1.3);
    s += path('M33,55 C38,50 40,54 36,57', 'none', 2) + path('M33,65 C38,70 40,66 36,63', 'none', 2);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">1 par de patas por segmento · forcípulas venenosas</text>`;
    return svg(s);
  },
  millipede: () => {
    let s = '';
    const n = 22;
    for (let i = 0; i < n; i++) { const x = 34 + i * 6.6; if (i > 3) { s += legs(x - 1.5, 6, [[0, 7]], 1); s += legs(x + 1.5, 6, [[0, 7]], 1); } else if (i > 0) s += legs(x, 6, [[0, 7]], 1); }
    for (let i = 0; i < n; i++) s += el(34 + i * 6.6, 60, 3.8, 7, i % 2 ? W : W2, 0, 1.1);
    s += el(24, 60, 6, 7, W) + pl([[19, 57], [12, 50]], 1.3) + pl([[19, 63], [12, 70]], 1.3);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">diplossegmentos: 2 pares de patas por "segmento"</text>`;
    return svg(s);
  },
  pauropod: () => {
    let s = '';
    for (let i = 0; i < 9; i++) s += legs(62 + i * 9, 8, [[2, 9], [3, 5]], 1.2);
    for (let i = 0; i < 6; i++) s += el(66 + i * 13, 60, 7, 10, W, 0, 1.2);
    s += el(50, 60, 8, 8, W);
    for (const sg of [1, -1]) { s += pl([[44, 60 - 4 * sg], [34, 60 - 14 * sg]], 1.3); s += pl([[34, 60 - 14 * sg], [20, 60 - 18 * sg]], 1.2) + pl([[34, 60 - 14 * sg], [26, 60 - 28 * sg]], 1.2); }
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">minúsculo · antenas ramificadas · 9 pares de patas</text>`;
    return svg(s);
  },
  symphylan: () => {
    let s = '';
    for (let i = 0; i < 12; i++) s += legs(48 + i * 8.5, 6, [[2, 8], [3, 5]], 1.1);
    for (let i = 0; i < 13; i++) s += el(48 + i * 8.5, 60, 4.5, 7, i % 2 ? W : W2, 0, 1.1);
    s += el(36, 60, 7, 7, W) + pl([[30, 57], [16, 44], [6, 38]], 1.3) + pl([[30, 63], [16, 76], [6, 82]], 1.3);
    s += pl([[156, 58], [166, 52]], 1.6) + pl([[156, 62], [166, 68]], 1.6);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">12 pares de patas · fieiras no fim (sínfilos)</text>`;
    return svg(s);
  },
  insect: () => {
    let s = '';
    s += path('M84,58 C110,30 150,22 176,26 C160,40 120,52 92,60Z', '#efe8d2', 1.4) + path('M84,62 C110,90 150,98 176,94 C160,80 120,68 92,60Z', '#efe8d2', 1.4);
    s += path('M96,58 C118,40 140,34 158,36 C150,46 124,54 100,60Z', '#efe8d2', 1.2) + path('M96,62 C118,80 140,86 158,84 C150,74 124,66 100,60Z', '#efe8d2', 1.2);
    s += legs(70, 6, [[-6, 10], [-8, 8]], 1.5) + legs(82, 7, [[2, 12], [-2, 10]], 1.5) + legs(92, 7, [[10, 14], [10, 10]], 1.5);
    s += el(56, 60, 9, 9, W) + el(80, 60, 14, 9, W2) + el(124, 60, 30, 9, W);
    s += pl([[48, 56], [34, 42], [28, 30]], 1.3) + pl([[48, 64], [34, 78], [28, 90]], 1.3);
    s += el(52, 53, 3, 3, '#2b2a26') + el(52, 67, 3, 3, '#2b2a26');
    return svg(s);
  },
  daphnia: () => {
    let s = path('M70,58 C72,30 140,28 150,52 C156,70 140,88 110,90 C86,92 70,80 70,58Z', W);
    s += pl([[150, 70], [184, 84]], 1.6);
    s += path('M50,56 C46,40 70,36 76,48 L74,74 C66,76 56,80 54,86 C50,80 52,70 50,56Z', W2);
    s += el(56, 50, 6, 6, '#2b2a26');
    s += pl([[70, 46], [86, 20], [106, 14]], 1.5) + pl([[86, 20], [110, 24]], 1.5);
    s += el(110, 44, 14, 6, '#d6c27a', 0, 1.2);
    s += `<text x="100" y="116" font-size="9" fill="#5a5444" text-anchor="middle">Daphnia (Cladocera) — vista lateral</text>`;
    return svg(s);
  },
  // ---- larvas e ciclos ----
  nauplius: () => {
    let s = el(100, 60, 22, 28, W);
    s += legs(92, 18, [[-14, 18], [-12, 8]], 1.6) + legs(100, 22, [[0, 16], [6, 12]], 1.6) + legs(108, 20, [[10, 14], [14, 8]], 1.6);
    s += dot(84, 60, 3);
    return svg(s);
  },
  zoea: () => {
    let s = path('M70,60 C70,36 110,34 118,52 C122,62 112,74 96,76 C80,78 70,72 70,60Z', W);
    s += pl([[94, 36], [90, 10]], 1.6) + pl([[72, 62], [50, 70]], 1.6);
    s += path('M116,60 C140,64 156,70 170,82 L176,76', 'none', 1.8) + el(64, 56, 5, 5, '#2b2a26');
    for (let i = 0; i < 3; i++) s += pl([[86 + i * 8, 74], [84 + i * 8, 92]], 1.3);
    return svg(s);
  },
  mysis: () => {
    let s = path('M40,56 C50,44 100,42 130,50 C150,56 166,62 176,72 L168,76 C148,68 120,66 90,68 C62,70 44,66 40,56Z', W);
    for (let i = 0; i < 5; i++) { s += pl([[60 + i * 10, 64], [56 + i * 10, 82]], 1.3) + pl([[60 + i * 10, 66], [66 + i * 10, 80]], 1.1); }
    s += pl([[42, 54], [16, 42]], 1.2) + el(48, 50, 4, 4, '#2b2a26');
    return svg(s);
  },
  shrimp: () => {
    let s = path('M30,54 C40,40 90,38 120,44 C150,50 168,58 180,70 L170,76 C150,66 120,64 90,66 C60,68 34,64 30,54Z', W);
    for (let i = 0; i < 5; i++) s += pl([[52 + i * 9, 62], [50 + i * 9, 80], [54 + i * 9, 88]], 1.3);
    for (let i = 0; i < 5; i++) s += pl([[110 + i * 11, 64], [108 + i * 11, 76]], 1.1);
    s += path('M30,50 C10,30 4,20 2,10', 'none', 1.2) + el(40, 48, 4, 4, '#2b2a26') + pl([[34, 46], [14, 44]], 1.8);
    return svg(s);
  },
  egg: () => svg(el(100, 60, 14, 20, '#efe3b0') + path('M94,48 C96,44 104,44 106,48', 'none', 1)),
  caterpillar: () => {
    let s = '';
    for (let i = 0; i < 12; i++) s += el(46 + i * 10, 60 + Math.sin(i * 0.7) * 4, 7, 9, i % 2 ? '#cfe0a0' : '#e8e0a0', 0, 1.2);
    s += el(36, 58, 8, 9, '#2b2a26');
    for (let i = 0; i < 3; i++) s += pl([[50 + i * 10, 68], [50 + i * 10, 74]], 1.4);
    for (const x of [96, 106, 116, 126, 156]) s += pl([[x, 70], [x, 75]], 2.4);
    return svg(s);
  },
  pupa: () => svg(path('M100,18 C120,26 124,70 108,98 L92,98 C76,70 80,26 100,18Z', '#c8d8a0') + pl([[100, 18], [100, 8]], 2) + path('M88,46 C96,52 104,52 112,46', 'none', 1.2) + dot(104, 40, 1.6) + dot(96, 72, 1.6)),
  butterfly: () => {
    let s = path('M100,58 C80,20 40,18 30,34 C24,50 50,62 98,62Z', '#f0a85a') + path('M100,62 C70,64 46,80 54,96 C62,106 88,92 100,66Z', '#e89048');
    s += path('M100,58 C120,20 160,18 170,34 C176,50 150,62 102,62Z', '#f0a85a') + path('M100,62 C130,64 154,80 146,96 C138,106 112,92 100,66Z', '#e89048');
    s += el(100, 66, 3, 22, '#2b2a26') + pl([[99, 46], [90, 30]], 1.2) + pl([[101, 46], [110, 30]], 1.2);
    return svg(s);
  },
};

export const art = (k) => ART[k]();
