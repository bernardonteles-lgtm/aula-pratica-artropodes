// Gafanhoto (Insecta, Orthoptera, Caelifera) — fêmea
import * as THREE from 'three';
import { V, mat, mk, ell, seg, vtube, chainPts, limb, plate, setae, wingTex } from '../geo.js';

const G1 = 0x7d9442, G2 = 0x5d7330, G3 = 0xa3b862, BR = 0x6b5434;

export function buildGrasshopper() {
  const root = new THREE.Group();
  const body = new THREE.Group(); // tudo o que escala nas ninfas
  root.add(body);
  const anchors = {};
  const A = (id, p, name, desc, set, extra = {}) => (anchors[id] = { p, name, desc, set, ...extra });
  const sk = (c = G1) => mat(c, { r: 0.5, bump: 'fine', bs: 0.8 });
  const add = (m, aid, extra = {}) => { m.userData.aid = aid; Object.assign(m.userData, extra); body.add(m); return m; };

  // ---------- CABEÇA ----------
  const headG = new THREE.Group();
  body.add(headG);
  const hadd = (m, aid, extra = {}) => { m.userData.aid = aid; Object.assign(m.userData, extra); headG.add(m); return m; };
  hadd(ell([0.34, 0.45, 0.31], V(-1.8, 1.0, 0), sk(), { rot: [0, 0, -0.25] }), 'cabeca');
  for (const s of [1, -1]) hadd(ell([0.12, 0.17, 0.08], V(-1.86, 1.17, 0.26 * s), mat(0x5a4a2c, { r: 0.25, bump: 'bumps', bs: 0.5 }), { rot: [0, 0.15 * s, -0.2] }), 'olhoc');
  hadd(ell([0.025, 0.025, 0.02], V(-2.13, 1.0, 0), 0xf3e7b0, { low: true }), 'ocelos');
  for (const s of [1, -1]) hadd(ell([0.022, 0.022, 0.02], V(-2.03, 1.3, 0.14 * s), 0xf3e7b0, { low: true }), 'ocelos');
  for (const s of [1, -1]) {
    const ant = vtube([V(-2.07, 1.22, 0.11 * s), V(-2.25, 1.42, 0.16 * s), V(-2.45, 1.68, 0.24 * s), V(-2.55, 1.95, 0.32 * s), V(-2.52, 2.18, 0.4 * s)], (t) => 0.022 * (1 - 0.45 * t) * (0.82 + 0.18 * Math.abs(Math.sin(t * 75))), sk(G2), { rad: 8, tub: 90 });
    hadd(ant, 'antenas');
  }
  A('cabeca', V(-1.72, 1.4, 0.2), 'Cabeça', '6 segmentos fundidos numa cápsula. Peças bucais viradas para baixo (hipognata).', 'ext tag');
  A('olhoc', V(-1.85, 1.2, 0.33), 'Olhos compostos', 'Formados por milhares de omatídios.', 'ext cab');
  A('ocelos', V(-2.13, 1.0, 0.02), 'Ocelos (3)', 'Olhos simples: 1 mediano na fronte e 2 junto às antenas. Detetam variações de luz.', 'ext cab');
  A('antenas', V(-2.5, 1.85, 0.3), 'Antenas', '1 só par (insetos), filiformes. Curtas nos gafanhotos (Caelifera); longas nos grilos e saltões (Ensifera).', 'ext cab');

  // peças bucais (explodem)
  const mouth = (m, aid, ex) => { m.userData.explode = ex; m.userData.exKey = 'mouth'; return hadd(m, aid); };
  mouth(plate(V(-2.08, 0.62, 0), V(0, -0.11, 0), V(0, 0, 0.11), 0.3, sk(G3)), 'labro', V(-0.75, 0.05, 0));
  for (const s of [1, -1]) mouth(ell([0.07, 0.1, 0.06], V(-1.97, 0.55, 0.08 * s), mat(0x3a2a18, { r: 0.35 }), { rot: [0, 0, 0.2] }), 'mand', V(-0.55, -0.15, 0.42 * s));
  mouth(ell([0.05, 0.07, 0.05], V(-1.86, 0.53, 0), sk(0xc8b08a)), 'hipof', V(-0.25, -0.5, 0));
  for (const s of [1, -1]) {
    const base = V(-1.86, 0.52, 0.16 * s);
    const ex = V(-0.15, -0.42, 0.8 * s);
    mouth(plate(base, V(0.04, -0.11, 0), V(0, 0, 0.04), 0.4, sk(G3)), 'maxila', ex);
    mouth(plate(base.clone().add(V(-0.02, -0.12, -0.02 * s)), V(0.02, -0.06, 0), V(0, 0, 0.03), 0.4, sk(0xc8d39a)), 'maxila', ex);
    const pp = chainPts(base.clone().add(V(0, -0.02, 0.04 * s)), [[0.07, 180, -70], [0.06, 180, -80], [0.06, 170, -85], [0.06, 160, -88], [0.05, 160, -90]]);
    pp.slice(0, -1).forEach((p, i) => mouth(seg(p, pp[i + 1], 0.018, 0.015, sk(G3)), 'palpmax', ex));
  }
  mouth(plate(V(-1.72, 0.46, 0), V(0.05, -0.09, 0), V(0, 0, 0.13), 0.3, sk(G3)), 'labio', V(0.3, -0.62, 0));
  for (const s of [1, -1]) {
    const pp = chainPts(V(-1.74, 0.42, 0.08 * s), [[0.06, 180, -75], [0.05, 175, -85], [0.05, 170, -88]]);
    pp.slice(0, -1).forEach((p, i) => mouth(seg(p, pp[i + 1], 0.016, 0.013, sk(G3)), 'palplab', V(0.3, -0.62, 0.04 * s)));
  }
  A('labro', V(-2.1, 0.62, 0), 'Labro', '"Lábio superior": cobre as mandíbulas pela frente. Não é um apêndice.', 'mouth', { obj: null });
  A('mand', V(-1.97, 0.55, 0.08), 'Mandíbulas', 'Fortes, com dentes: cortam e trituram folhas (aparelho bucal mastigador).', 'mouth');
  A('hipof', V(-1.86, 0.53, 0), 'Hipofaringe', 'Lobo em forma de língua; aí abre a glândula salivar.', 'mouth');
  A('maxila', V(-1.88, 0.44, 0.17), 'Maxilas (1.º par)', 'Seguram e manipulam o alimento; têm lacínia e gálea.', 'mouth');
  A('palpmax', V(-1.9, 0.3, 0.18), 'Palpos maxilares', '5 segmentos; sensoriais (gosto e tato).', 'mouth');
  A('labio', V(-1.72, 0.44, 0), 'Lábio', '"Lábio inferior": resulta da fusão do 2.º par de maxilas.', 'mouth');
  A('palplab', V(-1.76, 0.33, 0.08), 'Palpos labiais', '3 segmentos.', 'mouth');
  // âncoras das peças bucais seguem as malhas
  const firstByAid = (aid) => { let r = null; headG.traverse((o) => { if (!r && o.isMesh && o.userData.aid === aid && o.position.z >= -0.001) r = o; }); return r; };
  for (const id of ['labro', 'mand', 'hipof', 'maxila', 'palpmax', 'labio', 'palplab']) {
    const o = firstByAid(id);
    anchors[id].obj = o;
    anchors[id].p = V(0, 0, 0);
  }

  // ---------- TÓRAX ----------
  add(vtube([V(-1.55, 1.0, 0), V(-1.2, 0.98, 0), V(-0.85, 0.96, 0)], (t) => [0.3, 0.27, 0.22], sk(G1), { rad: 28, tub: 16 }), 'protorax');
  const pron = vtube([V(-1.57, 1.02, 0), V(-1.2, 1.03, 0), V(-0.8, 1.05, 0)], (t) => { const f = 0.86 + 0.14 * Math.sin(Math.PI * Math.min(1, t * 1.5)); return [0.35 * f + 0.03 * t, 0.32 * f + 0.02 * t, 0.3 * f]; }, sk(G2), { rad: 32, tub: 18 });
  add(pron, 'pronoto');
  add(vtube([V(-1.57, 1.36, 0), V(-0.8, 1.37, 0)], 0.012, G3, { rad: 6, tub: 6 }), 'pronoto');
  add(vtube([V(-0.88, 0.97, 0), V(-0.45, 0.96, 0), V(-0.02, 0.94, 0)], (t) => [0.29, 0.28, 0.27], sk(G1), { rad: 28, tub: 16 }), 'ptorax');
  A('torax', V(-0.9, 0.62, 0.3), 'Tórax (3 segmentos)', 'Protórax, mesotórax e metatórax: cada um com 1 par de patas. Meso e metatórax têm 1 par de asas cada.', 'ext tag');
  A('pronoto', V(-1.2, 1.36, 0.1), 'Pronoto', 'Escudo dorsal do protórax, em forma de sela.', 'ext');

  // ---------- ABDÓMEN ----------
  const apts = [V(-0.05, 0.94, 0), V(0.6, 0.92, 0), V(1.3, 0.85, 0), V(1.85, 0.79, 0), V(2.18, 0.76, 0)];
  const acurve = new THREE.CatmullRomCurve3(apts, false, 'centripetal');
  const abd = vtube(acurve, (t) => {
    const f = (t * 10) % 1;
    const g = 1 - 0.07 * Math.exp(-((f / 0.09) ** 2)) - 0.07 * Math.exp(-(((1 - f) / 0.09) ** 2));
    const r = (0.27 - 0.13 * t ** 1.4) * g;
    return [r, r * 0.95, r * 0.95];
  }, sk(G1), { rad: 30, tub: 140 });
  add(abd, 'abdomen');
  A('abdomen', V(1.0, 1.12, 0.1), 'Abdómen (11 segmentos)', 'Sem patas no adulto. Tem os espiráculos, o tímpano (1.º segmento) e, na ponta, cercos e genitália.', 'ext tag');
  // tímpano
  for (const s of [1, -1]) add(ell([0.09, 0.07, 0.02], V(0.12, 0.98, 0.265 * s), mat(0xd8cc9a, { r: 0.15, m: 0.1 }), { rot: [0, 0.25 * s, 0] }), 'timpano');
  A('timpano', V(0.12, 0.98, 0.29), 'Órgão timpânico', 'Membrana auditiva no 1.º segmento abdominal (nos grilos fica nas tíbias anteriores).', 'ext');
  // espiráculos
  const spir = [[-0.62, 0.83], [-0.22, 0.83]];
  for (let i = 0; i < 8; i++) { const t = 0.08 + i * 0.095; const c = acurve.getPointAt(t); spir.push([c.x, c.y - 0.05]); }
  for (const s of [1, -1]) for (const [x, y] of spir) {
    const t = Math.max(0, Math.min(1, (x + 0.05) / 2.23));
    const r = x < 0 ? 0.285 : (0.27 - 0.13 * t ** 1.4) * 0.97;
    add(ell([0.022, 0.014, 0.01], V(x, y, r * s * 0.96), 0x2a2010, { low: true }), 'espir');
  }
  A('espir', V(spir[4][0], spir[4][1], 0.24), 'Espiráculos (10 pares)', '2 torácicos + 8 abdominais: entradas do sistema traqueal, com válvulas.', 'ext resp');
  // cercos e ovipositor
  for (const s of [1, -1]) add(seg(V(2.12, 0.82, 0.08 * s), V(2.26, 0.86, 0.12 * s), 0.022, 0.005, G2), 'cercos');
  for (const s of [1, -1]) {
    add(vtube([V(2.15, 0.8, 0.04 * s), V(2.3, 0.84, 0.04 * s), V(2.4, 0.92, 0.03 * s)], (t) => 0.035 * (1 - t) + 0.006, sk(BR), { rad: 8, tub: 10 }), 'ovip');
    add(vtube([V(2.15, 0.7, 0.04 * s), V(2.3, 0.66, 0.04 * s), V(2.38, 0.6, 0.03 * s)], (t) => 0.035 * (1 - t) + 0.006, sk(BR), { rad: 8, tub: 10 }), 'ovip');
  }
  A('cercos', V(2.27, 0.88, 0.13), 'Cercos', 'Par de apêndices sensoriais do último segmento.', 'ext');
  A('ovip', V(2.42, 0.78, 0), 'Ovipositor', 'Valvas da fêmea que escavam o solo para pôr os ovos (numa ooteca).', 'ext rep');

  // ---------- PATAS ----------
  const podN = ['Coxa', 'Trocânter', 'Fémur', 'Tíbia', 'Tarso (3 artículos)'];
  const legs = [
    { b: V(-1.15, 0.72, 0.16), sp: (Y) => [[0.1, Y(100), -70], [0.06, Y(110), -50], [0.36, Y(160), -25], [0.38, Y(165), -75], [0.07, Y(170), -20], [0.06, Y(170), -10], [0.06, Y(170), -5]], r: [0.05, 0.045, 0.045, 0.038, 0.03, 0.025, 0.022, 0.012], id: 'pata1' },
    { b: V(-0.72, 0.7, 0.2), sp: (Y) => [[0.1, Y(95), -70], [0.06, Y(100), -45], [0.38, Y(125), -22], [0.4, Y(118), -75], [0.07, Y(110), -20], [0.06, Y(105), -10], [0.06, Y(100), -5]], r: [0.05, 0.045, 0.045, 0.038, 0.03, 0.025, 0.022, 0.012], id: 'pata2' },
  ];
  for (const L of legs) for (const s of [1, -1]) {
    const Y = (a) => (s > 0 ? a : 360 - a);
    const pts = chainPts(V(L.b.x, L.b.y, L.b.z * s), L.sp(Y));
    const lg = limb(pts, L.r, sk(G1), {});
    lg.traverse((o) => { if (o.isMesh) { o.userData.aid = L.id; o.userData.grp = s > 0 ? 'legR' : 'ext'; } });
    lg.add(seg(pts[7], pts[7].clone().add(V(0.03, -0.02, 0)), 0.01, 0.003, BR));
    body.add(lg);
  }
  // patas saltatórias
  for (const s of [1, -1]) {
    const Y = (a) => (s > 0 ? a : 360 - a);
    const pts = chainPts(V(-0.3, 0.7, 0.22 * s), [[0.1, Y(70), -60], [0.06, Y(60), -30], [1.0, Y(9), 30], [0.98, Y(181), -61], [0.12, Y(5), -55], [0.1, Y(0), -25], [0.1, Y(0), -12]]);
    const g = new THREE.Group();
    const segs = [];
    segs.push(seg(pts[0], pts[1], 0.07, 0.06, sk(G1)));
    segs.push(seg(pts[1], pts[2], 0.06, 0.06, sk(G1)));
    const fem = vtube([pts[2], pts[2].clone().lerp(pts[3], 0.3), pts[3]], (t) => [0.065 - 0.03 * t, 0.17 * Math.sin(Math.PI * (0.15 + 0.7 * t)) * (1 - 0.5 * t) + 0.04, 0.12 * Math.sin(Math.PI * (0.15 + 0.7 * t)) * (1 - 0.5 * t) + 0.04], sk(G1), { rad: 18, tub: 30, side0: V(0, 0, 1) });
    segs.push(fem);
    // padrão em espinha (marcas)
    for (let k = 1; k < 9; k++) {
      const p = pts[2].clone().lerp(pts[3], k / 10);
      g.add(seg(p.clone().add(V(-0.04, 0.07, 0.06 * s)), p.clone().add(V(0.04, -0.02, 0.065 * s)), 0.006, 0.006, G2, { rs: 4 }));
    }
    segs.push(seg(pts[3], pts[4], 0.035, 0.028, sk(0x8a5a3a)));
    for (let k = 1; k < 8; k++) {
      const p = pts[3].clone().lerp(pts[4], k / 8.5);
      for (const dz of [0.02, -0.02]) g.add(seg(p, p.clone().add(V(0.03, -0.035, (dz + 0.01) * s)), 0.008, 0.002, 0x2a1a10, { rs: 4 }));
    }
    for (let k = 4; k < 7; k++) segs.push(seg(pts[k], pts[k + 1], 0.025, 0.02, sk(0x8a5a3a)));
    g.add(seg(pts[7], pts[7].clone().add(V(0.04, -0.01, 0)), 0.012, 0.003, BR));
    segs.forEach((m) => g.add(m));
    g.traverse((o) => { if (o.isMesh) { o.userData.aid = 'pata3'; o.userData.grp = s > 0 ? 'legR' : 'ext'; } });
    if (s > 0) {
      const idx = [0, 1, 2, 3, 4];
      idx.forEach((k) => {
        const m = segs[k];
        m.userData.aid = 'hp' + k;
        const mid = k === 4 ? pts[5] : pts[k].clone().lerp(pts[k + 1], 0.5);
        A('hp' + k, mid, podN[k], k === 2 ? 'Fémur posterior enorme: contém os músculos do salto.' : k === 4 ? 'Nos gafanhotos (Caelifera) o tarso tem 3 artículos, com garras e arólio na ponta.' : k === 3 ? 'Com duas filas de espinhos.' : 'Segmento da pata.', 'leg', { g: 'legR' });
      });
    }
    body.add(g);
  }
  A('pata1', V(-1.55, 0.35, 0.3), 'Patas anteriores (protórax)', 'Locomotoras (caminhar, agarrar).', 'ext', { g: 'legR' });
  A('pata2', V(-0.95, 0.35, 0.55), 'Patas médias (mesotórax)', 'Locomotoras.', 'ext', { g: 'legR' });
  A('pata3', V(0.4, 1.15, 0.45), 'Patas posteriores saltatórias', 'Metatorácicas, adaptadas ao salto.', 'ext', { g: 'legR' });

  // ---------- ASAS ----------
  const wingGeo = (outline, L, W) => {
    const sh = new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x * L, y * W)));
    const g = new THREE.ShapeGeometry(sh, 24);
    const pos = g.attributes.position, uv = [];
    for (let i = 0; i < pos.count; i++) uv.push(pos.getX(i) / L, pos.getY(i) / W + 0.5);
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    return g;
  };
  const tegOut = [[0, -0.05], [0.15, -0.35], [0.6, -0.42], [0.92, -0.32], [1, -0.05], [0.95, 0.22], [0.6, 0.38], [0.2, 0.3], [0.03, 0.12]];
  const hindOut = [[0, -0.06], [0.4, -0.18], [0.85, -0.2], [1, -0.08], [0.98, 0.25], [0.85, 0.6], [0.6, 0.85], [0.3, 0.75], [0.08, 0.3]];
  const tegT = wingTex('tegmen', 'rgba(120,140,70,0.95)', 'rgba(60,70,30,0.9)');
  const hindT = wingTex('hind', 'rgba(220,232,225,0.55)', 'rgba(70,70,60,0.85)');
  const wings = [];
  for (const s of [1, -1]) {
    for (const kind of ['hind', 'teg']) {
      const pivot = new THREE.Group();
      pivot.position.set(kind === 'teg' ? -0.68 : -0.28, 1.2, 0.17 * s);
      const L = kind === 'teg' ? 2.75 : 2.45, W = kind === 'teg' ? 0.42 : 1.5;
      const m = new THREE.Mesh(wingGeo(kind === 'teg' ? tegOut : hindOut, L, W), mat(0xffffff, { map: kind === 'teg' ? tegT : hindT, r: 0.6 }));
      m.material.side = THREE.DoubleSide;
      m.castShadow = true;
      m.userData.aid = kind === 'teg' ? 'tegmina' : 'asaposterior';
      m.userData.grp = s > 0 ? 'legR' : 'ext';
      m.userData.cut = 'ext';
      m.userData.noInside = true;
      pivot.add(m);
      body.add(pivot);
      wings.push({ pivot, mesh: m, s, kind });
    }
  }
  A('tegmina', V(1.2, 1.25, 0.25), 'Asas anteriores (tégminas)', 'Do mesotórax; coriáceas, protegem as posteriores em repouso.', 'ext');
  A('asaposterior', V(0.6, 1.25, 1.4), 'Asas posteriores', 'Do metatórax; membranosas, dobradas em leque. São as que realmente batem no voo.', 'ext', { when: (c) => (c.param.wings || 0) > 0.5 });
  for (const w of wings) if (w.s > 0) { if (w.kind === 'teg') anchors.tegmina.obj = w.mesh, anchors.tegmina.p = V(1.4, 0, 0); else anchors.asaposterior.obj = w.mesh, anchors.asaposterior.p = V(1.4, 0.4, 0); }

  // ---------- INTERNOS ----------
  const I = (m, sys, aid, grp = 'int') => { m.userData.grp = grp; m.userData.grp2 = 'int'; m.userData.sys = sys; m.userData.aid = aid; body.add(m); return m; };
  const gut = 0xbfc77a, crop = 0xc9cf86, mg = 0x8fbf6a, red = 0xd8524c, blue = 0x4f7fd9, yel = 0xf0c63c, ov = 0xe892b5, sal = 0x9ad0c0, trach = 0xb08fe0;
  // digestivo
  I(vtube([V(-1.87, 0.58, 0), V(-1.93, 0.75, 0), V(-1.85, 0.95, 0), V(-1.6, 1.02, 0), V(-1.38, 1.0, 0)], 0.035, gut, { rad: 10, tub: 30 }), 'dig', 'esof');
  I(vtube([V(-1.42, 1.0, 0), V(-1.1, 1.0, 0), V(-0.7, 0.98, 0), V(-0.45, 0.96, 0)], (t) => 0.06 + 0.13 * Math.sin(Math.PI * t), mat(crop, { r: 0.45 }), { rad: 18, tub: 30 }), 'dig', 'papo');
  I(ell([0.13, 0.12, 0.12], V(-0.35, 0.95, 0), mat(0xa9b25a)), 'dig', 'proven');
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    const dy = Math.cos(a) * 0.1, dz = Math.sin(a) * 0.1;
    I(vtube([V(-0.18, 0.95 + dy * 0.6, dz * 0.6), V(-0.35, 0.95 + dy * 1.2, dz * 1.2), V(-0.5, 0.95 + dy * 1.1, dz * 1.1)], (t) => 0.04 * (1 - 0.4 * t), mat(0x7cbf9a), { rad: 8, tub: 10 }), 'dig', 'cecos', dz > 0.05 ? 'intR' : 'int');
    I(vtube([V(-0.15, 0.95 + dy * 0.6, dz * 0.6), V(0.0, 0.95 + dy * 1.1, dz * 1.1), V(0.12, 0.95 + dy, dz)], (t) => 0.035 * (1 - 0.4 * t), mat(0x7cbf9a), { rad: 8, tub: 10 }), 'dig', 'cecos', dz > 0.05 ? 'intR' : 'int');
  }
  I(vtube([V(-0.22, 0.95, 0), V(0.3, 0.92, 0), V(0.85, 0.88, 0)], 0.1, mat(mg, { r: 0.5 }), { rad: 16, tub: 20 }), 'dig', 'mesent');
  I(vtube([V(0.85, 0.88, 0), V(1.2, 0.84, 0), V(1.55, 0.8, 0), V(1.68, 0.79, 0)], 0.055, gut, { rad: 12, tub: 20 }), 'dig', 'colon');
  I(vtube([V(1.66, 0.79, 0), V(1.85, 0.78, 0), V(2.08, 0.77, 0)], (t) => 0.06 + 0.04 * Math.sin(Math.PI * t), mat(0xa7b060), { rad: 14, tub: 16 }), 'dig', 'reto');
  for (const s of [1, -1]) {
    I(ell([0.09, 0.06, 0.05], V(-1.2, 0.68, 0.09 * s), mat(sal, { bump: 'bumps', bs: 1 })), 'gland', 'salivar', s > 0 ? 'intR' : 'int');
    I(ell([0.07, 0.05, 0.04], V(-1.02, 0.7, 0.1 * s), mat(sal, { bump: 'bumps', bs: 1 })), 'gland', 'salivar', s > 0 ? 'intR' : 'int');
    I(vtube([V(-1.2, 0.66, 0.08 * s), V(-1.55, 0.6, 0.04 * s), V(-1.84, 0.54, 0)], 0.01, sal, { rad: 6, tub: 16 }), 'gland', 'salivar', s > 0 ? 'intR' : 'int');
  }
  // túbulos de Malpighi
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    const dir = k % 2 ? 1 : -1;
    const pts = [V(0.88, 0.88 + Math.cos(a) * 0.08, Math.sin(a) * 0.08)];
    for (let j = 1; j <= 5; j++) pts.push(V(0.88 + dir * j * 0.11, 0.88 + Math.cos(a + j * 0.5) * (0.12 + 0.02 * j), Math.sin(a + j * 0.5) * (0.12 + 0.02 * j)));
    I(vtube(pts, 0.011, yel, { rad: 5, tub: 30 }), 'exc', 'malp', pts[3].z > 0.08 ? 'intR' : 'int');
  }
  A('esof', V(-1.9, 0.82, 0), 'Faringe e esófago', 'Intestino anterior (estomodeu): revestido de cutícula, que muda em cada ecdise.', 'int dig');
  A('papo', V(-0.95, 1.15, 0), 'Papo', 'Armazena o alimento.', 'int dig');
  A('proven', V(-0.35, 1.05, 0), 'Proventrículo (moela)', 'Tritura com dentes cuticulares e filtra.', 'int dig');
  A('cecos', V(-0.45, 1.08, -0.1), 'Cecos gástricos', 'Divertículos do intestino médio: secretam enzimas e absorvem.', 'int dig');
  A('mesent', V(0.4, 0.82, 0), 'Intestino médio (mesêntero)', 'Digestão química e absorção. Única parte sem cutícula.', 'int dig');
  A('malp', V(0.95, 0.72, -0.12), 'Túbulos de Malpighi', 'Excreção: retiram resíduos azotados da hemolinfa e lançam-nos no intestino, na junção médio/posterior.', 'int exc');
  A('colon', V(1.3, 0.84, 0), 'Intestino posterior (íleo e cólon)', 'Proctodeu, revestido de cutícula.', 'int dig');
  A('reto', V(1.9, 0.78, 0), 'Reto', 'Reabsorve água e sais — fezes muito secas: adaptação à vida terrestre.', 'int dig exc');
  A('salivar', V(-1.15, 0.68, -0.09), 'Glândulas salivares', 'No tórax; os canais abrem na hipofaringe.', 'int');
  // circulatório
  I(vtube([V(2.05, 0.86, 0), V(1.4, 0.98, 0), V(0.7, 1.08, 0), V(0.0, 1.12, 0)], 0.035, mat(red, { r: 0.45 }), { rad: 10, tub: 40 }), 'circ', 'coracao');
  for (let i = 0; i < 7; i++) { const x = 0.15 + i * 0.27; I(ell([0.015, 0.015, 0.015], V(x, 1.11 - x * 0.12, -0.036), 0x5a1010, { low: true }), 'circ', 'ostios'); }
  I(vtube([V(0.0, 1.12, 0), V(-0.6, 1.16, 0), V(-1.2, 1.15, 0), V(-1.7, 1.1, 0)], 0.02, red, { rad: 8, tub: 30 }), 'circ', 'aorta');
  A('coracao', V(1.0, 1.05, 0), 'Coração (vaso dorsal)', 'Tubo dorsal no abdómen. A hemolinfa não transporta oxigénio (isso faz o sistema traqueal) e circula num sistema aberto.', 'int circ');
  A('ostios', V(0.69, 1.03, -0.04), 'Óstios', 'Pares segmentares de aberturas com válvulas.', 'int circ');
  A('aorta', V(-1.0, 1.15, 0), 'Aorta', 'Leva a hemolinfa para a cabeça, onde é libertada.', 'int circ');
  // nervoso
  I(ell([0.11, 0.08, 0.13], V(-1.83, 1.2, 0), blue), 'nerv', 'cerebro');
  I(ell([0.07, 0.05, 0.07], V(-1.84, 0.7, 0), blue), 'nerv', 'subes');
  for (const s of [1, -1]) I(vtube([V(-1.83, 1.15, 0.06 * s), V(-1.95, 0.95, 0.06 * s), V(-1.84, 0.72, 0.03 * s)], 0.012, blue, { rad: 6, tub: 12 }), 'nerv', 'cerebro', s > 0 ? 'intR' : 'int');
  const gangX = [[-1.2, 0.62], [-0.75, 0.6], [-0.32, 0.6], [0.2, 0.66], [0.55, 0.64], [0.9, 0.62], [1.25, 0.62], [1.6, 0.62]];
  I(vtube([V(-1.84, 0.7, 0), ...gangX.map(([x, y]) => V(x, y, 0))], 0.013, blue, { rad: 6, tub: 60 }), 'nerv', 'cordao');
  gangX.forEach(([x, y], i) => I(ell([0.055, 0.035, 0.05], V(x, y, 0), blue, { low: true }), 'nerv', i < 3 ? 'gtor' : 'gabd'));
  A('cerebro', V(-1.83, 1.28, 0), 'Cérebro', 'Gânglio supra-esofágico, ligado aos olhos e antenas.', 'int nerv');
  A('subes', V(-1.84, 0.66, 0), 'Gânglio subesofágico', 'Controla as peças bucais.', 'int nerv');
  A('gtor', V(-0.75, 0.56, 0), 'Gânglios torácicos (3)', 'Controlam patas e asas.', 'int nerv');
  A('gabd', V(0.9, 0.58, 0), 'Gânglios abdominais', 'Cordão nervoso ventral com gânglios (vários fundidos).', 'int nerv');
  // reprodutor
  for (let k = 0; k < 10; k++) for (const s of [1, -1]) I(ell([0.12, 0.03, 0.03], V(0.25 + k * 0.1, 1.0, 0.06 * s), mat(ov), { rot: [0, 0, -0.5] }), 'rep', 'ovario', s > 0 ? 'intR' : 'int');
  I(vtube([V(1.25, 0.98, -0.08), V(1.45, 0.78, -0.12), V(1.65, 0.66, -0.06), V(1.95, 0.66, 0)], 0.02, ov, { rad: 8, tub: 20 }), 'rep', 'oviduto');
  const coil = []; for (let k = 0; k <= 24; k++) { const a = k * 0.6; coil.push(V(1.55 + 0.05 * Math.cos(a), 0.6 + 0.04 * Math.sin(a) + k * 0.002, 0.03)); }
  I(vtube(coil, 0.01, 0xd46a9a, { rad: 6, tub: 60 }), 'rep', 'esperm');
  A('ovario', V(0.7, 1.06, 0), 'Ovários (ovaríolos)', 'Dorsais no abdómen, por cima do intestino.', 'int rep');
  A('oviduto', V(1.5, 0.72, -0.12), 'Oviduto', 'Leva os ovos até à vagina e ao ovipositor.', 'int rep');
  A('esperm', V(1.55, 0.6, 0.03), 'Recetáculo seminal (espermateca)', 'Guarda o esperma do macho; os ovos são fecundados ao passar.', 'int rep');
  // traqueias e sacos aéreos
  for (const s of [1, -1]) {
    const R = (x) => (x < 0 ? 0.24 : (0.27 - 0.13 * Math.min(1, (x + 0.05) / 2.23) ** 1.4) * 0.82);
    const lat = spir.map(([x, y]) => V(x, y + 0.03, R(x) * s));
    I(vtube([V(-1.7, 0.85, 0.15 * s), ...lat, V(2.05, 0.8, 0.07 * s)], 0.016, trach, { rad: 6, tub: 80 }), 'resp', 'traq', s > 0 ? 'intR' : 'int');
    I(vtube([V(-1.75, 1.15, 0.1 * s), V(-1.0, 1.15, 0.15 * s), V(0, 1.1, 0.13 * s), V(1.0, 1.0, 0.1 * s), V(1.9, 0.86, 0.05 * s)], 0.013, trach, { rad: 6, tub: 60 }), 'resp', 'traq', s > 0 ? 'intR' : 'int');
    for (const [x, y] of spir) I(seg(V(x, y + 0.03, R(x) * s), V(x + 0.03, y + 0.24, R(x) * 0.5 * s), 0.008, 0.006, trach), 'resp', 'traq', s > 0 ? 'intR' : 'int');
    for (const x of [0.35, 0.75, 1.15]) I(ell([0.12, 0.08, 0.06], V(x, 0.98, 0.16 * s), mat(trach, { op: 0.5 })), 'resp', 'sacos', s > 0 ? 'intR' : 'int');
  }
  for (const [x, y] of spir) I(seg(V(x, y + 0.03, -0.24), V(x, y + 0.03, 0.24), 0.007, 0.007, trach), 'resp', 'traq', 'intR');
  A('traq', V(-0.22, 0.86, -0.27), 'Traqueias', 'Tubos de cutícula reforçados (tenídios) que ramificam até traquíolas junto às células: o ar chega diretamente aos tecidos.', 'int resp');
  A('sacos', V(0.75, 0.98, -0.16), 'Sacos aéreos', 'Dilatações das traqueias que funcionam como foles (ventilação ativa).', 'int resp');

  for (const a of Object.values(anchors)) if (!a.obj) a.obj = body;
  const views = {
    hero: { pos: [-5.4, 3.2, 6.2], target: [0, 0.8, 0] },
    lateral: { pos: [0.1, 1.4, 8.0], target: [0.1, 0.9, 0] },
    head: { pos: [-4.6, 1.5, 2.8], target: [-1.9, 0.75, 0] },
    mouth: { pos: [-5.6, 0.9, 2.8], target: [-2.45, 0.35, 0.05] },
    leg: { pos: [0.2, 1.0, 5.2], target: [0.1, 0.6, 0.3] },
    top: { pos: [0.4, 11.5, 2.4], target: [0.3, 0.8, 0] },
    cut: { pos: [0.05, 1.15, 5.5], target: [0.05, 0.88, 0] },
    nymph: { pos: [-2.6, 2.2, 5.2], target: [0.2, 0.6, 0] },
  };
  return {
    root, anchors, views,
    defaults: { show: { ext: 1, legR: 1, int: 0, intR: 0 }, param: { wings: 0, size: 1, wpad: 1, headK: 1 } },
    systems: { dig: ['Digestivo', 0x9fc06a], circ: ['Circulatório', red], nerv: ['Nervoso', blue], exc: ['Excretor (Malpighi)', yel], resp: ['Respiratório (traqueias)', trach], rep: ['Reprodutor', ov], gland: ['Glândulas salivares', sal] },
    update(cur) {
      const w = cur.param.wings || 0, size = cur.param.size ?? 1, wp = cur.param.wpad ?? 1, hk = cur.param.headK ?? 1;
      body.scale.setScalar(size);
      body.position.y = 0;
      headG.scale.setScalar(hk);
      headG.position.set(-1.8 * (1 - hk), 1.0 * (1 - hk), 0);
      for (const W of wings) {
        const { pivot, mesh, s, kind } = W;
        // repouso: ao longo do corpo, em telhado; aberta: perpendicular ao corpo
        const restX = V(1, -0.1, 0).normalize();
        const restY = kind === 'teg' ? V(0, -0.82, 0.57 * s).normalize() : V(0, -0.35, 0.94 * s).normalize();
        const openX = V(kind === 'teg' ? 0.1 : 0.3, 0.04, s).normalize();
        const openY = V(1, 0, 0);
        const X = restX.clone().lerp(openX, w).normalize();
        let Y = restY.clone().lerp(openY, w);
        Y.sub(X.clone().multiplyScalar(Y.dot(X))).normalize();
        const Z = V().crossVectors(X, Y);
        pivot.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X, Y, Z));
        const fold = kind === 'hind' ? 0.15 + 0.85 * w : 1;
        mesh.scale.set(wp, fold * (0.4 + 0.6 * wp), 1);
        if (kind === 'hind') mesh.visible = mesh.visible && (w > 0.05 || wp > 0.3);
      }
    },
  };
}
