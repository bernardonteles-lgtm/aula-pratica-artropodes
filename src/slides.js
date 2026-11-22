// Guião da aula: cada diapositivo tem passos; → avança um passo.
import { ART } from './art.js';
import { rectTree, slantTree, embed, arrow } from './diagrams.js';

let rr = 0;
const card = (k, title, sub, text, s, extra = '') => `<div class="card ${extra}" data-s="${s}" style="--r:${[-1.2, 0.8, -0.4, 1.1, -0.9, 0.5][rr++ % 6]}deg">${ART[k]().replace(/<text[^>]*>.*?<\/text>/g, '')}<h3>${title}<small>${sub}</small></h3><p>${text}</p></div>`;
const S = (inner, vb = '0 0 1000 600') => `<svg class="full" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" ${o.a ? `text-anchor="${o.a}"` : ''} class="${o.c || 'lbl2'}" font-size="${o.fs || 15}" ${o.s != null ? `data-s="${o.s}"` : ''} ${o.hl != null ? `data-hl="${o.hl}"` : ''}>${t}</text>`;

// ---------------- árvores ----------------
const tradTree = () => rectTree({
  y: 545, label: 'Coanoflagelado colonial ancestral', hl: 1, c: [
    { leaf: 'Porifera' },
    { y: 495, label: 'Eumetazoa|tecidos verdadeiros', hl: 1, c: [
      { y: 375, label: 'Radiata|simetria radial; diploblásticos', c: [{ leaf: 'Cnidaria' }, { leaf: 'Ctenophora' }] },
      { y: 440, label: 'Bilateria|simetria bilateral; triblásticos', hl: 1, c: [
        { leaf: 'Platyhelminthes' },
        { y: 380, label: 'Cavidades corporais', hl: 1, c: [
          { y: 290, label: 'Pseudocelomados', c: [{ leaf: 'Rotifera' }, { leaf: 'Nematoda' }] },
          { y: 300, label: 'Celomados', hl: 1, c: [
            { leaf: 'Nemertea', dash: true },
            { y: 230, label: 'Protostomia|celoma de massas celulares', hl: 1, c: [
              { leaf: 'Mollusca' },
              { y: 185, label: 'Articulata?', hl: 2, s: 2, c: [{ leaf: 'Annelida', hl: 2 }, { leaf: 'Arthropoda', hl: 1 }] },
            ] },
            { y: 230, label: 'Lofoforados', dash: true, c: [{ leaf: 'Bryozoa' }, { leaf: 'Phoronida' }, { leaf: 'Brachiopoda' }] },
            { y: 230, label: 'Deuterostomia|celoma do tubo digestivo', c: [{ leaf: 'Echinodermata' }, { leaf: 'Chordata' }] },
          ] },
        ] },
      ] },
    ] },
  ],
});

const modernTree = () => rectTree({
  y: 520, label: 'Metazoa', c: [
    { leaf: 'Porifera' }, { leaf: 'Ctenophora' }, { leaf: 'Cnidaria' },
    { y: 450, label: 'Bilateria', c: [
      { y: 380, label: 'Deuterostomia', c: [{ leaf: 'Echinodermata' }, { leaf: 'Chordata' }] },
      { y: 400, label: 'Protostomia', c: [
        { y: 320, label: 'Spiralia (Lophotrochozoa)|muitos com clivagem espiral / trocófora', c: [{ leaf: 'Platyhelminthes' }, { leaf: 'Rotifera' }, { leaf: 'Nemertea' }, { leaf: 'Mollusca' }, { leaf: 'Annelida', hl: 4 }, { leaf: 'Bryozoa' }, { leaf: 'Brachiopoda' }] },
        { y: 320, label: 'Ecdysozoa|cutícula que muda (ecdise)', hl: 4, c: [
          { leaf: 'Nematoda' },
          { y: 240, label: 'Panarthropoda', hl: 4, c: [{ leaf: 'Tardigrada' }, { leaf: 'Onychophora' }, { leaf: 'Arthropoda', hl: 4 }] },
        ] },
      ] },
    ] },
  ],
}, { x0: 60, x1: 940 });

// Arthropoda: visão moderna
const arthTree = () => slantTree({
  c: [
    { name: 'Chelicerata', chars: ['quelíceras', 'sem antenas'], c: [{ name: 'Pycnogonida', fs: 16 }, { name: 'Euchelicerata', c: [{ name: 'Xiphosura', fs: 16 }, { name: 'Arachnida', fs: 16 }] }] },
    { name: 'Mandibulata', hl: 2, chars: ['mandíbulas', 'antenas'], c: [
      { name: 'Myriapoda', fs: 16, chars: ['órgãos de Tömösváry'] },
      { name: 'Pancrustacea', hl: 2, chars: ['omatídio com 4 células do cone'], c: [
        { name: '"Crustáceos"', fs: 16 },
        { name: 'Hexapoda', fs: 16, hl: 2, chars: ['3 pares de patas', 'tórax com 3 segmentos'] },
      ] },
    ] },
  ], chars: ['exosqueleto articulado', 'muda (ecdise)'],
}, { top: 70, x0: 110, x1: 800, k: 0.62, fs: 16 });

const chelTree = () => slantTree({
  chars: ['Cefalotórax e abdómen', 'Quelíceras e pedipalpos', '4 pares de patas', 'Perda das antenas'], cs: 1,
  c: [
    { name: 'Pycnogonida', art: 'pycnogonid', s: 0, chars: ['Ovígeros', 'Probóscide pré-oral', 'Abdómen reduzido', 'Vários gonóporos'], cs: 2 },
    { chars: ['Carapaça no cefalotórax', '2 olhos medianos', 'Somito genital no abdómen'], cs: 3, c: [
      { name: 'Merostomata', art: 'limulus', s: 0, chars: ['Brânquias foliáceas', 'Télson'], cs: 3 },
      { name: 'Arachnida', art: 'spider', s: 0, chars: ['Apêndices abdominais reduzidos ou modificados', 'Sensilas em fenda'], cs: 4, side: 'r' },
    ] },
  ],
}, { top: 175, x0: 190, x1: 740, k: 0.5, rootLen: 120, artH: 84, fs: 16 });

const uniTree = () => slantTree({
  chars: ['Mandíbulas de "membro inteiro"', 'Sistema traqueal', 'Túbulos de Malpighi', '1 par de antenas'], cs: 1,
  c: [
    { name: 'Myriapoda', chars: ['Órgãos de Tömösváry', 'Perda dos olhos compostos', 'Glândulas repugnatórias'], cs: 2, c: [
      { chars: ['Gnatoquilário', 'Diplossegmentos'], cs: 3, side: 'l', c: [{ name: 'Diplopoda', art: 'millipede', s: 0 }, { name: 'Pauropoda', art: 'pauropod', s: 0, chars: ['Antenas ramificadas'], cs: 3 }] },
      { chars: ['Forcípulas venenosas'], cs: 3, c: [{ name: 'Chilopoda', art: 'centipede', s: 0 }, { name: 'Symphyla', art: 'symphylan', s: 0, chars: ['Fieiras no 13.º segmento'], cs: 3 }] },
    ] },
    { name: 'Insecta', art: 'insect', s: 0, chars: ['Tórax com 3 segmentos', '2.ªs maxilas formam o lábio', 'Abdómen ≤ 11 segmentos', 'Sem patas abdominais'], cs: 4, side: 'r' },
  ],
}, { top: 150, x0: 130, x1: 880, k: 0.4, rootLen: 120, artH: 70, fs: 14 });

const insTree = () => slantTree({
  chars: ['Desenvolvimento direto (ametábolo)'], cs: 0,
  c: [
    { name: 'Entognatha', chars: ['Peças bucais entognatas'], cs: 1, side: 'l', c: [{ c: [{ name: 'Protura', fs: 15 }, { name: 'Collembola', fs: 15 }] }, { name: 'Diplura', fs: 15 }] },
    { name: 'Insecta', chars: ['Peças bucais ectognatas'], cs: 2, hl: 2, c: [
      { name: '"Thysanura"', fs: 15, chars: ['2–3 filamentos caudais'], cs: 2 },
      { name: 'Pterygota', chars: ['Asas + desenv. hemimetábolo'], cs: 3, c: [
        { name: 'Ephemeroptera', fs: 15, chars: ['Peças bucais vestigiais (adulto)'], cs: 3 },
        { c: [
          { name: 'Odonata', fs: 15, chars: ['Lábio preênsil (ninfa)'], cs: 3 },
          { name: 'Neoptera', chars: ['Asas dobram-se sobre o corpo'], cs: 4, c: [
            { c: [{ name: 'Ortopteroides', fs: 15 }, { name: 'Hemipteroides', fs: 15 }] },
            { name: 'Holometabola', fs: 15, chars: ['Metamorfose completa (pupa)'], cs: 5, hl: 5 },
          ] },
        ] },
      ] },
    ] },
  ],
}, { top: 110, x0: 150, x1: 790, k: 0.6, rootLen: 26, fs: 13.5 });

