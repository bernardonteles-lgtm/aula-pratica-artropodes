// Aranha migalomorfa (tipo tarântula) — Arachnida, Araneae
import * as THREE from 'three';
import { V, mat, mk, ell, seg, vtube, chainPts, limb, plate, tag } from '../geo.js';

const DARK = 0x3a281b, MID = 0x5a3d27, RING = 0xc4a27a;

export function buildSpider() {
  const root = new THREE.Group();
  const anchors = {};
  const A = (id, p, name, desc, set, extra = {}) => (anchors[id] = { p, name, desc, set, ...extra });
  const hair = (c, seed = 1) => mat(c, { r: 0.85, bump: 'hair', bs: 2.2, seed });

  // ---------- TAGMAS ----------
  const pros = ell([0.82, 0.3, 0.66], V(-0.85, 0.6, 0), hair(MID, 2));
  pros.userData.aid = 'prossoma';
  root.add(pros);
  // carapaça ligeiramente elevada à frente (região cefálica)
  const cap = ell([0.45, 0.2, 0.42], V(-1.1, 0.72, 0), hair(MID, 3));
  cap.userData.aid = 'prossoma';
  root.add(cap);
  const fovea = ell([0.06, 0.02, 0.03], V(-0.72, 0.9, 0), 0x22170f, { low: true });
  root.add(fovea);
  // tubérculo ocular e 8 olhos
  root.add(ell([0.1, 0.06, 0.1], V(-1.45, 0.9, 0), hair(MID)));
  const eyeM = mat(0x0a0a0a, { r: 0.05 });
  for (const [x, z, r] of [[-1.53, 0.035, 0.028], [-1.53, -0.035, 0.028], [-1.52, 0.09, 0.022], [-1.52, -0.09, 0.022], [-1.4, 0.05, 0.02], [-1.4, -0.05, 0.02], [-1.42, 0.1, 0.022], [-1.42, -0.1, 0.022]]) {
    const e = ell([r, r, r], V(x, 0.95, z), eyeM.clone(), { low: true });
    e.userData.aid = 'olhos';
    root.add(e);
  }
  const ster = plate(V(-0.85, 0.32, 0), V(0.5, 0, 0), V(0, 0, 0.36), 0.15, MID);
  ster.userData.aid = 'esterno';
  root.add(ster);
  const ped = seg(V(-0.1, 0.56, 0), V(0.2, 0.6, 0), 0.1, 0.11, DARK);
  ped.userData.aid = 'pedicelo';
  root.add(ped);
  const opis = ell([0.95, 0.62, 0.72], V(0.95, 0.68, 0), hair(DARK, 5));
  opis.userData.aid = 'opist';
  root.add(opis);

  A('prossoma', V(-0.75, 0.88, 0.3), 'Prossoma (cefalotórax)', 'Tagma anterior coberto por uma carapaça única. Leva os 6 pares de apêndices: quelíceras, pedipalpos e 4 pares de patas.', 'ext');
  A('olhos', V(-1.46, 0.97, 0.06), 'Olhos simples (8)', 'Ocelos agrupados no tubérculo ocular, em duas filas. As aranhas não têm olhos compostos.', 'ext cab');
  A('pedicelo', V(0.05, 0.58, 0.1), 'Pedicelo', 'Cintura estreita (1.º somito do opistossoma) que dá grande mobilidade ao abdómen — útil para tecer.', 'ext');
  A('opist', V(1.0, 1.15, 0.35), 'Opistossoma (abdómen)', 'Tagma posterior, sem patas, mole e não segmentado nas aranhas atuais. Contém coração, glândula digestiva, pulmões, gónadas e glândulas da seda.', 'ext');
  A('esterno', V(-0.85, 0.31, 0.2), 'Esterno', 'Placa ventral do prossoma, rodeada pelas coxas das patas.', 'vent');

  // ---------- APÊNDICES ----------
  const legSets = [];
  const podNames = ['Coxa', 'Trocânter', 'Fémur', 'Patela', 'Tíbia', 'Metatarso', 'Tarso'];
  const legDef = [
    { x: -1.28, yaw: 140, L: 1.0 },
    { x: -1.0, yaw: 112, L: 0.95 },
    { x: -0.72, yaw: 72, L: 0.85 },
    { x: -0.46, yaw: 42, L: 1.06 },
  ];
  legDef.forEach((d, i) => {
    for (const s of [1, -1]) {
      const Y = (a) => (s > 0 ? a : 360 - a);
      const base = V(d.x, 0.4, 0.48 * s);
      const turn = i < 2 ? 1 : -1;
      const pts = chainPts(base, [
        [0.18, Y(d.yaw), 10], [0.1, Y(d.yaw), 16], [0.68 * d.L, Y(d.yaw + 4 * turn), 44], [0.3 * d.L, Y(d.yaw + 8 * turn), -8],
        [0.55 * d.L, Y(d.yaw + 12 * turn), -46], [0.52 * d.L, Y(d.yaw + 16 * turn), -60], [0.28 * d.L, Y(d.yaw + 18 * turn), -9],
      ]);
      const cols = [hair(DARK), hair(DARK), hair(DARK), hair(MID), hair(DARK), hair(DARK), hair(MID)];
      const lg = limb(pts, [0.075, 0.07, 0.068, 0.06, 0.055, 0.045, 0.035, 0.025], cols, { jointColor: RING });
      tag(lg, { aid: 'pata', grp: s > 0 ? 'legR' : 'ext' });
      // garras
      const tip = pts[7];
      lg.add(seg(tip, tip.clone().add(V(0, -0.03, 0.02 * s)), 0.012, 0.003, 0x111111));
      root.add(lg);
      if (i === 1 && s > 0) {
        lg.userData.segs.forEach((sg, k) => {
          sg.userData.aid = 'pod' + k;
          const mid = pts[k].clone().lerp(pts[k + 1], 0.5);
          A('pod' + k, mid, podNames[k], k === 3 ? 'Segmento típico dos aracnídeos (não existe nos insetos), entre fémur e tíbia.' : k === 5 ? 'Falta no pedipalpo — por isso o pedipalpo tem 6 segmentos e a pata 7.' : 'Segmento (podómero) da pata.', 'leg', { g: 'legR' });
        });
      }
      legSets.push(lg);
    }
  });
  A('pata', V(-0.4, 0.6, 1.55), '4 pares de patas locomotoras', 'Cada pata tem 7 segmentos: coxa, trocânter, fémur, patela, tíbia, metatarso e tarso, com garras na ponta.', 'ext', { g: 'legR' });

  // quelíceras com presas (migalomorfas: paralelas, dirigidas para trás)
  for (const s of [1, -1]) {
    const b = seg(V(-1.52, 0.55, 0.11 * s), V(-1.82, 0.38, 0.11 * s), 0.12, 0.1, hair(DARK));
    b.userData.aid = 'quel';
    b.userData.grp = s > 0 ? 'legR' : 'ext';
    root.add(b);
    const f1 = seg(V(-1.86, 0.32, 0.11 * s), V(-1.78, 0.2, 0.11 * s), 0.03, 0.02, 0x140e0a, { r: 0.3 });
    const f2 = seg(V(-1.78, 0.2, 0.11 * s), V(-1.62, 0.18, 0.11 * s), 0.02, 0.004, 0x140e0a, { r: 0.3 });
    [f1, f2].forEach((f) => { f.userData.aid = 'presa'; f.userData.grp = s > 0 ? 'legR' : 'ext'; root.add(f); });
    // pedipalpos (6 segmentos)
    const pp = chainPts(V(-1.5, 0.38, 0.27 * s), [[0.15, s > 0 ? 165 : 195, 4], [0.08, s > 0 ? 160 : 200, 20], [0.36, s > 0 ? 158 : 202, 38], [0.15, s > 0 ? 155 : 205, -5], [0.28, s > 0 ? 152 : 208, -42], [0.24, s > 0 ? 150 : 210, -58]]);
    const pl = limb(pp, [0.06, 0.055, 0.05, 0.048, 0.045, 0.04, 0.03], [hair(DARK), hair(DARK), hair(DARK), hair(MID), hair(DARK), hair(MID)], { jointColor: RING });
    tag(pl, { aid: 'pedip', grp: s > 0 ? 'legR' : 'ext' });
    root.add(pl);
  }
  A('quel', V(-1.72, 0.45, 0.2), 'Quelíceras', '1.º par de apêndices, à frente da boca. Na tarântula movem-se paralelamente (migalomorfas); nas outras aranhas cruzam-se como pinças.', 'ext cab');
  A('presa', V(-1.74, 0.2, 0.12), 'Presa (dedo móvel da quelícera)', 'Garra oca por onde sai o veneno.', 'ext cab');
  A('pedip', V(-2.0, 0.3, 0.55), 'Pedipalpos', '2.º par de apêndices, sensoriais e manipuladores. Nos machos adultos o tarso transforma-se num órgão copulador (bolbo).', 'ext cab');

  // fieiras e ânus
  for (const s of [1, -1]) {
    const pts = chainPts(V(1.76, 0.38, 0.12 * s), [[0.14, s > 0 ? 25 : 335, 30], [0.12, s > 0 ? 18 : 342, 40], [0.12, s > 0 ? 10 : 350, 50]]);
    const sp = limb(pts, [0.045, 0.04, 0.032, 0.02], hair(MID), {});
    tag(sp, { aid: 'fieiras' });
    root.add(sp);
    const pm = seg(V(1.74, 0.33, 0.04 * s), V(1.82, 0.32, 0.04 * s), 0.025, 0.015, MID);
    pm.userData.aid = 'fieiras';
    root.add(pm);
  }
  A('fieiras', V(2.0, 0.6, 0.15), 'Fieiras', 'Apêndices opistossomais modificados por onde sai a seda. Na tarântula: 2 pares (o posterior lateral é comprido).', 'ext vent');
  const anus = ell([0.035, 0.03, 0.03], V(1.86, 0.55, 0), 0x140e0a, { low: true });
  anus.userData.aid = 'anus';
  root.add(anus);
  A('anus', V(1.88, 0.56, 0), 'Ânus', 'Abre-se por cima das fieiras.', 'vent int');

  // aberturas ventrais: pulmões e epígino
  const ellY = (x, z) => { const dx = (x - 0.95) / 0.95, dz = z / 0.72; return 0.68 - 0.62 * Math.sqrt(Math.max(0, 1 - dx * dx - dz * dz)); };
  for (const s of [1, -1])
    for (const x of [0.32, 0.62]) {
      const z = 0.32 * s;
      const o = plate(V(x, ellY(x, z) - 0.002, z), V(0.06, 0, 0), V(0, 0, 0.1), 0.3, 0xb69472);
      o.rotation.x += 0; o.userData.aid = 'estigma';
      root.add(o);
    }
  const epi = plate(V(0.42, ellY(0.42, 0) - 0.003, 0), V(0.04, 0, 0), V(0, 0, 0.12), 0.3, 0x8a6a4a);
  epi.userData.aid = 'epigino';
  root.add(epi);
  A('estigma', V(0.4, ellY(0.32, 0.32), 0.32), 'Aberturas dos pulmões foliáceos', 'Fendas ventrais. A tarântula tem 2 pares de pulmões; a maioria das outras aranhas tem 1 par + traqueias.', 'vent');
  A('epigino', V(0.42, ellY(0.42, 0), 0), 'Sulco epigástrico / epígino', 'Onde abre o sistema reprodutor. Nas fêmeas, o epígino recebe o pedipalpo do macho.', 'vent');

  // ---------- INTERNOS ----------
  const I = (m, sys, aid, right = false) => { m.userData.grp = right ? 'intR' : 'int'; m.userData.grp2 = 'int'; m.userData.sys = sys; m.userData.aid = aid; root.add(m); return m; };
  const blue = 0x3f6fd0, gut = 0x9fc562, dg = 0x6f9a3f, red = 0xd8524c, mus = 0xd77a6a, yel = 0xf0c63c, lung = 0xb07fd8, ov = 0x86a6e8, silk = 0xf2ead2, poison = 0xe6dfb3;
  // nervoso
  I(ell([0.14, 0.09, 0.12], V(-1.06, 0.66, 0), blue), 'nerv', 'cerebro');
  I(ell([0.3, 0.08, 0.22], V(-0.86, 0.43, 0), blue), 'nerv', 'subes');
  for (const s of [-1, 1]) for (const d of legDef) I(seg(V(-0.86, 0.43, 0.1 * s), V(d.x, 0.4, 0.45 * s), 0.015, 0.01, blue), 'nerv', 'subes', s > 0);
  I(seg(V(-1.06, 0.7, 0.04), V(-1.4, 0.88, 0.05), 0.015, 0.01, blue), 'nerv', 'cerebro');
  A('cerebro', V(-1.08, 0.72, 0), 'Cérebro (gânglio supra-esofágico)', 'Liga-se aos olhos e às quelíceras.', 'int nerv', { g: 'int' });
  A('subes', V(-0.86, 0.42, 0), 'Massa ganglionar subesofágica', 'Gânglios ventrais fundidos numa só massa no prossoma; daí partem nervos para as patas. Sistema nervoso muito concentrado.', 'int nerv', { g: 'int' });
  // digestivo
  I(vtube([V(-1.56, 0.36, 0), V(-1.32, 0.48, 0), V(-1.05, 0.56, 0), V(-0.88, 0.62, 0)], 0.025, gut, { rad: 10, tub: 20 }), 'dig', 'faringe');
  I(ell([0.16, 0.1, 0.13], V(-0.74, 0.66, 0), mat(0x86b04e)), 'dig', 'estomago');
  for (const z of [0, 0.15, -0.15]) I(seg(V(-0.74, 0.7, z * 0.5), V(-0.74 + z * 0.4, 0.88, z), 0.02, 0.025, mus), 'musc', 'mdil');
  I(vtube([V(-0.6, 0.64, 0), V(-0.3, 0.6, 0), V(0.05, 0.58, 0), V(0.5, 0.64, 0), V(1.1, 0.68, 0), V(1.55, 0.66, 0)], 0.035, gut, { rad: 10, tub: 50 }), 'dig', 'intest');
  for (const s of [-1, 1]) for (const d of legDef) I(vtube([V(-0.55, 0.6, 0.05 * s), V((d.x - 0.55) / 2, 0.55, 0.25 * s), V(d.x, 0.45, 0.45 * s)], 0.028, gut, { rad: 8, tub: 16 }), 'dig', 'cecos', s > 0);
  I(ell([0.1, 0.08, 0.08], V(1.62, 0.64, 0), mat(0x7aa04a)), 'dig', 'estercoral');
  I(seg(V(1.7, 0.63, 0), V(1.86, 0.56, 0), 0.03, 0.02, gut), 'dig', 'estercoral');
  for (const s of [-1, 1]) for (const [x, y, z, r] of [[0.75, 0.92, 0.35, 0.36], [1.25, 0.88, 0.32, 0.3], [0.45, 0.75, 0.42, 0.25], [1.0, 0.62, 0.5, 0.3], [0.95, 1.05, 0.12, 0.3]])
    I(ell([r, r * 0.7, r * 0.6], V(x, y, z * s), mat(dg, { r: 0.75, bump: 'bumps', bs: 1 })), 'dig', 'gdig', s > 0);
  A('faringe', V(-1.3, 0.48, 0), 'Faringe e esófago', 'O alimento entra já liquefeito (digestão extra-oral): a aranha injeta enzimas e suga.', 'int dig', { g: 'int' });
  A('estomago', V(-0.74, 0.68, 0), 'Estômago sugador', 'Bomba que aspira o alimento líquido.', 'int dig', { g: 'int' });
  A('mdil', V(-0.7, 0.86, 0.05), 'Músculos dilatadores', 'Ligam o estômago à carapaça: ao contraírem, dilatam-no e criam sucção.', 'int dig', { g: 'int' });
  A('cecos', V(-0.75, 0.5, -0.3), 'Cecos digestivos', 'Divertículos do intestino médio que entram nas coxas das patas.', 'int dig', { g: 'int' });
  A('intest', V(0.5, 0.63, 0), 'Intestino médio', 'Atravessa o pedicelo e percorre o opistossoma.', 'int dig', { g: 'int' });
  A('gdig', V(0.95, 0.62, -0.5), 'Glândula digestiva', 'Enche grande parte do opistossoma: digestão final, absorção e reserva.', 'int dig', { g: 'int' });
  A('estercoral', V(1.62, 0.66, 0), 'Bolsa estercoral', 'Dilatação do intestino posterior onde se acumulam as fezes antes de sair pelo ânus.', 'int dig exc', { g: 'int' });
  // veneno (dentro das quelíceras nas migalomorfas)
  for (const s of [-1]) I(ell([0.14, 0.05, 0.05], V(-1.62, 0.5, 0.11 * s), poison, { rot: [0, 0, 0.5] }), 'gland', 'veneno');
  A('veneno', V(-1.62, 0.5, -0.11), 'Glândula de veneno', 'Na tarântula fica dentro da quelícera; nas aranhas araneomorfas prolonga-se para dentro do prossoma.', 'int', { g: 'int' });
  // circulatório
  I(vtube([V(0.25, 1.1, 0), V(0.7, 1.2, 0), V(1.15, 1.17, 0), V(1.5, 1.02, 0)], (t) => 0.06 * (1 - 0.4 * t), red, { rad: 12, tub: 30 }), 'circ', 'coracao');
  for (const x of [0.45, 0.75, 1.0, 1.25]) I(ell([0.02, 0.02, 0.02], V(x, 1.18 - (x > 1.1 ? (x - 1.1) * 0.3 : 0), -0.055), 0x5a1010, { low: true }), 'circ', 'ostios');
  I(vtube([V(0.25, 1.1, 0), V(0.05, 0.78, 0), V(-0.3, 0.78, 0), V(-0.65, 0.82, 0), V(-1.0, 0.8, 0)], 0.022, red, { rad: 8, tub: 30 }), 'circ', 'aorta');
  for (const x of [0.55, 0.95, 1.3]) I(vtube([V(x, 1.18, -0.03), V(x + 0.05, 1.0, -0.35), V(x + 0.05, 0.7, -0.55)], 0.012, red, { rad: 6, tub: 12 }), 'circ', 'vlat');
  A('coracao', V(0.8, 1.2, 0), 'Coração tubular', 'Dorsal, no opistossoma, dentro do seio pericárdico.', 'int circ', { g: 'int' });
  A('ostios', V(0.75, 1.19, -0.05), 'Óstios', 'Aberturas laterais com válvulas por onde a hemolinfa volta ao coração.', 'int circ', { g: 'int' });
  A('aorta', V(-0.3, 0.78, 0), 'Aorta anterior', 'Atravessa o pedicelo e irriga o prossoma.', 'int circ', { g: 'int' });
  A('vlat', V(0.98, 0.98, -0.33), 'Vasos sanguíneos laterais', 'Artérias que saem do coração; a hemolinfa acaba em lacunas (sistema aberto).', 'int circ', { g: 'int' });
  // respiratório: pulmões foliáceos
  for (const s of [-1, 1])
    for (const x of [0.32, 0.62])
      for (let k = 0; k < 8; k++) {
        const z = 0.3 * s;
        I(plate(V(x + 0.02, ellY(x, z) + 0.05 + k * 0.014, z), V(0.09, 0, 0), V(0, 0, 0.1), 0.06, mat(lung, { r: 0.5 })), 'resp', 'pulmao', s > 0);
      }
  A('pulmao', V(0.34, 0.28, -0.3), 'Pulmões foliáceos', 'Lamelas cheias de hemolinfa empilhadas como as folhas de um livro; o ar circula entre elas.', 'int resp', { g: 'int' });
  // excretor
  for (const s of [1, -1]) I(vtube([V(1.6, 0.68, 0.03 * s), V(1.3, 0.78, 0.18 * s), V(0.95, 0.8, 0.22 * s), V(0.6, 0.78, 0.2 * s)], 0.014, yel, { rad: 6, tub: 30 }), 'exc', 'malp', s > 0);
  I(vtube([V(1.6, 0.68, -0.02), V(1.35, 0.6, -0.12), V(1.05, 0.55, -0.1)], 0.012, yel, { rad: 6, tub: 20 }), 'exc', 'malp');
  for (const s of [-1, 1]) I(ell([0.12, 0.05, 0.06], V(-1.05, 0.42, 0.4 * s), 0xe0a040), 'exc', 'coxal', s > 0);
  A('malp', V(1.1, 0.8, -0.2), 'Túbulos de Malpighi', 'Excreção: recolhem resíduos da hemolinfa e lançam-nos no intestino (guanina).', 'int exc', { g: 'int' });
  A('coxal', V(-1.05, 0.42, -0.4), 'Glândulas coxais', 'Excreção e equilíbrio de água; abrem junto às coxas.', 'int exc', { g: 'int' });
  // reprodutor
  for (let k = 0; k < 26; k++) {
    const x = 0.6 + (k % 9) * 0.08, y = 0.38 + Math.floor(k / 9) * 0.07, z = ((k * 37) % 7) * 0.03 - 0.09;
    I(ell([0.05, 0.05, 0.05], V(x, y, z), ov, { low: true }), 'rep', 'ovario');
  }
  I(vtube([V(0.62, 0.38, 0), V(0.5, 0.3, 0), V(0.42, ellY(0.42, 0) + 0.03, 0)], 0.022, ov, { rad: 8, tub: 16 }), 'rep', 'ovario');
  for (const s of [-1, 1]) I(ell([0.04, 0.04, 0.04], V(0.38, ellY(0.38, 0) + 0.07, 0.07 * s), 0xe48fb0, { low: true }), 'rep', 'espermateca', s > 0);
  A('ovario', V(0.9, 0.42, 0), 'Ovário', 'Na fêmea, ocupa a parte ventral do opistossoma; o oviduto abre no sulco epigástrico.', 'int rep', { g: 'int' });
  A('espermateca', V(0.38, ellY(0.38, 0) + 0.07, -0.07), 'Recetáculos seminais (espermatecas)', 'Guardam o esperma recebido do macho até à postura.', 'int rep', { g: 'int' });
  // glândulas da seda
  for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
    I(ell([0.12, 0.05, 0.05], V(1.3 + k * 0.08, 0.4 + k * 0.03, (0.08 + k * 0.03) * s), silk), 'gland', 'seda', s > 0);
  }
  for (const s of [-1, 1]) I(seg(V(1.55, 0.45, 0.1 * s), V(1.78, 0.4, 0.12 * s), 0.012, 0.01, silk), 'gland', 'seda', s > 0);
  A('seda', V(1.4, 0.45, -0.1), 'Glândulas da seda', 'Produzem proteína de seda líquida que solidifica ao sair pelas fieiras.', 'int', { g: 'int' });

  const views = {
    hero: { pos: [-4.8, 3.2, 5.8], target: [0, 0.5, 0] },
    lateral: { pos: [0.1, 1.5, 7.2], target: [0.05, 0.55, 0] },
    front: { pos: [-5.2, 1.6, 1.6], target: [-1.3, 0.55, 0] },
    ventral: { pos: [0.6, -4.4, 4.4], target: [0.2, 0.4, 0.1] },
    leg: { pos: [-1.0, 1.5, 5.4], target: [-1.25, 0.55, 1.25] },
    cut: { pos: [0.1, 1.05, 5.3], target: [0.05, 0.62, 0] },
  };
  return {
    root, anchors, views,
    defaults: { show: { ext: 1, legR: 1, int: 0, intR: 0 } },
    systems: { dig: ['Digestivo', gut], circ: ['Circulatório', red], nerv: ['Nervoso', blue], exc: ['Excretor', yel], resp: ['Respiratório', lung], rep: ['Reprodutor', ov], gland: ['Glândulas (veneno, seda)', silk], musc: ['Músculos', mus] },
  };
}
