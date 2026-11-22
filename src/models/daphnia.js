// Daphnia (Branchiopoda, Cladocera) — fêmea partenogenética
import * as THREE from 'three';
import { V, mat, ell, seg, vtube, chainPts, limb, plate, setae, flatShape } from '../geo.js';

export function buildDaphnia() {
  const root = new THREE.Group();
  const anchors = {};
  const A = (id, p, name, desc, set, extra = {}) => (anchors[id] = { p, name, desc, set, ...extra });
  const shell = 0xd9d39a;

  // carapaça (bivalve, transparente) — forma contínua e afilada
  const car = vtube([V(-0.62, 1.52, 0), V(-0.1, 1.6, 0), V(0.5, 1.5, 0), V(1.0, 1.3, 0), V(1.3, 1.16, 0)], (t) => {
    const b = Math.pow(Math.sin(Math.PI * (0.06 + 0.9 * t)), 0.65);
    return [0.44 * b + 0.03, 0.56 * b + 0.04, 0.8 * b * (1 - 0.3 * t) + 0.04];
  }, mat(shell, { op: 0.26, r: 0.12, phys: true }), { tub: 80, rad: 48 });
  car.userData.aid = 'carapaca'; car.userData.cut = 'none'; car.userData.baseOp = 0.26;
  root.add(car);
  // linha da margem ventral da carapaça
  const rim = vtube([V(-0.45, 0.86, 0.36), V(0.0, 0.76, 0.4), V(0.6, 0.8, 0.36), V(1.1, 1.05, 0.22)], 0.012, mat(0xb9b27a, { op: 0.7 }), { rad: 8, tub: 40 });
  rim.userData.aid = 'carapaca'; rim.userData.cut = 'none';
  root.add(rim);
  const spine = vtube([V(1.2, 1.22, 0), V(1.65, 1.12, 0), V(2.2, 0.98, 0)], (t) => 0.075 * Math.pow(1 - t, 1.2) + 0.006, mat(shell, { op: 0.55, phys: true }), { rad: 16, tub: 30 });
  spine.userData.aid = 'espinho'; spine.userData.cut = 'none';
  root.add(spine);
  // cabeça e rostro
  const head = ell([0.46, 0.5, 0.33], V(-0.86, 1.62, 0), mat(shell, { op: 0.34, r: 0.12, phys: true }), { rot: [0, 0, 0.15] });
  head.userData.aid = 'cabeca'; head.userData.cut = 'none';
  root.add(head);
  const ros = vtube([V(-0.95, 1.35, 0), V(-1.12, 1.1, 0), V(-1.12, 0.92, 0), V(-1.06, 0.84, 0)], (t) => 0.16 * Math.pow(1 - t, 1.1) + 0.025, mat(shell, { op: 0.45, phys: true }), { rad: 20, tub: 30 });
  ros.userData.aid = 'rostro'; ros.userData.cut = 'none';
  root.add(ros);
  A('carapaca', V(0.6, 0.65, 0.3), 'Carapaça bivalve', 'Uma dobra única, comprimida lateralmente, que envolve o tronco mas não a cabeça. É transparente — vemos os órgãos por dentro!', 'ext');
  A('espinho', V(1.9, 1.08, 0), 'Espinho apical', 'Prolongamento posterior da carapaça.', 'ext');
  A('cabeca', V(-0.75, 2.05, 0.2), 'Cabeça', 'Não está coberta pela carapaça.', 'ext');
  A('rostro', V(-1.13, 1.0, 0), 'Rostro', 'Bico ventral da cabeça.', 'ext');

  // olhos
  const eye = ell([0.17, 0.17, 0.15], V(-1.14, 1.75, 0), mat(0x111111, { r: 0.2 }));
  eye.userData.aid = 'olho'; eye.userData.cut = 'none';
  root.add(eye);
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    const l = ell([0.035, 0.035, 0.035], V(-1.14 + Math.cos(a) * 0.16, 1.75 + Math.sin(a) * 0.16, 0.05 * Math.sin(a * 3)), mat(0xbfe3ff, { r: 0.1 }), { low: true });
    l.userData.aid = 'olho'; l.userData.cut = 'none';
    root.add(l);
  }
  const oc = ell([0.04, 0.04, 0.04], V(-1.02, 1.36, 0), 0x111111, { low: true });
  oc.userData.aid = 'ocelo'; oc.userData.cut = 'none';
  root.add(oc);
  A('olho', V(-1.18, 1.95, 0.1), 'Olho composto único', 'Os dois olhos compostos fundem-se num só, que o animal roda com músculos.', 'ext');
  A('ocelo', V(-1.02, 1.36, 0), 'Olho naupliar (ocelo)', 'Pequeno olho simples herdado da larva náuplio.', 'ext');

  // antênulas
  for (const s of [1, -1]) {
    const a = seg(V(-1.05, 0.95, 0.07 * s), V(-1.12, 0.82, 0.1 * s), 0.025, 0.02, mat(shell, { op: 0.8 }));
    a.userData.aid = 'antenula'; a.userData.cut = 'none';
    root.add(a);
    const st = setae(V(-1.12, 0.82, 0.1 * s), V(-1.12, 0.8, 0.1 * s), 4, 0.07, 0xf4f0d0, V(-0.3, -1, 0));
    st.traverse((o) => { if (o.isMesh) { o.userData.aid = 'antenula'; o.userData.cut = 'none'; } });
    root.add(st);
  }
  A('antenula', V(-1.17, 0.78, 0.1), 'Antênulas', '1.º par, pequeno e sensorial.', 'ext ap');

  // antenas natatórias birramosas (curvas suaves + sedas plumosas)
  const antM = () => mat(0xd6cf9c, { op: 0.92, r: 0.35, phys: true });
  const tagA = (o) => { o.traverse((c) => { if (c.isMesh) { c.userData.aid = 'antena'; c.userData.cut = 'none'; } }); return o; };
  for (const s of [1, -1]) {
    const b0 = V(-0.72, 1.88, 0.2 * s), b1 = V(-0.5, 2.1, 0.3 * s), b2 = V(-0.3, 2.22, 0.38 * s);
    root.add(tagA(vtube([b0, b1, b2], (t) => 0.075 - 0.025 * t, antM(), { rad: 18, tub: 24 })));
    for (const [dy, dz, n] of [[0.3, 0.1, 4], [0.02, 0.2, 3]]) {
      const end = b2.clone().add(V(0.75, dy, dz * s));
      const mid = b2.clone().lerp(end, 0.5).add(V(0, 0.08, 0.03 * s));
      const curve = [b2, mid, end];
      root.add(tagA(vtube(curve, (t) => 0.04 - 0.022 * t, antM(), { rad: 14, tub: 30 })));
      for (let k = 1; k <= n; k++) {
        const p = b2.clone().lerp(end, k / n);
        const tip = p.clone().add(V(0.6, -0.12 - k * 0.05, 0.14 * s));
        const sd = vtube([p, p.clone().lerp(tip, 0.5).add(V(0, 0.06, 0)), tip], (t) => 0.009 * (1 - t) + 0.002, 0xf4f0d6, { rad: 6, tub: 16, shadow: false });
        root.add(tagA(sd));
        const plume = setae(p.clone().lerp(tip, 0.15), p.clone().lerp(tip, 0.95), 10, 0.045, 0xf4f0d6, V(0.1, 1, 0));
        root.add(tagA(plume));
      }
    }
  }
  A('antena', V(0.25, 2.62, 0.5), 'Antenas (2.º par) — natatórias', 'Grandes e birramosas, com sedas plumosas: são os "remos". Nadam aos saltos — daí "pulga-de-água".', 'ext ap');

  // toracópodes (filopódios) — 5 pares, em forma de folha com pente de sedas
  const leaf = [[0, 0], [0.07, -0.04], [0.1, -0.16], [0.08, -0.28], [0.02, -0.34], [-0.05, -0.3], [-0.07, -0.16], [-0.05, -0.04]];
  for (let i = 0; i < 5; i++) {
    const x = -0.38 + i * 0.22;
    for (const s of [1, -1]) {
      const lf = flatShape(leaf, 0.015, mat(0xb9d38e, { op: 0.85, r: 0.4 }));
      lf.position.set(x, 1.12 - Math.abs(i - 2) * 0.025, 0.13 * s);
      lf.rotation.z = -0.25 + i * 0.06;
      lf.userData.aid = 'toracop'; lf.userData.cut = 'none';
      root.add(lf);
      const st = setae(V(x - 0.06, 0.8 - Math.abs(i - 2) * 0.02, 0.13 * s), V(x + 0.06, 0.8 - Math.abs(i - 2) * 0.02, 0.13 * s), 7, 0.09, 0xeef2d8, V(-0.3, -1, 0));
      st.traverse((o) => { if (o.isMesh) { o.userData.aid = 'toracop'; o.userData.cut = 'none'; } });
      root.add(st);
    }
  }
  A('toracop', V(0.05, 0.72, 0.15), 'Toracópodes (5 pares)', 'Patas foliáceas com pentes de sedas: criam corrente de água e filtram algas e bactérias. As trocas gasosas fazem-se sobretudo pela superfície do corpo e pela face interna da carapaça.', 'ext ap');

  // pós-abdómen com garras
  const pab = vtube([V(0.85, 1.05, 0), V(0.95, 0.85, 0), V(0.82, 0.62, 0), V(0.6, 0.55, 0)], (t) => 0.09 - 0.03 * t, mat(0xcbc48a, { op: 0.85 }), { rad: 10, tub: 20 });
  pab.userData.aid = 'posab'; pab.userData.cut = 'none';
  root.add(pab);
  for (const s of [1, -1]) {
    const c = vtube([V(0.6, 0.55, 0.03 * s), V(0.48, 0.5, 0.03 * s), V(0.4, 0.56, 0.03 * s)], (t) => 0.025 * (1 - t) + 0.004, 0x6b5a2a, { rad: 6, tub: 10 });
    c.userData.aid = 'garras'; c.userData.cut = 'none';
    root.add(c);
  }
  for (let k = 0; k < 6; k++) {
    const p = V(0.92 - k * 0.04, 0.82 - k * 0.04, 0);
    const sp = seg(p, p.clone().add(V(-0.04, -0.06, 0)), 0.008, 0.002, 0x6b5a2a);
    sp.userData.aid = 'posab'; sp.userData.cut = 'none';
    root.add(sp);
  }
  A('posab', V(1.02, 0.78, 0.1), 'Pós-abdómen', 'Dobrado para a frente, com espinhos anais: limpa os toracópodes.', 'ext');
  A('garras', V(0.42, 0.5, 0.05), 'Garras terminais', 'Garras do pós-abdómen.', 'ext');

  // ---------- INTERNOS (visíveis por transparência) ----------
  const I = (m, sys, aid, grp = 'int') => { m.userData.grp = grp; m.userData.sys = sys; m.userData.aid = aid; m.userData.cut = 'none'; root.add(m); return m; };
  const gut = 0x6f9a2c, red = 0xe0505a, blue = 0x4f7fd9, ov = 0x5d7f3a, egg = 0xd8c05a, sg = 0x8fc6e8;
  I(vtube([V(-0.82, 1.02, 0), V(-0.78, 1.3, 0), V(-0.72, 1.55, 0), V(-0.45, 1.62, 0), V(0.05, 1.52, 0), V(0.6, 1.32, 0), V(0.88, 1.08, 0), V(0.92, 0.8, 0), V(0.78, 0.62, 0)], (t) => 0.07 - 0.02 * t, mat(gut, { r: 0.5 }), { rad: 12, tub: 80 }), 'dig', 'intest');
  for (const s of [1, -1]) I(vtube([V(-0.72, 1.58, 0.03 * s), V(-0.82, 1.75, 0.08 * s), V(-0.75, 1.88, 0.1 * s)], (t) => 0.04 * (1 - t) + 0.015, mat(0x86b03a), { rad: 8, tub: 12 }), 'dig', 'cecos');
  A('intest', V(0.35, 1.45, 0), 'Intestino', 'Verde por causa das algas ingeridas. A boca fica entre as peças bucais, atrás do rostro.', 'int dig');
  A('cecos', V(-0.78, 1.85, 0.08), 'Cecos hepáticos', 'Par de divertículos digestivos na cabeça.', 'int dig');
  const h = ell([0.13, 0.09, 0.1], V(-0.25, 1.98, 0), mat(red, { r: 0.4 }));
  I(h, 'circ', 'coracao');
  A('coracao', V(-0.25, 2.06, 0), 'Coração', 'Pequeno, dorsal, atrás da cabeça. Vê-se a bater ao microscópio (centenas de batimentos por minuto): clássico em aulas práticas para testar o efeito de substâncias, como a cafeína.', 'int circ');
  I(ell([0.06, 0.05, 0.06], V(-0.98, 1.62, 0), blue), 'nerv', 'cerebro');
  A('cerebro', V(-0.98, 1.6, 0), 'Gânglio cerebral', 'Junto ao olho composto.', 'int nerv');
  for (const s of [1, -1]) I(vtube([V(0.15, 1.38, 0.17 * s), V(0.5, 1.28, 0.17 * s), V(0.85, 1.05, 0.15 * s)], 0.05, mat(ov), { rad: 10, tub: 20 }), 'rep', 'ovario');
  A('ovario', V(0.5, 1.26, 0.18), 'Ovários', 'Par, ao lado do intestino.', 'int rep');
  // glândula maxilar (enrolada)
  const coil = [];
  for (let k = 0; k <= 40; k++) { const a = k * 0.45; coil.push(V(-0.35 + 0.1 * Math.cos(a) + k * 0.004, 1.2 + 0.07 * Math.sin(a), 0.28)); }
  I(vtube(coil, 0.012, sg, { rad: 6, tub: 120 }), 'exc', 'gmax');
  A('gmax', V(-0.3, 1.2, 0.28), 'Glândula maxilar', 'Órgão excretor (tubo enrolado) na carapaça anterior.', 'int exc');
  // câmara incubadora com ovos partenogenéticos
  const bc = ell([0.48, 0.2, 0.3], V(0.48, 1.85, 0), mat(0xfff6c8, { op: 0.18 }));
  I(bc, 'rep', 'camara', 'eggs');
  const eggPos = [[0.15, 1.85, 0.12], [0.32, 1.92, -0.1], [0.5, 1.86, 0.1], [0.68, 1.9, -0.08], [0.82, 1.8, 0.06], [0.4, 1.78, -0.15], [0.62, 1.76, 0.18]];
  for (const [x, y, z] of eggPos) I(ell([0.1, 0.09, 0.09], V(x, y, z), mat(egg, { r: 0.4 })), 'rep', 'ovos', 'eggs');
  A('camara', V(0.95, 1.95, 0.2), 'Câmara incubadora', 'Espaço dorsal sob a carapaça onde os ovos se desenvolvem.', 'int rep', { g: 'eggs' });
  A('ovos', V(0.5, 1.88, 0.12), 'Ovos partenogenéticos', 'Diploides, sem fecundação: dão fêmeas iguais à mãe (clones). Eclodem como juvenis — não há náuplio livre.', 'int rep', { g: 'eggs' });
  // efípio
  const ep = ell([0.5, 0.22, 0.32], V(0.48, 1.9, 0), mat(0x3a2a14, { op: 0.92, r: 0.6, bump: 'bumps', bs: 1.5 }));
  I(ep, 'rep', 'efipio', 'ephip');
  for (const x of [0.32, 0.64]) I(ell([0.12, 0.08, 0.08], V(x, 1.9, 0.26), mat(0xa9853a)), 'rep', 'efipio', 'ephip');
  A('efipio', V(0.7, 2.12, 0.3), 'Efípio com 2 ovos de resistência', 'Parte da carapaça que escurece e envolve 2 ovos fecundados. Resiste à seca e ao frio, e é largada na muda.', 'int rep', { g: 'ephip' });

  const views = {
    hero: { pos: [-3.5, 2.6, 5.2], target: [0.2, 1.45, 0] },
    lateral: { pos: [0.25, 1.6, 6.4], target: [0.25, 1.5, 0] },
    head: { pos: [-1.8, 2.0, 3.6], target: [-0.6, 1.55, 0] },
    front: { pos: [-5.2, 2.2, 2.0], target: [-0.2, 1.6, 0] },
  };
  return {
    root, anchors, views, ground: false,
    defaults: { show: { ext: 1, int: 1, eggs: 1, ephip: 0 } },
    systems: { dig: ['Digestivo', gut], circ: ['Circulatório', red], nerv: ['Nervoso', blue], rep: ['Reprodutor', egg], exc: ['Excretor', sg] },
    update(cur, dt, t) {
      // batimento do coração
      const b = 1 + 0.12 * Math.max(0, Math.sin(t * 25));
      h.scale.set(0.13 * b, 0.09 * b, 0.1 * b);
      root.position.y = 0.05 * Math.sin(t * 1.3);
    },
  };
}