// ---------------- muda ----------------
const molt = () => {
  const cols = [
    ['Intermuda', 'Cutícula completa'],
    ['Apólise', 'A epiderme separa-se da cutícula velha e segrega nova epicutícula'],
    ['Digestão', 'Fluido de muda dissolve a endocutícula velha (reabsorvida); forma-se nova procutícula'],
    ['Ecdise', 'A cutícula velha (exúvia) rasga e é abandonada'],
    ['Pós-ecdise', 'Nova cutícula estica (o animal cresce), endurece e completa-se a endocutícula'],
  ];
  let s = '';
  cols.forEach(([t, d], i) => {
    const x = 30 + i * 194, g = `data-s="${i}"`;
    s += `<g ${g}>`;
    s += T(x + 85, 70, t, { a: 'middle', c: 'lbl2 hand', fs: 22 });
    const lay = (y, h, fill) => `<rect x="${x}" y="${y}" width="170" height="${h}" fill="${fill}" stroke="#2b2a26" stroke-width="1"/>`;
    const epid = (y) => { let r = ''; for (let k = 0; k < 7; k++) r += `<rect x="${x + k * 24.3}" y="${y}" width="24.3" height="44" fill="#8fb0d8" stroke="#2b2a26" stroke-width="1"/><circle cx="${x + k * 24.3 + 12}" cy="${y + 24}" r="4" fill="#2b4a7a"/>`; return r; };
    if (i === 0) s += lay(120, 6, '#7a4a1c') + lay(126, 50, '#b7772e') + lay(176, 70, '#ead9a0') + epid(246);
    if (i === 1) s += lay(110, 6, '#7a4a1c') + lay(116, 50, '#b7772e') + lay(166, 70, '#ead9a0') + lay(258, 4, '#7a4a1c') + epid(262);
    if (i === 2) s += lay(110, 6, '#7a4a1c') + lay(116, 50, '#b7772e') + lay(166, 22, '#ead9a0') + `<rect x="${x}" y="188" width="170" height="50" fill="rgba(160,200,230,.25)"/>` + T(x + 85, 218, 'fluido de muda', { a: 'middle', c: 'small', fs: 12 }) + lay(238, 4, '#7a4a1c') + lay(242, 20, '#c9944a') + epid(262);
    if (i === 3) s += `<g transform="rotate(-14 ${x + 85} 120)">${lay(96, 6, '#7a4a1c')}${lay(102, 40, '#b7772e')}</g>` + arrow(x + 150, 168, x + 160, 128) + lay(230, 4, '#7a4a1c') + lay(234, 28, '#c9944a') + epid(262);
    if (i === 4) s += lay(190, 6, '#7a4a1c') + lay(196, 34, '#b7772e') + lay(230, 32, '#ead9a0') + epid(262) + arrow(x + 10, 170, x - 6, 170) + arrow(x + 160, 170, x + 176, 170);
    s += `<foreignObject x="${x - 6}" y="320" width="182" height="120"><div xmlns="http://www.w3.org/1999/xhtml" style="color:#aab4a6;font-size:14px;line-height:1.35;text-align:center">${d}</div></foreignObject>`;
    if (i < 4) s += arrow(x + 172, 200, x + 192, 200);
    s += '</g>';
  });
  s += `<g data-s="5">${T(500, 480, 'Controlada pela hormona ecdisona (nos insetos, a hormona juvenil decide o tipo de muda)', { a: 'middle', c: 'lbl2', fs: 15 })}</g>`;
  return S(s);
};

// ---------------- apêndice birramoso ----------------
const biramous = () => {
  const o = '#e39a6f', e = '#7fa8d6', x = '#e8cf6a';
  let s = `<rect x="0" y="0" width="460" height="300" rx="10" fill="#f4eedd"/>`;
  s += `<rect x="40" y="200" width="70" height="44" rx="8" fill="${o}" stroke="#2b2a26"/><rect x="110" y="190" width="60" height="44" rx="8" fill="${o}" stroke="#2b2a26"/>`;
  [[170, 196, 200, 150], [200, 150, 250, 112], [250, 112, 310, 96], [310, 96, 370, 96]].forEach(([a, b, c, d], i) => (s += `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#2b2a26" stroke-width="${26 - i * 4}" stroke-linecap="round"/><line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${e}" stroke-width="${23 - i * 4}" stroke-linecap="round"/>`));
  [[170, 228, 230, 248], [230, 248, 300, 262], [300, 262, 370, 270]].forEach(([a, b, c, d], i) => (s += `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#2b2a26" stroke-width="${18 - i * 4}" stroke-linecap="round"/><line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${x}" stroke-width="${15 - i * 4}" stroke-linecap="round"/>`));
  for (let k = 0; k < 9; k++) s += `<line x1="${240 + k * 14}" y1="${250 + k * 2}" x2="${236 + k * 14}" y2="${280 + k * 2}" stroke="#7a6a4a" stroke-width="1"/>`;
  s += `<text x="60" y="275" font-size="15" fill="#2b2a26">protopodito</text><text x="60" y="292" font-size="12" fill="#5a5444">(coxa + base)</text>`;
  s += `<text x="300" y="70" font-size="15" fill="#2b2a26">endopodito</text><text x="380" y="292" font-size="15" fill="#2b2a26" text-anchor="end">exopodito</text>`;
  s += `<text x="230" y="30" font-size="20" fill="#2b2a26" text-anchor="middle" font-family="Kalam, cursive">Apêndice birramoso</text>`;
  return `<svg viewBox="0 0 460 300" style="width:100%;max-height:52vh">${s}</svg>`;
};

