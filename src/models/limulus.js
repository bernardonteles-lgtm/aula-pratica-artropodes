// Limulus polyphemus (Merostomata, Xiphosura) — fêmea
import * as THREE from 'three';
import { V, mat, mk, ell, seg, vtube, dome, chainPts, limb, plate, tag, noiseTex } from '../geo.js';

const SH = 0x6e5c3a, SHD = 0x4e4128, LEG = 0x8f7b52, LEGD = 0x6c5a38;

export function buildLimulus() {
  const root = new THREE.Group();
  const anchors = {};
  const A = (id, p, name, desc, set, extra = {}) => (anchors[id] = { p, name, desc, set, ...extra });

  // ---------- PROSSOMA ----------
  const half = [[-2.05, 0], [-1.97, 0.55], [-1.72, 1.05], [-1.3, 1.42], [-0.75, 1.62], [-0.15, 1.6], [0.3, 1.45], [0.45, 1.25], [0.3, 0.9], [0.22, 0.45], [0.22, 0]];
  const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const liftP = (x, z) => 0.3 * sstep(-0.6, 0.22, x) * Math.max(0, 1 - (z / 1.35) ** 2);
  const liftO = (x, z) => 0.27 * (1 - sstep(0.25, 1.5, x)) * Math.max(0, 1 - (z / 1.2) ** 2);
  const full = [...half, ...half.slice(1, -1).reverse().map(([x, z]) => [x, -z])];
  const ridge = (x, z, s, face) => {
    let h = liftP(x, z);
    if (face) return h;
    if (x > -1.7) h += 0.035 * Math.exp(-((z / 0.07) ** 2));
    if (x > -1.2 && x < 0.25) h += 0.05 * Math.exp(-(((Math.abs(z) - 0.92) / 0.09) ** 2)) * Math.min(1, (x + 1.2) * 2);
    return h;
  };
  const pros = dome(full, [-0.65, 0], 0.62, mat(SH, { r: 0.42, bump: 'fine', bs: 0.6 }), { under: 0.3, hmod: ridge, y0: 0.02, U: 140, S: 30 });
  pros.userData.aid = 'prossoma';
  root.add(pros);
  const surf = (x, z) => pros.userData.surf(x, z);

  // olhos
  const eyeM = mat(0x111111, { r: 0.15 });
  for (const s of [1, -1]) {
    const e = ell([0.08, 0.03, 0.035], V(-0.55, surf(-0.55, 0.92 * s) + 0.02, 0.92 * s), eyeM.clone(), { rot: [0, 0.35 * s, 0] });
    e.userData.aid = 'olhoc';
    root.add(e);
    const o = ell([0.025, 0.018, 0.025], V(-1.55, surf(-1.55, 0.07 * s) + 0.02, 0.07 * s), eyeM.clone());
    o.userData.aid = 'ocelo';
    root.add(o);
  }
  A('prossoma', V(-1.1, 0.78, 0.4), 'Prossoma (carapaça)', 'Escudo dorsal em forma de ferradura que cobre o prossoma (cefalotórax). Protege os apêndices, que ficam todos por baixo.', 'ext dors');
  A('olhoc', V(-0.55, surf(-0.55, 0.92) + 0.03, 0.92), 'Olho composto lateral', 'Um par de olhos compostos sobre as cristas laterais. Os do límulo são modelo clássico em neurofisiologia da visão.', 'ext dors');
  A('ocelo', V(-1.55, surf(-1.55, 0.07) + 0.03, 0.07), 'Olhos medianos (ocelos)', 'Dois olhos simples junto à linha média, sensíveis sobretudo a UV.', 'ext dors');

  // charneira
  const hinge = seg(V(0.22, 0.28, -0.9), V(0.22, 0.28, 0.9), 0.035, 0.035, SHD);
  for (const s of [1, -1]) root.add(seg(V(0.4, 0.04, 1.27 * s), V(0.78, 0.03, 1.2 * s), 0.05, 0.006, SH));
  hinge.userData.aid = 'charn';
  root.add(hinge);
  A('charn', V(0.22, 0.3, 0.6), 'Charneira', 'Articulação entre prossoma e opistossoma: o animal dobra-se aqui.', 'ext dors');

  // ---------- OPISTOSSOMA ----------
  const oh = [[0.22, 0], [0.25, 0.45], [0.3, 1.0], [0.55, 1.12], [1.0, 0.92], [1.35, 0.62], [1.6, 0.35], [1.68, 0.12], [1.66, 0]];
  const ofull = [...oh, ...oh.slice(1, -1).reverse().map(([x, z]) => [x, -z])];
  const opis = dome(ofull, [0.85, 0], 0.3, mat(SH, { r: 0.42, bump: 'fine', bs: 0.6 }), { under: 0.16, y0: 0.04, U: 100, S: 20,
    hmod: (x, z, s, f) => liftO(x, z) + (f ? 0 : 0.03 * Math.exp(-((z / 0.07) ** 2)) - 0.02 * Math.exp(-(((Math.abs(z) - 0.45) / 0.05) ** 2))) });
  opis.userData.aid = 'opist';
  root.add(opis);
  // espinhos marginais móveis (6 por lado)
  for (const s of [1, -1])
    for (let i = 0; i < 6; i++) {
      const t = i / 5;
      const p = V(0.62 + t * 0.95, 0.06, (1.06 - t * 0.66) * s);
      const d = V(0.18, -0.01, 0.12 * s);
      const sp = seg(p, p.clone().add(d), 0.028, 0.004, SHD);
      sp.userData.aid = 'espinhos';
      root.add(sp);
    }
  A('opist', V(0.9, 0.45, 0.25), 'Opistossoma (abdómen)', 'Região posterior, formada por somitos fundidos numa só placa. Por baixo transporta as brânquias foliáceas.', 'ext dors');
  A('espinhos', V(1.2, 0.06, 0.78), 'Espinhos marginais móveis', 'Seis pares de espinhos articulados no bordo do opistossoma.', 'ext dors');

  // télson
  const tel = vtube([V(1.6, 0.16, 0), V(2.4, 0.2, 0), V(3.3, 0.13, 0), V(3.95, 0.05, 0)], (t) => [0.1 * (1 - t) + 0.01, 0.12 * (1 - t) + 0.01, 0.06 * (1 - t) + 0.008], mat(SHD, { r: 0.4 }), { rad: 6, tub: 40 });
  tel.userData.aid = 'telson';
  root.add(tel);
  A('telson', V(2.9, 0.2, 0), 'Télson', 'Espinho caudal articulado. Serve de leme e de alavanca para o animal se virar quando cai de costas — não é venenoso.', 'ext dors vent');

  // ---------- APÊNDICES (ventral) ----------
  const mouth = ell([0.07, 0.03, 0.05], V(-0.62, 0.15, 0), 0x2a1a12, { low: true });
  mouth.userData.aid = 'boca';
  root.add(mouth);
  A('boca', V(-0.62, 0.13, 0), 'Boca', 'Fica ao centro, entre as coxas das patas: os alimentos são triturados pelas gnatobases antes de entrarem.', 'vent');

  const legM = () => [mat(LEG, { r: 0.5 }), mat(LEGD, { r: 0.5 })];
  // quelíceras
  for (const s of [1, -1]) {
    const pts = chainPts(V(-0.92, 0.2, 0.08 * s), [[0.12, 180 - 20 * s, -8], [0.1, 180 - 10 * s, -10], [0.08, 180, -12]]);
    const q = limb(pts, [0.035, 0.03, 0.025, 0.01], legM(), {});
    tag(q, { aid: 'quel', grp: s > 0 ? 'legR' : 'ext' });
    root.add(q);
  }
  A('quel', V(-1.08, 0.18, 0.1), 'Quelíceras', '1.º par de apêndices: pequenas pinças junto à boca que levam o alimento às gnatobases.', 'vent ap');

  // 5 pares de patas
  const yaws = [150, 128, 106, 86, 66];
  for (let i = 0; i < 5; i++) {
    for (const s of [1, -1]) {
      const y = yaws[i];
      const yw = s > 0 ? y : 360 - y;
      const ys = (d) => (s > 0 ? y + d : 360 - y - d);
      const base = V(-0.92 + i * 0.16, 0.2, 0.15 * s);
      const L = i === 4 ? 1.05 : 1;
      const pts = chainPts(base, [[0.24, yw, 2], [0.1, ys(4), 8], [0.3 * L, ys(8), 14], [0.2 * L, ys(14), -12], [0.24 * L, ys(18), -24], [0.16 * L, ys(20), -32]]);
      const lg = limb(pts, [0.07, 0.05, 0.045, 0.04, 0.035, 0.028, 0.012], legM(), {});
      // gnatobase: espinhos na face medial da coxa
      for (let k = 0; k < 4; k++) {
        const p = base.clone().add(V(-0.03 + k * 0.025, -0.02, -0.03 * s));
        lg.add(seg(p, p.clone().add(V(0, -0.02, -0.07 * s)), 0.012, 0.002, 0xb7a57a, { rs: 5 }));
      }
      const tip = pts[pts.length - 1], pre = pts[pts.length - 2];
      if (i < 4) {
        // pinça (quela): dedo móvel
        const d = tip.clone().sub(pre).normalize();
        const side = V(-d.z, 0, d.x).multiplyScalar(0.03);
        lg.add(seg(pre.clone().lerp(tip, 0.4).add(side), tip.clone().add(side.clone().multiplyScalar(1.3)), 0.018, 0.005, LEGD));
      } else {
        // pata 5: lâminas terminais + flabelo na coxa
        const d = tip.clone().sub(pre).normalize();
        for (let b = 0; b < 4; b++) {
          const a = ((b - 1.5) * 0.5);
          const dir = V(d.x * Math.cos(a) - d.z * Math.sin(a), d.y, d.x * Math.sin(a) + d.z * Math.cos(a));
          lg.add(plate(tip.clone().add(dir.clone().multiplyScalar(0.05)), dir.clone().multiplyScalar(0.06), V(0, 1, 0).multiplyScalar(0.02), 0.25, LEGD));
        }
        const f = plate(pts[1].clone().add(V(0.05, 0.03, 0.02 * s)), V(0.08, 0, 0.03 * s), V(0, 0.04, 0), 0.25, 0xb7a57a);
        f.userData.aid = 'flab';
        lg.add(f);
      }
      tag(lg, { aid: i === 0 ? 'pata1' : i === 4 ? 'pata5' : 'pata', grp: s > 0 ? 'legR' : 'ext' });
      lg.userData.segs[0].userData.aids = ['gnato'];
      root.add(lg);
    }
  }
  A('pata1', V(-1.35, 0.1, 0.75), '1.º par de patas (pedipalpos)', 'Homólogo dos pedipalpos dos aracnídeos. Nas fêmeas termina em pinça; nos machos adultos é um gancho para agarrar a fêmea (clasper).', 'vent ap');
  A('pata', V(-0.55, 0.08, 1.05), 'Patas locomotoras (pares 2–4)', 'Terminam em pinça (quela). Caminham no fundo e trituram presas com as gnatobases.', 'vent ap');
  A('pata5', V(0.12, 0.05, 1.05), '5.º par: pata "empurradora"', 'Sem pinça: termina em lâminas que se abrem para empurrar o animal em fundos de areia ou lodo. Na coxa tem um flabelo (limpa as brânquias).', 'vent ap');
  A('gnato', V(-0.72, 0.17, 0.12), 'Gnatobases', 'Faces mediais espinhosas das coxas das patas: mastigam o alimento — o animal "mastiga com as pernas".', 'vent ap');

  // quilários
  for (const s of [1, -1]) {
    const c = plate(V(-0.12, 0.13, 0.11 * s), V(0.07, 0, 0.02 * s), V(0, 0, 0.04), 0.4, LEGD);
    c.userData.aid = 'quilar';
    root.add(c);
  }
  A('quilar', V(-0.12, 0.12, 0.13), 'Quilários', 'Pequeno par de apêndices reduzidos atrás do 5.º par de patas (1.º somito do opistossoma).', 'vent ap');

  // opérculo genital + 5 opérculos branquiais com lamelas
  const opM = 0xa08d62;
  const gen = plate(V(0.4, 0.11, 0), V(0.11, -0.01, 0), V(0, 0, 0.62), 0.22, opM);
  gen.userData.aid = 'opgen';
  gen.userData.explode = V(-0.05, -0.12, 0);
  gen.userData.exKey = 'gills';
  root.add(gen);
  A('opgen', V(0.42, 0.08, 0.35), 'Opérculo genital', 'Primeiro par de apêndices opistossomais, fundidos numa placa. Na face posterior abrem-se os gonóporos.', 'vent ap', { obj: gen, p: V(0, 0, 0.45) });
  const lamM = mat(0xc98b7a, { r: 0.6 });
  for (let i = 0; i < 5; i++) {
    const x = 0.63 + i * 0.19;
    const w = 0.56 - i * 0.05;
    const op = plate(V(x, 0.09, 0), V(0.1, -0.012, 0), V(0, 0, w), 0.2, opM);
    op.userData.aid = 'opbr';
    op.userData.explode = V(0.0, -0.18 - i * 0.02, 0);
    op.userData.exKey = 'gills';
    root.add(op);
    // brânquias foliáceas (lamelas) por cima de cada opérculo, ambos os lados
    for (const s of [1, -1])
      for (let k = 0; k < 7; k++) {
        const lam = plate(V(x + 0.02, 0.15 + k * 0.012, (0.12 + w * 0.42) * s), V(0.07, 0, 0), V(0, 0, w * 0.34), 0.08, lamM.clone());
        lam.userData.aid = 'branq';
        lam.userData.sys = 'resp';
        lam.userData.grp = 'ext';
        lam.userData.noInside = true;
        root.add(lam);
      }
  }
  A('opbr', V(1.05, 0.06, 0.3), 'Opérculos branquiais (5 pares)', 'Apêndices opistossomais achatados, cada par fundido numa placa. Movem-se ritmicamente: ventilam as brânquias e ajudam a nadar.', 'vent ap');
  A('branq', V(1.0, 0.2, -0.42), 'Brânquias foliáceas', 'Na face dorsal de cada opérculo há centenas de lamelas finas empilhadas como folhas de um livro: trocas gasosas com a água.', 'ap resp', { when: (c) => (c.explode.gills || 0) > 0.4 });

  const anus = ell([0.04, 0.02, 0.03], V(1.56, 0.1, 0), 0x2a1a12, { low: true });
  anus.userData.aid = 'anus';
  root.add(anus);
  A('anus', V(1.55, 0.09, 0), 'Ânus', 'Abre-se ventralmente, imediatamente antes do télson.', 'vent int');

  // ---------- INTERNOS ----------
  const I = (m, sys, aid, right = false) => { m.userData.grp = right ? 'intR' : 'int'; m.userData.sys = sys; m.userData.aid = aid; m.userData.grp2 = 'int'; root.add(m); return m; };
  const gut = 0x9fbf63, dg = 0x8a6d3b, red = 0xd8524c, blue = 0x4f7fd9, cox = 0xe0a040;
  // digestivo
  I(vtube([V(-0.62, 0.16, 0), V(-0.85, 0.28, 0), V(-1.1, 0.4, 0), V(-1.2, 0.46, 0)], 0.035, gut, { rad: 12, tub: 20 }), 'dig', 'esof');
  I(ell([0.2, 0.13, 0.12], V(-1.3, 0.5, 0), mat(0x86a84f, { r: 0.5 })), 'dig', 'proven');
  I(vtube([V(-1.15, 0.55, 0), V(-0.8, 0.52, 0), V(-0.3, 0.42, 0), V(0.2, 0.24, 0), V(0.8, 0.22, 0), V(1.3, 0.17, 0), V(1.55, 0.11, 0)], (t) => 0.06 - 0.025 * t, gut, { rad: 14, tub: 60 }), 'dig', 'intest');
  for (const s of [-1, 1])
    for (const [x, z, r] of [[-1.05, 0.5, 0.26], [-0.6, 0.75, 0.3], [-0.15, 0.85, 0.26], [-0.45, 0.35, 0.18], [0.55, 0.55, 0.2], [-1.35, 0.55, 0.2]]) {
      const m = ell([r, r * 0.55, r * 0.8], V(x, 0.36, z * s), mat(dg, { r: 0.7, bump: 'bumps', bs: 0.8 }));
      I(m, 'dig', 'gdig', s > 0);
    }
  A('esof', V(-0.95, 0.33, 0), 'Esófago', 'Da boca sobe e dirige-se para a frente — o tubo digestivo "volta para trás" a partir da moela.', 'int dig', { g: 'int' });
  A('proven', V(-1.32, 0.6, 0), 'Proventrículo (moela)', 'Moela musculosa revestida de cutícula: tritura o alimento; uma válvula impede o refluxo.', 'int dig', { g: 'int' });
  A('intest', V(0.6, 0.23, 0), 'Intestino', 'Percorre a linha média até ao ânus.', 'int dig', { g: 'int' });
  A('gdig', V(-0.6, 0.36, -0.75), 'Glândula digestiva (hepatopâncreas)', 'Grande massa ramificada que enche o prossoma: secreta enzimas, absorve e armazena nutrientes. As gónadas ficam entremeadas nela.', 'int dig', { g: 'int' });
  // circulatório
  I(vtube([V(-0.95, 0.62, 0), V(-0.4, 0.62, 0), V(0.2, 0.36, 0), V(0.7, 0.36, 0), V(1.2, 0.3, 0), V(1.45, 0.22, 0)], 0.055, mat(red, { r: 0.45 }), { rad: 14, tub: 50 }), 'circ', 'cor');
  for (let i = 0; i < 8; i++) {
    const x = -0.75 + i * 0.27;
    const y = x < 0.15 ? 0.62 - Math.max(0, x + 0.4) * 0.45 : 0.36 - (x - 0.7) * 0.14;
    I(ell([0.018, 0.018, 0.018], V(x, y, -0.055), 0x5a1010, { low: true }), 'circ', 'ostios');
  }
  I(vtube([V(-0.95, 0.62, 0), V(-1.4, 0.58, 0), V(-1.6, 0.4, 0), V(-1.2, 0.22, 0), V(-0.9, 0.2, 0)], 0.022, red, { rad: 8, tub: 30 }), 'circ', 'aorta');
  A('cor', V(0.2, 0.42, 0), 'Coração tubular', 'Tubo dorsal dentro do seio pericárdico. O sangue (hemolinfa) leva hemocianina — é azul — e é usado no teste LAL para detetar endotoxinas.', 'int circ', { g: 'int' });
  A('ostios', V(-0.21, 0.55, -0.05), 'Óstios (8 pares)', 'Aberturas com válvulas por onde a hemolinfa volta ao coração: sistema circulatório aberto.', 'int circ', { g: 'int' });
  A('aorta', V(-1.55, 0.48, 0), 'Artérias anteriores', 'Saem do coração e levam a hemolinfa para a frente; envolvem também o sistema nervoso.', 'int circ', { g: 'int' });
  // nervoso
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.03, 10, 24), mat(blue, { r: 0.4 }));
  ring.position.set(-0.82, 0.27, 0);
  ring.rotation.y = Math.PI / 2;
  ring.rotation.x = 0.6;
  I(ring, 'nerv', 'anel');
  I(vtube([V(-0.78, 0.2, 0), V(-0.2, 0.16, 0), V(0.5, 0.15, 0), V(1.35, 0.13, 0)], 0.018, blue, { rad: 8, tub: 30 }), 'nerv', 'cordao');
  for (let i = 0; i < 5; i++) I(ell([0.04, 0.03, 0.04], V(0.4 + i * 0.2, 0.15, 0), blue, { low: true }), 'nerv', 'cordao');
  A('anel', V(-0.82, 0.32, 0), 'Anel nervoso circum-esofágico', 'Cérebro e gânglios do prossoma fundidos num anel à volta do esófago.', 'int nerv', { g: 'int' });
  A('cordao', V(0.9, 0.15, 0), 'Cordão nervoso ventral', 'Continua para o opistossoma com gânglios que comandam os opérculos branquiais.', 'int nerv', { g: 'int' });
  // excretor
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) I(ell([0.09, 0.05, 0.06], V(-0.85 + i * 0.17, 0.27, 0.36 * s), cox), 'exc', 'coxal', s > 0);
  A('coxal', V(-0.6, 0.27, -0.36), 'Glândulas coxais', 'Órgãos excretores e osmorreguladores junto às coxas das patas; abrem perto da base do 5.º par.', 'int exc', { g: 'int' });

  const views = {
    hero: { pos: [-5.5, 4.2, 6.5], target: [0.4, 0.2, 0] },
    dorsal: { pos: [0.6, 9.8, 2.6], target: [0.6, 0, 0] },
    ventral: { pos: [0.4, 9.2, 2.4], target: [0.4, 0.6, 0] },
    ventralClose: { pos: [-0.4, 6.6, 2.4], target: [-0.4, 0.7, 0] },
    gills: { pos: [1.4, 5.4, 3.0], target: [0.9, 0.7, 0] },
    lateral: { pos: [0.4, 1.2, 8.8], target: [0.5, 0.35, 0] },
    cut: { pos: [0.1, 1.25, 4.3], target: [0.0, 0.32, 0] },
  };

  const model = {
    root, anchors, views,
    defaults: { show: { ext: 1, legR: 1, int: 0, intR: 0 }, param: { flip: 0 } },
    systems: { dig: ['Digestivo', gut], circ: ['Circulatório', red], nerv: ['Nervoso', blue], exc: ['Excretor', cox], resp: ['Respiratório', 0xc98b7a] },
    update(cur) {
      const f = cur.param.flip || 0;
      root.rotation.x = Math.PI * f;
      root.position.y = f * 0.95;
    },
  };
  return model;
}