// ---------------- olho composto ----------------
const eye = () => {
  let s = '';
  // olho composto (semicírculo de omatídios)
  for (let k = 0; k < 15; k++) {
    const a = -1.2 + k * (2.4 / 14);
    const x1 = 210 + Math.cos(a) * 70, y1 = 290 + Math.sin(a) * 70, x2 = 210 + Math.cos(a) * 170, y2 = 290 + Math.sin(a) * 170;
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9fcbf0" stroke-width="10" stroke-opacity=".35"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f2a7a0" stroke-width="2"/><circle cx="${210 + Math.cos(a) * 176}" cy="${290 + Math.sin(a) * 176}" r="7" fill="#e7738a"/>`;
  }
  s += `<path d="M150,290 C170,250 190,240 210,240 M150,290 C170,330 190,340 210,340 M150,290 L80,290" class="chalk" stroke-width="3" stroke="#9fcbf0"/>`;
  s += T(60, 280, 'nervo ótico', { c: 'small', fs: 13 }) + T(210, 500, 'Olho composto', { a: 'middle', c: 'lbl2 hand', fs: 22 });
  // omatídio
  const X = 620;
  s += `<g data-s="1">`;
  s += `<path d="M${X - 40},70 Q${X},50 ${X + 40},70 L${X + 40},80 L${X - 40},80Z" fill="#dff1ff" stroke="#eceee4" stroke-width="1.5"/>`;
  s += `<path d="M${X - 34},82 L${X + 34},82 L${X},170Z" fill="#bfe3ff" stroke="#eceee4" stroke-width="1.5"/>`;
  s += `<path d="M${X - 40},80 L${X - 18},400 L${X - 30},400 L${X - 52},80Z M${X + 40},80 L${X + 18},400 L${X + 30},400 L${X + 52},80Z" fill="#6b8fc0" opacity=".8"/>`;
  s += `<path d="M${X - 18},170 L${X + 18},170 L${X + 12},400 L${X - 12},400Z" fill="#e7738a" stroke="#eceee4" stroke-width="1"/>`;
  s += `<rect x="${X - 3}" y="170" width="6" height="230" fill="#f6e3a0"/>`;
  s += `<path d="M${X},400 C${X},440 ${X - 30},460 ${X - 60},470" class="chalk" stroke-width="2.5"/>`;
  s += '</g>';
  const lab = (y, t, s2, tx = X + 70, px = X + 8) => `<g data-s="${s2}"><line x1="${px}" y1="${y}" x2="${tx - 6}" y2="${y}" class="chalk" stroke-width="1.2" stroke-dasharray="3 3"/>${T(tx, y + 5, t, { fs: 15 })}</g>`;
  s += lab(72, 'Córnea (lente)', 2, X + 70, X + 30) + lab(120, 'Cone cristalino', 2) + lab(250, 'Células retinulares (fotorrecetoras)', 3, X + 70, X + 12) + lab(300, 'Rabdoma (pigmento visual)', 3, X + 70, X + 2) + lab(200, 'Células pigmentares', 4, X + 70, X + 40) + lab(455, 'Axónios → nervo ótico', 4, X + 70, X - 30);
  s += `<g data-s="1">${arrow(390, 160, 540, 150)}${T(X, 40, 'Omatídio', { a: 'middle', c: 'lbl2 hand', fs: 22 })}</g>`;
  return S(s, '0 0 1000 540');
};

// ---------------- ciclos ----------------
const shrimpCycle = () => {
  const st = [['shrimp', 'Adulto', 0], ['egg', 'Ovo', 1], ['nauplius', 'Náuplio', 2], ['zoea', 'Protozoé', 3], ['mysis', 'Mísis', 4], ['shrimp', 'Pós-larva', 5]];
  const cx = 500, cy = 285, R = 215;
  let s = '';
  st.forEach(([k, n, i], j) => {
    const a = -Math.PI / 2 + (j / st.length) * Math.PI * 2;
    const x = cx + Math.cos(a) * R * 1.25, y = cy + Math.sin(a) * R;
    const sc = j === 5 ? 0.95 : 1.3;
    s += `<g data-s="${i}">${embed(k, x - 75 * sc, y - 50 * sc, 150 * sc, 92 * sc)}${T(x, y + 62 * sc, n, { a: 'middle', c: 'lbl2 hand', fs: 20 })}</g>`;
    const a2 = -Math.PI / 2 + ((j + 1) / st.length) * Math.PI * 2;
    const am = (a + a2) / 2;
    s += `<g data-s="${(j + 1) % 6 || 6}">${arrow(cx + Math.cos(a + 0.33) * R * 1.0, cy + Math.sin(a + 0.33) * R * 0.78, cx + Math.cos(a2 - 0.33) * R * 1.0, cy + Math.sin(a2 - 0.33) * R * 0.78)}</g>`;
  });
  s += `<g data-s="2">${T(cx, cy - 6, 'larva náuplio:', { a: 'middle', c: 'small', fs: 14 })}${T(cx, cy + 14, '3 pares de apêndices + olho mediano', { a: 'middle', c: 'small', fs: 14 })}</g>`;
  return S(s, '0 0 1000 560');
};

const holoCycle = () => {
  let s = '';
  const st = [['egg', 'Ovo', 0, 140, 130], ['caterpillar', 'Larva (lagarta)', 1, 500, 110], ['pupa', 'Pupa (crisálida)', 2, 840, 130], ['butterfly', 'Adulto (imago)', 3, 500, 330]];
  st.forEach(([k, n, i, x, y]) => (s += `<g data-s="${i}">${embed(k, x - 90, y - 56, 180, 112)}${T(x, y + 76, n, { a: 'middle', c: 'lbl2 hand', fs: 20 })}</g>`));
  s += `<g data-s="1">${arrow(240, 130, 400, 115)}</g><g data-s="2">${arrow(600, 115, 740, 130)}${T(500, 205, 'várias mudas (cresce)', { a: 'middle', c: 'small', fs: 13 })}</g><g data-s="3">${arrow(820, 215, 610, 320)}</g><g data-s="3">${arrow(390, 330, 160, 215)}</g>`;
  s += `<g data-s="4"><rect x="80" y="440" width="840" height="100" rx="10" fill="rgba(242,213,126,.08)" stroke="rgba(242,213,126,.5)" stroke-dasharray="6 5"/>`;
  s += T(500, 470, 'Hemimetábolos (ex.: gafanhoto, percevejo):', { a: 'middle', c: 'lbl2', fs: 16 });
  s += T(500, 500, 'ovo → ninfas (parecidas com o adulto, asas a crescer por fora) → adulto. Sem pupa.', { a: 'middle', c: 'small', fs: 15 });
  s += T(500, 525, 'Holometábolos: larva muito diferente do adulto; as asas desenvolvem-se por dentro e surgem na pupa.', { a: 'middle', c: 'small', fs: 15 }) + '</g>';
  return S(s, '0 0 1000 560');
};

// =====================================================================
export const SLIDES = [
  // ---------------- INTRODUÇÃO ----------------
  {
    sec: 'Introdução', title: 'Filo <em>Arthropoda</em>', sub: 'Aula prática interativa',
    html: () => `<div class="title-slide" style="width:100%;max-width:1000px">
      <h2>Filo Arthropoda</h2><p style="margin-top:6px">artrópodes = "patas articuladas" (gr. <i>arthron</i>, articulação + <i>pous</i>, pé)</p>
      <div class="cards c4" style="margin-top:26px">${card('limulus', 'Merostomata', 'Limulus', '', 0)}${card('spider', 'Arachnida', 'aranha', '', 0)}${card('crab', 'Crustacea', 'caranguejo', '', 0)}${card('insect', 'Insecta', 'inseto', '', 0)}</div>
      <p class="boardnote" style="margin-top:26px">→ ou espaço para avançar · ← para recuar</p></div>`,
    steps: [{ n: 'Nesta aula vamos <b>da filogenia aos organismos</b>: para cada grupo vemos um modelo por fora, por dentro, os apêndices e o ciclo de vida.' }, { n: 'Nos modelos 3D: <b>arraste</b> para rodar, <b>roda do rato</b> para aproximar, <b>passe por cima de um nome</b> para ver a descrição. O botão <b>Modo teste</b> esconde os nomes.' }],
  },
  {
    sec: 'Introdução', title: 'Filogenia tradicional dos animais', sub: 'Baseada na morfologia e no desenvolvimento',
    html: () => `<div style="position:relative;width:100%;height:100%"><div data-s="0-3" style="position:absolute;inset:0">${S(tradTree())}</div><div data-s="4" style="position:absolute;inset:0">${S(modernTree())}</div></div>`,
    steps: [
      { n: 'Árvore "clássica": os grupos separam-se por <b>tecidos</b>, <b>simetria</b>, número de <b>folhetos embrionários</b> e tipo de <b>cavidade corporal</b>. Metazoa (animais) vs. Protozoa.' },
      { n: 'Os artrópodes são <b>Eumetazoa → Bilateria → Celomados → Protostomia</b> (a boca forma-se a partir do blastóporo).', zoom: [62, 55, 1.35] },
      { n: 'Na visão clássica, Annelida e Arthropoda formavam os <b>Articulata</b>, unidos pelo corpo <b>segmentado</b>.', zoom: [62, 45, 1.6] },
      { n: '⚠ Esta é a filogenia do vosso manual. Os dados moleculares mudaram-na bastante — vejamos a versão atual.', zoom: [50, 50, 1] },
      { n: 'Hoje: Arthropoda pertence aos <b>Ecdysozoa</b> (animais que fazem <b>muda</b>), com os nemátodes, tardígrados e onicóforos. Os anelídeos ficam nos <b>Spiralia</b>: a segmentação surgiu de forma independente.' },
    ],
  },
  {
    sec: 'Introdução', title: 'Razões para o sucesso dos artrópodes', sub: 'O grupo com mais espécies descritas do planeta',
    html: () => `<div class="reasons">${[
      ['Exosqueleto versátil', 'Protege, sustenta, impede a perda de água e serve de ponto de inserção aos músculos.'],
      ['Segmentação e apêndices', 'Segmentos agrupados em tagmas e apêndices articulados especializados → locomoção eficiente.'],
      ['Ar levado diretamente às células', 'Sistema traqueal nos terrestres: o O₂ chega aos tecidos sem depender do sangue.'],
      ['Órgãos dos sentidos desenvolvidos', 'Olhos compostos, sedas táteis, quimiorrecetores, órgãos auditivos.'],
      ['Comportamentos complexos', 'Comunicação, cuidados parentais, insetos sociais.'],
      ['Metamorfose', 'Larva e adulto usam recursos diferentes e não competem entre si.'],
    ].map(([h, p], i) => `<div class="reason" data-s="${i}"><div class="n">${i + 1}</div><h3>${h}</h3><p>${p}</p></div>`).join('')}</div>`,
    steps: [{ n: 'Mais de 1 milhão de espécies descritas: a maioria de todos os animais conhecidos.' }, {}, {}, {}, {}, { n: 'Repare que várias destas "vantagens" também trazem limitações — por exemplo, o exosqueleto obriga a mudas para crescer.' }],
  },
  {
    sec: 'Introdução', title: 'O exosqueleto (tegumento)', sub: 'Corte de cutícula, como na pinça de um caranguejo', model: 'cuticula', view: 'hero',
    steps: [
      { spin: true, n: 'A cutícula é segregada pela <b>epiderme</b> e cobre todo o corpo, incluindo o início e o fim do tubo digestivo e as traqueias.' },
      { labels: ['epi', 'exo', 'endo'], n: '<b>Epicutícula</b> (ceras, impermeável), <b>exocutícula</b> (rígida) e <b>endocutícula</b> (flexível). Passe o rato pelos nomes.' },
      { labels: ['procut', 'epid', 'basal'], n: 'Exo + endocutícula = <b>procutícula</b>, com <b>quitina</b>. Por baixo, a epiderme e a membrana basal.' },
      { labels: ['seta', 'glteg', 'poros'], view: 'front', n: 'Atravessam a cutícula: <b>sedas</b> sensoriais, canais de <b>glândulas tegumentares</b> e <b>canais de poros</b>.' },
      { clear: true, labels: ['epi', 'exo', 'endo', 'epid', 'basal'], explode: { layers: 1 }, show: { seta: 0 }, view: 'explode', n: 'Separando as camadas. Nos crustáceos a exocutícula está também <b>calcificada</b> (carbonato de cálcio).' },
    ],
  },
  {
    sec: 'Introdução', title: 'Muda (ecdise)', sub: 'Crescer dentro de uma armadura',
    html: () => S(molt().replace(/^<svg[^>]*>|<\/svg>$/g, ''), '10 40 980 460'),
    steps: [
      { n: 'Um exosqueleto rígido não cresce: o artrópode tem de o <b>trocar</b> periodicamente.' },
      { n: '<b>Apólise</b>: a epiderme descola-se e produz uma nova epicutícula.' },
      { n: 'O <b>fluido de muda</b> digere a endocutícula velha; os produtos são <b>reabsorvidos</b> (reciclagem).' },
      { n: '<b>Ecdise</b>: o animal sai da cutícula velha (exúvia). Fica mole e vulnerável.' },
      { n: '<b>Pós-ecdise</b>: absorve água ou ar, estica a nova cutícula e só depois ela endurece (esclerotização).' },
      { n: 'É esta muda que dá nome aos <b>Ecdysozoa</b>.' },
    ],
  },
  {
    sec: 'Introdução', title: 'Classificação do filo', sub: 'Subfilos tradicionais e visão atual',
    html: () => `<div style="position:relative;width:100%;height:100%"><div data-s="0-3" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><div class="cards c4" style="max-width:1050px">
      ${card('trilobite', 'Trilobita †', 'subfilo extinto', 'Marinhos, do Câmbrico ao Pérmico. Corpo com 3 lobos longitudinais.', 0)}
      ${card('spider', 'Chelicerata', 'subfilo', 'Quelíceras, sem antenas. Merostomata, Pycnogonida, Arachnida.', 1)}
      ${card('crab', 'Crustacea', 'subfilo', '2 pares de antenas, apêndices birramosos, larva náuplio.', 2)}
      ${card('insect', 'Uniramia', 'subfilo', '1 par de antenas, apêndices unirramosos. Miriápodes + insetos.', 3)}
    </div></div><div data-s="4" style="position:absolute;inset:0">${S(arthTree())}</div></div>`,
    steps: [
      { n: 'Os <b>trilobites</b> dominaram os mares paleozoicos e desapareceram na extinção do fim do Pérmico.' },
      { n: '<b>Chelicerata</b>: corpo em <b>cefalotórax (prossoma)</b> e <b>abdómen (opistossoma)</b>.' },
      { n: '<b>Crustacea</b>: quase todos aquáticos.' },
      { n: '<b>Uniramia</b> juntava miriápodes e insetos por terem antenas e patas com um só ramo.' },
      { n: 'Hoje: os insetos são um ramo dos crustáceos (<b>Pancrustacea</b>); "Crustacea" sem os hexápodes não é um grupo natural, e "Uniramia" foi abandonado. A posição exata dos trilobites ainda se discute.' },
    ],
  },

  // ---------------- CHELICERATA ----------------
  {
    sec: 'Chelicerata', title: 'Subfilo Chelicerata', sub: 'Cladograma e caracteres',
    html: () => S(chelTree(), '0 0 1000 600'),
    steps: [
      { n: 'Três classes: <b>Pycnogonida</b> (aranhas-do-mar), <b>Merostomata</b> (límulos) e <b>Arachnida</b>.' },
      { n: 'Caracteres partilhados por todos: corpo em 2 tagmas, <b>quelíceras e pedipalpos</b>, <b>4 pares de patas</b> e <b>sem antenas</b>.' },
      { n: 'Os picnogónidos têm corpo quase só "patas", com uma probóscide e <b>ovígeros</b> (patas que transportam os ovos — nos machos).' },
      { n: 'Merostomata: <b>brânquias foliáceas</b> e <b>télson</b> longo.' },
      { n: 'Arachnida: apêndices do abdómen reduzidos ou transformados (pulmões, fieiras). <i>Estudos genómicos recentes sugerem que os límulos podem estar dentro dos aracnídeos — debate em aberto.</i>' },
    ],
  },
  {
    sec: 'Chelicerata', title: 'Diversidade dos quelicerados', sub: 'Os destacados têm modelo 3D',
    html: () => `<div class="cards c3" style="max-width:1050px">
      ${card('limulus', 'Merostomata', 'Limulus (límulo)', 'Marinhos, "fósseis vivos". Só 4 espécies atuais.', 0, 'feature')}
      ${card('pycnogonid', 'Pycnogonida', 'aranhas-do-mar', 'Marinhos. Tronco tão fino que o intestino entra nas patas.', 1)}
      ${card('spider', 'Arachnida: Araneae', 'aranhas', 'Seda e veneno. Prossoma e opistossoma unidos pelo pedicelo.', 2, 'feature')}
      ${card('scorpion', 'Arachnida: Scorpiones', 'escorpiões', 'Pedipalpos em pinça; aguilhão venenoso no télson. Vivíparos.', 3)}
      ${card('harvestman', 'Arachnida: Opiliones', 'opiliões', 'Prossoma e opistossoma fundidos; sem seda nem veneno.', 4)}
      ${card('mite', 'Arachnida: Acari', 'ácaros e carraças', 'Corpo sem divisão visível. Muitos parasitas (carraças).', 5)}
    </div>`,
    steps: [{ n: 'Merostomata: o límulo, que vamos explorar em 3D.' }, { n: 'Pycnogonida: o sistema digestivo e as gónadas prolongam-se para as patas.' }, { n: 'Arachnida, ordem <b>Araneae</b>: também em 3D.' }, { n: 'Scorpiones: o abdómen divide-se em <b>mesossoma</b> e <b>metassoma</b> (a "cauda").' }, { n: 'Opiliones: parecem aranhas, mas o corpo é um só bloco.' }, { n: 'Acari: um dos grupos de aracnídeos com mais espécies; muitos são microscópicos.' }],
  },
  {
    sec: 'Chelicerata', title: '<em>Limulus</em> — morfologia externa', sub: 'Classe Merostomata · vista dorsal', model: 'limulus', view: 'hero',
    steps: [
      { spin: true, n: 'O límulo (caranguejo-ferradura) vive em fundos marinhos pouco profundos. Apesar do nome, <b>não é um caranguejo</b>: é um quelicerado.' },
      { view: 'dorsal', labels: ['prossoma', 'opist', 'charn', 'telson'], n: 'Dois tagmas: <b>prossoma</b> e <b>opistossoma</b>, unidos por uma <b>charneira</b>, e um <b>télson</b> longo.' },
      { labels: ['olhoc', 'ocelo', 'espinhos'], n: 'Olhos <b>compostos laterais</b> e dois <b>olhos medianos</b>. Repare nos espinhos móveis do opistossoma.' },
    ],
  },
  {
    sec: 'Chelicerata', title: '<em>Limulus</em> — face ventral e apêndices', sub: 'O animal virado ao contrário', model: 'limulus', view: 'ventral', init: { param: { flip: 1 } },
    steps: [
      { n: 'Virando o animal: todos os apêndices ficam escondidos por baixo da carapaça.' },
      { labels: ['boca', 'quel', 'gnato'], view: 'ventralClose', n: 'A <b>boca</b> fica no centro. À frente, as <b>quelíceras</b>; à volta, as <b>gnatobases</b> das coxas trituram o alimento.' },
      { labels: ['pata1', 'pata', 'pata5', 'quilar'], view: 'ventral', n: '5 pares de patas: o 1.º é homólogo dos <b>pedipalpos</b>; o 5.º serve para empurrar. Atrás, os <b>quilários</b>.' },
      { clear: true, labels: ['opgen', 'opbr', 'anus', 'telson'], n: 'No opistossoma: o <b>opérculo genital</b> e <b>5 pares de opérculos branquiais</b>.' },
      { labels: ['branq'], view: 'gills', explode: { gills: 1 }, n: 'Levantando os opérculos vemos as <b>brânquias foliáceas</b>: lamelas empilhadas como as páginas de um livro.' },
    ],
  },
  {
    sec: 'Chelicerata', title: '<em>Limulus</em> — anatomia interna', sub: 'Corte sagital', model: 'limulus', view: 'lateral',
    steps: [
      { n: 'Vamos fazer um corte pela linha média do corpo.' },
      { cut: 1, show: { legR: 0, int: 1 }, view: 'cut', n: 'Corte sagital: removemos a metade direita da carapaça e das patas.' },
      { focus: ['dig'], labels: ['esof', 'proven', 'intest', 'gdig', 'anus'], n: 'Digestivo: a boca é ventral e o esófago <b>sobe para a frente</b> até à moela; depois o intestino volta para trás. A <b>glândula digestiva</b> enche o prossoma.' },
      { focus: ['circ'], clear: true, labels: ['cor', 'ostios', 'aorta'], n: 'Circulatório <b>aberto</b>: coração dorsal com 8 pares de óstios. Hemolinfa azul (hemocianina).' },
      { focus: ['nerv'], clear: true, labels: ['anel', 'cordao'], n: 'Nervoso: <b>anel</b> à volta do esófago e cordão ventral.' },
      { focus: ['exc'], clear: true, labels: ['coxal'], n: 'Excretor: <b>glândulas coxais</b>.' },
      { focus: null, clear: true, n: 'Desenvolvimento: fecundação externa na praia; dos ovos sai uma larva parecida com um trilobite ("larva trilobítica"), ainda sem o télson longo. Rode o modelo para rever.' },
    ],
  },
  {
    sec: 'Chelicerata', title: 'Aranha — morfologia externa', sub: 'Classe Arachnida · Ordem Araneae (tarântula)', model: 'aranha', view: 'hero',
    steps: [
      { spin: true, n: 'Modelo de uma aranha <b>migalomorfa</b> (tarântula), como no esquema do manual.' },
      { view: 'lateral', labels: ['prossoma', 'pedicelo', 'opist'], n: 'Dois tagmas: <b>prossoma</b> e <b>opistossoma</b>, unidos pelo <b>pedicelo</b>. Ao contrário dos insetos, não há "cabeça" separada.' },
      { view: 'front', clear: true, labels: ['olhos', 'quel', 'presa', 'pedip'], n: 'Na frente: <b>8 olhos simples</b>, <b>quelíceras</b> com presa e <b>pedipalpos</b>.' },
      { view: 'hero', clear: true, labels: ['pata'], n: '4 pares de <b>patas locomotoras</b>, todas no prossoma.' },
      { view: 'ventral', clear: true, labels: ['esterno', 'estigma', 'epigino', 'fieiras', 'anus'], n: 'Face ventral: <b>esterno</b>, aberturas dos <b>pulmões foliáceos</b>, sulco <b>epigástrico</b>, <b>fieiras</b> e ânus.' },
    ],
  },
  {
    sec: 'Chelicerata', title: 'Aranha — apêndices', sub: 'Segmentos da pata', model: 'aranha', view: 'leg',
    steps: [
      { labels: ['pod0', 'pod1', 'pod2', 'pod3', 'pod4', 'pod5', 'pod6'], n: 'Cada pata tem <b>7 segmentos</b>: coxa, trocânter, fémur, <b>patela</b>, tíbia, <b>metatarso</b> e tarso.' },
      { view: 'front', clear: true, labels: ['pedip', 'quel'], n: 'O <b>pedipalpo</b> tem 6 (falta o metatarso). Nos machos adultos o tarso é um órgão copulador. A <b>quelícera</b> tem só 2 artículos: base e presa.' },
    ],
  },
  {
    sec: 'Chelicerata', title: 'Aranha — anatomia interna', sub: 'Corte sagital', model: 'aranha', view: 'lateral',
    steps: [
      { cut: 1, show: { legR: 0, int: 1 }, view: 'cut', n: 'Corte sagital: removemos a metade direita.' },
      { focus: ['dig', 'musc'], labels: ['faringe', 'estomago', 'mdil', 'cecos', 'intest', 'gdig', 'estercoral'], n: 'Digestivo: digestão <b>fora do corpo</b>; o <b>estômago sugador</b> aspira o líquido; <b>cecos</b> e <b>glândula digestiva</b> absorvem.' },
      { focus: ['circ'], clear: true, labels: ['coracao', 'ostios', 'aorta', 'vlat'], n: 'Circulatório aberto: <b>coração tubular dorsal</b> no opistossoma.' },
      { focus: ['resp'], clear: true, labels: ['pulmao'], n: 'Respiratório: <b>pulmões foliáceos</b> (e, em muitas aranhas, também traqueias).' },
      { focus: ['nerv'], clear: true, labels: ['cerebro', 'subes'], n: 'Nervoso: <b>muito concentrado</b> no prossoma.' },
      { focus: ['exc'], clear: true, labels: ['malp', 'coxal', 'estercoral'], n: 'Excretor: <b>túbulos de Malpighi</b> e <b>glândulas coxais</b>.' },
      { focus: ['rep', 'gland'], clear: true, labels: ['ovario', 'espermateca', 'seda', 'veneno'], n: 'Reprodutor e glândulas: <b>ovário</b>, <b>espermatecas</b>, <b>glândulas da seda</b> e de <b>veneno</b>.' },
      { focus: null, clear: true, n: 'Desenvolvimento <b>direto</b>: dos ovos (num casulo de seda) saem pequenas aranhas.' },
    ],
  },

  // ---------------- CRUSTACEA ----------------
  {
    sec: 'Crustacea', title: 'Subfilo Crustacea', sub: 'Características gerais',
    html: () => `<div class="twocol"><div data-s="1">${biramous()}</div><div style="display:flex;flex-direction:column;gap:14px"><div class="card" data-s="3" style="max-width:340px">${ART.nauplius()}<h3>Larva náuplio<small>típica dos crustáceos</small></h3><p>3 pares de apêndices (antênulas, antenas, mandíbulas) e um olho mediano.</p></div></div></div>`,
    steps: [
      { n: 'Quase todos aquáticos (exceções: bichos-de-conta e alguns caranguejos terrestres). <b>Dois pares de antenas</b> — únicos entre os artrópodes.' },
      { n: 'Apêndices <b>birramosos</b>: uma base (<b>protopodito</b>) com dois ramos, <b>endopodito</b> e <b>exopodito</b>.' },
      { n: 'Os apêndices de todo o corpo são <b>homólogos em série</b>: o mesmo plano, modificado para funções diferentes.' },
      { n: 'Desenvolvimento típico com larva <b>náuplio</b>.' },
    ],
  },
  {
    sec: 'Crustacea', title: 'Classes de crustáceos', sub: 'Segundo o vosso manual',
    html: () => `<div class="cards c5" style="max-width:1150px">
      ${card('remipede', 'Remipedia', 'remípedes', 'Cavernas marinhas; tronco com muitos segmentos iguais.', 0)}
      ${card('cephalocarid', 'Cephalocarida', 'cefalocarídeos', 'Minúsculos, em sedimentos marinhos. Considerados "primitivos".', 0)}
      ${card('daphnia', 'Branchiopoda', 'Daphnia, Artemia, Triops', 'Patas foliáceas; sobretudo água doce.', 1, 'feature')}
      ${card('copepod', 'Maxillopoda', 'copépodes', 'Abundantíssimos no plâncton.', 2)}
      ${card('barnacle', 'Maxillopoda', 'cracas (Cirripedia)', 'Sésseis, filtram com as patas (cirros).', 2)}
      ${card('argulus', 'Maxillopoda', 'Branchiura', 'Parasitas de peixes. Tantulocarida: parasitas microscópicos.', 2)}
      ${card('ostracod', 'Ostracoda', 'ostracodes', 'Carapaça bivalve que fecha o corpo todo.', 2)}
      ${card('isopod', 'Malacostraca', 'Isopoda', 'Bichos-de-conta: os crustáceos mais terrestres.', 3)}
      ${card('amphipod', 'Malacostraca', 'Amphipoda', 'Pulgas-da-areia; comprimidos lateralmente.', 3)}
      ${card('crab', 'Malacostraca', 'Decapoda', 'Lagostins, caranguejos, camarões: 5 pares de patas.', 3, 'feature')}
    </div>`,
    steps: [
      { n: '<b>Remipedia</b> e <b>Cephalocarida</b>: grupos pequenos, mas importantes para a filogenia (os remípedes podem ser o grupo-irmão dos insetos).' },
      { n: '<b>Branchiopoda</b>: vamos ver a <i>Daphnia</i> em 3D.' },
      { n: '<b>Maxillopoda</b>: copépodes, cracas, Branchiura, Tantulocarida (e, no manual, os ostracodes). Hoje sabe-se que não formam um grupo natural.' },
      { n: '<b>Malacostraca</b>: a maior classe — isópodes, anfípodes, krill (Euphausiacea) e decápodes. Vamos dissecar um <b>lagostim</b>.' },
    ],
  },
  {
    sec: 'Crustacea', title: 'Lagostim — morfologia externa', sub: 'Malacostraca · Decapoda', model: 'lagostim', view: 'hero',
    steps: [
      { spin: true, n: 'Lagostim-de-água-doce (Astacidea), macho. O modelo clássico das aulas práticas.' },
      { view: 'lateral', labels: ['carapaca', 'cefalo', 'abd', 'sulco'], n: 'Dois tagmas: <b>cefalotórax</b> (13 segmentos, sob a <b>carapaça</b>) e <b>abdómen</b> (6 segmentos).' },
      { view: 'head', clear: true, labels: ['rostro', 'olho', 'antenula', 'antena', 'escafo', 'maxilip', 'boca'], n: 'Cabeça: <b>rostro</b>, <b>olhos pedunculados</b>, <b>antênulas</b> e <b>antenas</b> (com escafocerito), peças bucais.' },
      { view: 'hero', clear: true, labels: ['quelip', 'quela', 'patas'], n: '5 pares de <b>pereiópodes</b>: os quelípodes e 4 pares de patas locomotoras.' },
      { view: 'ventral', clear: true, labels: ['pleop', 'gonopod', 'gonoporo', 'uropode', 'telson'], n: 'Por baixo do abdómen: <b>pleópodes</b> (os 2 primeiros do macho são <b>gonopódios</b>), <b>urópodes</b> e <b>télson</b>.' },
    ],
  },
  {
    sec: 'Crustacea', title: 'Lagostim — os 19 pares de apêndices', sub: 'Um de cada tipo, lado esquerdo', model: 'lagostim', view: 'tray', init: { show: { ext: 0, legR: 0, int: 0, tray: 1 } },
    steps: [
      { labels: ['t_antenula', 't_antena', 't_mand', 't_maxilula', 't_maxila'], n: 'Cabeça: <b>antênulas, antenas, mandíbulas, maxílulas e maxilas</b>.' },
      { labels: ['t_mxp1', 't_mxp2', 't_mxp3', 't_quelip'], n: 'Tórax: <b>3 pares de maxilípedes</b> e os <b>quelípodes</b>…' },
      { labels: ['t_p2', 't_p4'], n: '…e 4 pares de <b>patas locomotoras</b> (com brânquias na base).' },
      { labels: ['t_gono', 't_pleop', 't_urop'], n: 'Abdómen: <b>pleópodes</b> (gonopódios no macho) e <b>urópodes</b>.' },
      { clear: true, labels: ['t_prot', 't_endo', 't_exo', 't_epi'], n: 'Cores: <b style="color:#e39a6f">protopodito</b>, <b style="color:#7fa8d6">endopodito</b>, <b style="color:#e8cf6a">exopodito</b>. Todos são variações do mesmo apêndice birramoso (<b>homologia serial</b>).' },
    ],
  },
  {
    sec: 'Crustacea', title: 'Lagostim — anatomia interna', sub: 'Corte sagital', model: 'lagostim', view: 'lateral',
    steps: [
      { cut: 1, show: { legR: 0, int: 1 }, view: 'cut', n: 'Corte sagital: removemos a metade direita do corpo.' },
      { focus: ['dig'], labels: ['esof', 'estomago', 'moinho', 'gdig', 'intest', 'anus'], n: 'Digestivo: <b>estômago</b> com <b>moinho gástrico</b>, <b>hepatopâncreas</b> e intestino até ao télson.' },
      { focus: ['circ'], clear: true, labels: ['coracao', 'pericard', 'ostios', 'arterias'], n: 'Circulatório aberto: <b>coração</b> no seio pericárdico com 3 pares de óstios e artérias.' },
      { focus: ['resp'], clear: true, labels: ['branquias'], n: 'Respiratório: <b>brânquias</b> dentro das câmaras branquiais, cobertas pela carapaça.' },
      { focus: ['nerv'], clear: true, labels: ['cerebro', 'subes', 'cordao'], n: 'Nervoso: <b>cérebro</b>, <b>gânglio subesofágico</b> e <b>cordão ventral</b> ganglionar.' },
      { focus: ['exc'], clear: true, labels: ['gverde'], n: 'Excretor: <b>glândulas antenais</b> ("verdes").' },
      { focus: ['rep', 'musc'], clear: true, labels: ['testiculo', 'vasdef', 'musc'], n: 'Reprodutor (♂): <b>testículo</b> e <b>canal deferente</b>. No abdómen, os <b>músculos flexores</b>.' },
    ],
  },
  {
    sec: 'Crustacea', title: 'Lagostim — corte transversal', sub: 'Ao nível do coração', model: 'lagostim', view: 'xsec', init: { show: { int: 1, intR: 1 } },
    steps: [
      { tcut: -0.62, n: 'Corte transversal do cefalotórax, como no esquema do manual.' },
      { labels: ['coracao', 'pericard', 'testiculo', 'intest'], n: 'Por cima: <b>coração</b> no <b>seio pericárdico</b>; por baixo, testículo e intestino.' },
      { labels: ['gdig', 'branquias', 'cordao'], n: 'Ao lado, a <b>glândula digestiva</b>; dos lados, as <b>brânquias</b> nas câmaras branquiais; por baixo, o <b>cordão nervoso</b>.' },
    ],
  },
  {
    sec: 'Crustacea', title: 'Ciclo de vida de um decápode', sub: 'Camarão peneídeo (desenvolvimento indireto)',
    html: () => shrimpCycle(),
    steps: [
      { n: 'Nos camarões peneídeos o desenvolvimento é <b>indireto</b>, com várias larvas.' },
      { n: 'Ovos libertados na água.' },
      { n: 'Sai um <b>náuplio</b>, que vive das reservas do ovo.' },
      { n: '<b>Protozoé</b>: começa a alimentar-se no plâncton.' },
      { n: '<b>Mísis</b>: já parecida com um pequeno camarão.' },
      { n: '<b>Pós-larva</b> → juvenil → adulto.' },
      { n: '⚠ O <b>lagostim-de-água-doce</b> tem desenvolvimento <b>direto</b>: a fêmea transporta os ovos nos pleópodes e saem juvenis já com forma de adulto.' },
    ],
  },
  {
    sec: 'Crustacea', title: '<em>Daphnia</em> — morfologia externa', sub: 'Branchiopoda · Cladocera ("pulga-de-água")', model: 'daphnia', view: 'hero', init: { show: { int: 0, eggs: 0 } },
    steps: [
      { spin: true, n: 'Microcrustáceo de água doce (1–5 mm), filtrador. Em aula vê-se ao microscópio, vivo.' },
      { view: 'lateral', labels: ['carapaca', 'cabeca', 'rostro', 'espinho'], n: '<b>Carapaça</b> bivalve que envolve o tronco; a <b>cabeça</b> fica de fora, com <b>rostro</b>.' },
      { clear: true, labels: ['olho', 'ocelo', 'antenula', 'antena'], n: 'Um único <b>olho composto</b>, o <b>ocelo</b> naupliar e as <b>antenas natatórias</b> birramosas.' },
      { clear: true, labels: ['toracop', 'posab', 'garras'], n: '5 pares de <b>toracópodes</b> filtradores dentro da carapaça e o <b>pós-abdómen</b>.' },
    ],
  },
  {
    sec: 'Crustacea', title: '<em>Daphnia</em> — por dentro e reprodução', sub: 'Vê-se tudo por transparência', model: 'daphnia', view: 'lateral',
    steps: [
      { focus: ['dig', 'circ', 'nerv', 'exc'], labels: ['intest', 'cecos', 'coracao', 'cerebro', 'gmax'], n: 'Pela carapaça vemos o <b>intestino</b> (verde), os <b>cecos</b>, o <b>coração</b> a bater e a <b>glândula maxilar</b>.' },
      { focus: ['rep'], clear: true, labels: ['ovario', 'camara', 'ovos'], n: 'Com boas condições: <b>partenogénese</b>. Só há fêmeas, que põem ovos na <b>câmara incubadora</b>.' },
      { focus: ['rep'], clear: true, show: { eggs: 0, ephip: 1 }, labels: ['efipio'], n: 'Com stress (frio, falta de alimento, superpopulação) surgem <b>machos</b>: reprodução sexuada e ovos de resistência no <b>efípio</b>.' },
      { focus: null, show: { eggs: 1, ephip: 0 }, clear: true, n: 'Chama-se <b>partenogénese cíclica</b>: alterna fases assexuadas rápidas com fases sexuadas.' },
    ],
  },

  // ---------------- UNIRAMIA ----------------
  {
    sec: 'Uniramia / Myriapoda', title: 'Subfilo Uniramia', sub: 'Miriápodes e insetos (classificação do manual)',
    html: () => S(uniTree(), '0 0 1000 600'),
    steps: [
      { n: 'Cinco classes: <b>Chilopoda</b>, <b>Diplopoda</b>, <b>Pauropoda</b>, <b>Symphyla</b> e <b>Insecta</b>.' },
      { n: 'Juntavam-se por: <b>1 par de antenas</b>, <b>traqueias</b>, <b>túbulos de Malpighi</b> e mandíbulas de "membro inteiro".' },
      { n: 'Os 4 grupos de miriápodes partilham, por exemplo, os <b>órgãos de Tömösváry</b> (sensoriais, na cabeça).' },
      { n: 'Diplópodes: <b>2 pares de patas</b> por diplossegmento. Quilópodes: <b>1 par</b> por segmento e <b>forcípulas</b> venenosas.' },
      { n: 'Insetos: tórax com 3 segmentos, sem patas abdominais. ⚠ Hoje sabe-se que traqueias e túbulos de Malpighi surgiram <b>independentemente</b>: os insetos estão mais próximos dos crustáceos.' },
    ],
  },
  {
    sec: 'Uniramia / Myriapoda', title: 'Miriápodes', sub: 'Muitas patas, uma só regra para cada classe',
    html: () => `<div class="cards c4" style="max-width:1100px">
      ${card('centipede', 'Chilopoda', 'centopeias', 'Predadores. 1 par de patas por segmento; o 1.º par transformado em forcípulas.', 0)}
      ${card('millipede', 'Diplopoda', 'milípedes, maria-café', 'Detritívoros. 2 pares de patas por diplossegmento; glândulas repugnatórias.', 1)}
      ${card('pauropod', 'Pauropoda', 'paurópodes', 'Menos de 2 mm, no solo. Antenas ramificadas; 9 pares de patas.', 2)}
      ${card('symphylan', 'Symphyla', 'sínfilos', 'No solo. 12 pares de patas; fieiras no fim do corpo.', 3)}
    </div>`,
    steps: [{ n: 'Reparem no <b>número de pares de patas por segmento</b>: é a forma mais rápida de distinguir uma centopeia de um milípede.' }, {}, {}, {}],
  },

  // ---------------- INSECTA ----------------
  {
    sec: 'Insecta', title: 'Classe Insecta', sub: 'O grupo animal com mais espécies',
    html: () => `<div class="twocol"><div class="card" style="max-width:420px;justify-self:center">${ART.insect()}<h3>Plano corporal<small>vista dorsal</small></h3></div><div class="reasons" style="grid-template-columns:1fr">${[
      ['3 tagmas', 'Cabeça, tórax (3 segmentos) e abdómen (até 11).'],
      ['3 pares de patas, 1 par de antenas', 'Patas só no tórax.'],
      ['Asas', 'Geralmente 2 pares, no meso e metatórax. Os únicos invertebrados que voam.'],
      ['Traqueias e túbulos de Malpighi', 'Respiração e excreção adaptadas à vida terrestre.'],
    ].map(([h, p], i) => `<div class="reason" data-s="${i}"><h3>${h}</h3><p>${p}</p></div>`).join('')}</div></div>`,
    steps: [{ n: 'Cerca de 1 milhão de espécies descritas (escaravelhos são a maior ordem).' }, {}, { n: 'Vamos explorar um <b>gafanhoto</b> (Orthoptera), o modelo do manual.' }, {}],
  },
  {
    sec: 'Insecta', title: 'Gafanhoto — morfologia externa', sub: 'Orthoptera · Caelifera (fêmea)', model: 'gafanhoto', view: 'hero',
    steps: [
      { spin: true, n: 'Gafanhoto fêmea. Os ortópteros têm <b>peças bucais mastigadoras</b> e patas posteriores saltatórias.' },
      { view: 'lateral', labels: ['cabeca', 'torax', 'abdomen'], n: 'Três tagmas: <b>cabeça</b>, <b>tórax</b> e <b>abdómen</b>.' },
      { view: 'head', clear: true, labels: ['olhoc', 'ocelos', 'antenas'], n: 'Cabeça: <b>olhos compostos</b>, 3 <b>ocelos</b> e 1 par de <b>antenas</b>.' },
      { view: 'lateral', clear: true, labels: ['pronoto', 'pata1', 'pata2', 'pata3', 'tegmina'], n: 'Tórax: <b>pronoto</b>, 3 pares de patas e as asas anteriores (<b>tégminas</b>).' },
      { clear: true, labels: ['timpano', 'espir', 'cercos', 'ovip'], n: 'Abdómen: <b>tímpano</b>, <b>espiráculos</b>, <b>cercos</b> e <b>ovipositor</b>.' },
    ],
  },
  {
    sec: 'Insecta', title: 'Gafanhoto — peças bucais', sub: 'Aparelho bucal mastigador', model: 'gafanhoto', view: 'head',
    steps: [
      { n: 'As peças bucais estão por baixo da cabeça. Vamos separá-las.' },
      { view: 'mouth', explode: { mouth: 1 }, labels: ['labro'], n: '<b>Labro</b>: lábio superior.' },
      { labels: ['mand'], n: '<b>Mandíbulas</b>: cortam e trituram.' },
      { labels: ['maxila', 'palpmax'], n: '<b>Maxilas</b> com <b>palpos maxilares</b>.' },
      { labels: ['labio', 'palplab', 'hipof'], n: '<b>Lábio</b> (2.ªs maxilas fundidas) com <b>palpos labiais</b>, e a <b>hipofaringe</b>.' },
      { n: 'Noutros insetos estas peças estão modificadas: <b>picador-sugador</b> (mosquito, percevejos), <b>sugador</b> (espirotromba das borboletas), <b>lambedor</b> (mosca).' },
    ],
  },
  {
    sec: 'Insecta', title: 'Gafanhoto — patas e asas', sub: 'Apêndices torácicos', model: 'gafanhoto', view: 'leg',
    steps: [
      { labels: ['hp0', 'hp1', 'hp2', 'hp3', 'hp4'], n: 'Pata do inseto: <b>coxa, trocânter, fémur, tíbia e tarso</b> (sem patela). A pata posterior é <b>saltatória</b>.' },
      { view: 'top', param: { wings: 1 }, clear: true, labels: ['tegmina', 'asaposterior'], n: 'Asas abertas: <b>tégminas</b> e <b>asas posteriores</b> membranosas. As asas são expansões da parede do tórax, <b>não patas modificadas</b> (a sua origem evolutiva ainda se estuda).' },
      { n: 'Na maioria dos insetos o voo usa <b>músculos indiretos</b>, que deformam o tórax; nas libélulas e efémeras há músculos <b>diretos</b> nas asas.' },
    ],
  },
  {
    sec: 'Insecta', title: 'Gafanhoto — anatomia interna', sub: 'Corte sagital', model: 'gafanhoto', view: 'lateral',
    steps: [
      { cut: 1, show: { legR: 0, int: 1 }, view: 'cut', n: 'Corte sagital: removemos a metade direita.' },
      { focus: ['dig', 'gland'], labels: ['esof', 'papo', 'proven', 'cecos', 'mesent', 'colon', 'reto', 'salivar'], n: 'Digestivo: anterior (<b>papo</b>, <b>moela</b>), médio com <b>cecos gástricos</b>, e posterior (<b>cólon</b>, <b>reto</b>).' },
      { focus: ['exc'], clear: true, labels: ['malp', 'reto'], n: 'Excretor: <b>túbulos de Malpighi</b> + <b>reto</b> (poupa água).' },
      { focus: ['circ'], clear: true, labels: ['coracao', 'ostios', 'aorta'], n: 'Circulatório aberto: <b>vaso dorsal</b>. A hemolinfa <b>não transporta oxigénio</b>.' },
      { focus: ['resp'], show: { intR: 1 }, clear: true, labels: ['traq', 'sacos', 'espir'], n: 'Respiratório: <b>traqueias</b> a partir dos espiráculos e <b>sacos aéreos</b>.' },
      { focus: ['nerv'], show: { intR: 0 }, clear: true, labels: ['cerebro', 'subes', 'gtor', 'gabd'], n: 'Nervoso: <b>cérebro</b>, gânglio subesofágico e cordão ventral com gânglios.' },
      { focus: ['rep'], clear: true, labels: ['ovario', 'oviduto', 'esperm', 'ovip'], n: 'Reprodutor (♀): <b>ovários</b>, <b>oviduto</b>, <b>espermateca</b> e <b>ovipositor</b>.' },
    ],
  },
  {
    sec: 'Insecta', title: 'Olho composto', sub: 'Visão em mosaico',
    html: () => eye(),
    steps: [
      { n: 'O olho composto é formado por muitas unidades: os <b>omatídios</b> (de poucas dezenas a cerca de 30 000 nas libélulas).' },
      { n: 'Cada omatídio é um tubo com a sua própria lente.' },
      { n: 'A <b>córnea</b> e o <b>cone cristalino</b> focam a luz…' },
      { n: '…nas <b>células retinulares</b>, cujo <b>rabdoma</b> contém o pigmento visual.' },
      { n: 'As <b>células pigmentares</b> isolam os omatídios uns dos outros; os axónios formam o <b>nervo ótico</b>. Resultado: imagem em mosaico, ótima a detetar movimento.' },
    ],
  },
  {
    sec: 'Insecta', title: 'Metamorfose hemimetábola', sub: 'O gafanhoto ao longo das mudas', model: 'gafanhoto', view: 'nymph',
    init: { param: { size: 0.4, wpad: 0.0001, headK: 1.35 } },
    steps: [
      { n: '<b>Ninfa I</b>: acabada de sair do ovo. Parece um adulto em miniatura com cabeça grande — mas <b>sem asas</b>.' },
      { param: { size: 0.55, wpad: 0.14, headK: 1.22 }, n: '<b>Ninfa III</b>: depois de duas mudas surgem pequenos <b>esboços de asas</b>, por fora.' },
      { param: { size: 0.78, wpad: 0.3, headK: 1.08 }, n: '<b>Ninfa V</b>: esboços de asas maiores.' },
      { param: { size: 1, wpad: 1, headK: 1 }, n: '<b>Adulto</b>: última muda, asas funcionais e maturidade sexual. Não há pupa.' },
    ],
  },
  {
    sec: 'Insecta', title: 'Metamorfose holometábola', sub: 'Exemplo: borboleta-monarca',
    html: () => holoCycle(),
    steps: [{ n: '<b>Ovo</b>.' }, { n: '<b>Larva</b> (lagarta): come e cresce, com várias mudas.' }, { n: '<b>Pupa</b>: os tecidos larvares reorganizam-se.' }, { n: '<b>Adulto</b> (imago): reproduz-se e dispersa.' }, { n: 'Larva e adulto usam recursos diferentes: não competem (lembram-se da razão de sucesso n.º 6?).' }],
  },
  {
    sec: 'Insecta', title: 'Filogenia dos hexápodes', sub: 'Cladograma do manual',
    html: () => S(insTree(), '0 0 1000 600'),
    steps: [
      { n: 'Na base: desenvolvimento <b>direto</b>, sem metamorfose.' },
      { n: 'Protura, Collembola e Diplura têm as peças bucais <b>dentro da cabeça</b> (entognatas). Hoje não se consideram insetos: com eles formam os <b>Hexapoda</b>.' },
      { n: 'Insetos verdadeiros: peças bucais <b>ectognatas</b>. "Thysanura" (peixinhos-de-prata) ainda sem asas.' },
      { n: '<b>Pterygota</b>: asas e metamorfose. Efémeras e libélulas não dobram as asas.' },
      { n: '<b>Neoptera</b>: as asas dobram-se sobre o corpo.' },
      { n: '<b>Holometabola</b>: metamorfose completa (escaravelhos, moscas, borboletas, himenópteros…). Cerca de 80% dos insetos!' },
    ],
  },

  // ---------------- REVISÃO ----------------
  {
    sec: 'Revisão', title: 'Quadro-resumo', sub: 'Compare os quatro modelos',
    html: () => `<table class="cmp">
      <tr><th></th><th>Merostomata / Arachnida</th><th>Crustacea</th><th>Myriapoda</th><th>Insecta</th></tr>
      <tr data-s="0"><td>Tagmas</td><td>prossoma + opistossoma</td><td>cefalotórax + abdómen (ou cabeça, tórax, abdómen)</td><td>cabeça + tronco</td><td>cabeça + tórax + abdómen</td></tr>
      <tr data-s="1"><td>Antenas</td><td>nenhuma (quelíceras)</td><td>2 pares</td><td>1 par</td><td>1 par</td></tr>
      <tr data-s="2"><td>Patas</td><td>4 pares (+ pedipalpos)</td><td>muitas, birramosas</td><td>muitas (1 ou 2 pares/segmento)</td><td>3 pares</td></tr>
      <tr data-s="3"><td>Respiração</td><td>brânquias ou pulmões foliáceos, traqueias</td><td>brânquias</td><td>traqueias</td><td>traqueias</td></tr>
      <tr data-s="4"><td>Excreção</td><td>glândulas coxais, túbulos de Malpighi</td><td>glândulas antenais ou maxilares</td><td>túbulos de Malpighi</td><td>túbulos de Malpighi</td></tr>
      <tr data-s="5"><td>Desenvolvimento</td><td>direto (larva trilobítica no límulo)</td><td>larva náuplio (muitos)</td><td>direto (em muitos, juntam segmentos a cada muda)</td><td>ametábolo, hemi- ou holometábolo</td></tr>
    </table>`,
    steps: [{ n: 'Uma linha de cada vez: tente prever antes de avançar.' }, {}, {}, {}, {}, { n: 'Para estudar: volte aos modelos 3D e ligue o <b>Modo teste</b> (tecla T): os nomes ficam escondidos até clicar.' }],
  },
];
