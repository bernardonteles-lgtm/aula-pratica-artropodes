// Lagostim-de-água-doce (Malacostraca, Decapoda, Astacidea) — macho
import * as THREE from 'three';
import { V, mat, mk, ell, seg, vtube, chainPts, limb, plate, tag, setae } from '../geo.js';

const SHELL = 0x8f3b22, SHELL2 = 0x6e2c18, LEGC = 0xa0482a, PALE = 0xd9a07a;
const sm = (x) => x * x * (3 - 2 * x);

export function buildCrayfish() {
  const root = new THREE.Group();
  const anchors = {};
  const A = (id, p, name, desc, set, extra = {}) => (anchors[id] = { p, name, desc, set, ...extra });
  const sh = (c = SHELL) => mat(c, { r: 0.38, bump: 'bumps', bs: 0.7, seed: 4 });

  // ---------- CEFALOTÓRAX ----------
  const sec = (t) => { const f = 0.35 + 0.65 * sm(Math.min(1, t / 0.08)); return [(0.2 + 0.36 * sm(Math.min(1, t / 0.55))) * f, (0.18 + 0.33 * sm(Math.min(1, t / 0.5))) * f, (0.15 + 0.3 * sm(Math.min(1, t / 0.45))) * f]; };
  const cpts = [V(-2.3, 0.84, 0), V(-1.9, 0.86, 0), V(-1.2, 0.86, 0), V(-0.5, 0.85, 0), V(-0.02, 0.82, 0)];
  const car = vtube(cpts, sec, sh(), { tub: 70, rad: 36 });
  car.userData.aid = 'carapaca';
  root.add(car);
  // sulco cervical
  const curveC = new THREE.CatmullRomCurve3(cpts, false, 'centripetal');
  const tC = 0.36, cC = curveC.getPointAt(tC), [wc, uc] = sec(tC);
  const ringPts = [];
  for (let a = 0.15; a <= Math.PI - 0.15; a += 0.15) ringPts.push(V(cC.x + 0.02 * Math.sin(a * 2), cC.y + Math.sin(a) * uc * 1.01, Math.cos(a) * wc * 1.01));
  const cerv = vtube(ringPts, 0.012, SHELL2, { rad: 6, tub: 30 });
  root.add(cerv);
  const ros = vtube([V(-2.25, 0.98, 0), V(-2.5, 0.99, 0), V(-2.82, 0.95, 0)], (t) => [0.09 * (1 - t) + 0.005, 0.03 * (1 - t) + 0.004, 0.02 * (1 - t) + 0.004], sh(), { rad: 10, tub: 16 });
  ros.userData.aid = 'rostro';
  root.add(ros);
  A('carapaca', V(-1.0, 1.32, 0.15), 'Carapaça', 'Dobra do exosqueleto que cobre todo o cefalotórax e, de lado, forma as câmaras branquiais (branquiostegitos).', 'ext');
  A('cefalo', V(-1.6, 0.6, 0.55), 'Cefalotórax (13 segmentos)', 'Cabeça (5 segmentos) + tórax (8) fundidos sob a carapaça.', 'ext');
  A('rostro', V(-2.6, 0.99, 0), 'Rostro', 'Prolongamento anterior da carapaça entre os olhos.', 'ext cab');
  A('sulco', V(cC.x, cC.y + uc, 0.15), 'Sulco cervical', 'Marca na carapaça que corresponde aproximadamente ao limite cabeça / tórax.', 'ext');

  // ---------- ABDÓMEN ----------
  const apts = [V(-0.12, 0.82, 0), V(0.5, 0.78, 0), V(1.1, 0.7, 0), V(1.7, 0.58, 0), V(2.22, 0.47, 0)];
  const acurve = new THREE.CatmullRomCurve3(apts, false, 'centripetal');
  for (let i = 0; i < 6; i++) {
    const t0 = i / 6, t1 = (i + 1) / 6 + 0.02;
    const pts = [];
    for (let k = 0; k <= 6; k++) pts.push(acurve.getPointAt(Math.min(1, t0 + (t1 - t0) * (k / 6))));
    const so = vtube(pts, (u) => {
      const T = t0 + (t1 - t0) * u;
      const s = 0.93 + 0.08 * u;
      return [(0.47 - 0.2 * T) * s, (0.33 - 0.12 * T) * s, (0.2 - 0.05 * T) * s];
    }, sh(i % 2 ? SHELL : 0x86361f), { tub: 10, rad: 30 });
    so.userData.aid = 'abd';
    root.add(so);
    // pleuras
    const c = acurve.getPointAt((t0 + t1) / 2);
    const w = 0.47 - 0.2 * ((t0 + t1) / 2);
    for (const s of [1, -1]) {
      const pl = plate(V(c.x, c.y - 0.12, w * 0.93 * s), V(0.12, 0, 0), V(0, -0.11, 0.035 * s), 0.25, sh());
      pl.userData.aid = 'pleura';
      pl.userData.grp = s > 0 ? 'legR' : 'ext';
      root.add(pl);
    }
  }
  A('abd', V(0.9, 1.06, 0.1), 'Abdómen (6 segmentos)', 'Musculoso e articulado. A flexão rápida do abdómen produz a fuga "para trás".', 'ext');
  A('pleura', V(1.1, 0.5, 0.45), 'Pleuras', 'Expansões laterais de cada tergito abdominal; protegem os pleópodes.', 'ext');

  // télson e urópodes (leque caudal)
  const tel = plate(V(2.52, 0.42, 0), V(0.32, -0.07, 0), V(0, 0, 0.19), 0.14, sh());
  tel.userData.aid = 'telson';
  root.add(tel);
  A('telson', V(2.7, 0.4, 0), 'Télson', 'Placa terminal com o ânus na base (não é um segmento verdadeiro: não tem apêndices).', 'ext');
  for (const s of [1, -1]) {
    root.add(ell([0.1, 0.05, 0.07], V(2.22, 0.43, 0.14 * s), sh()));
    const en = plate(V(2.5, 0.41, 0.24 * s), V(0.3, -0.06, 0.06 * s), V(-0.02, 0, 0.12 * s), 0.14, sh(0xa0472a));
    const ex = plate(V(2.47, 0.4, 0.42 * s), V(0.32, -0.06, 0.13 * s), V(-0.04, 0, 0.15 * s), 0.14, sh(0xa0472a));
    [en, ex].forEach((p) => { p.userData.aid = 'uropode'; root.add(p); });
  }
  A('uropode', V(2.5, 0.42, 0.5), 'Urópodes', '6.º par de apêndices abdominais, largos e birramosos; com o télson formam o leque caudal.', 'ext');

  // ---------- APÊNDICES CEFÁLICOS ----------
  const eyeM = mat(0x0b0b0b, { r: 0.12 });
  for (const s of [1, -1]) {
    const st = seg(V(-2.12, 0.86, 0.1 * s), V(-2.32, 0.92, 0.2 * s), 0.05, 0.055, PALE);
    st.userData.aid = 'olho';
    root.add(st);
    const e = ell([0.07, 0.065, 0.065], V(-2.36, 0.93, 0.22 * s), eyeM.clone());
    e.userData.aid = 'olho';
    root.add(e);
    // antênulas: 3 segmentos basais + 2 flagelos
    const ab = chainPts(V(-2.25, 0.76, 0.06 * s), [[0.12, s > 0 ? 175 : 185, 5], [0.1, s > 0 ? 172 : 188, 8], [0.1, s > 0 ? 170 : 190, 10]]);
    const al = limb(ab, [0.035, 0.03, 0.026, 0.022], LEGC);
    tag(al, { aid: 'antenula' });
    root.add(al);
    for (const [dy, dz, L] of [[0.12, 0.04, 0.75], [-0.02, 0.0, 0.55]]) {
      const f = vtube([ab[3], ab[3].clone().add(V(-L * 0.5, dy * 0.6, dz * s)), ab[3].clone().add(V(-L, dy, (dz + 0.05) * s))], (t) => 0.014 * (1 - t) + 0.004, LEGC, { rad: 5, tub: 16 });
      f.userData.aid = 'antenula';
      root.add(f);
    }
    // antena: protopodito + escafocerito + flagelo longo
    const pb = chainPts(V(-2.15, 0.66, 0.2 * s), [[0.16, s > 0 ? 165 : 195, 5], [0.14, s > 0 ? 168 : 192, 5], [0.12, s > 0 ? 172 : 188, 8]]);
    const pl = limb(pb, [0.05, 0.045, 0.04, 0.035], LEGC);
    tag(pl, { aid: 'antena' });
    root.add(pl);
    const sc = plate(V(-2.55, 0.73, 0.27 * s), V(0.2, 0.02, 0.02 * s), V(0, 0, 0.065), 0.2, sh());
    sc.userData.aid = 'escafo';
    root.add(sc);
    const fl = vtube([pb[3], V(-2.95, 0.8, 0.36 * s), V(-3.25, 1.0, 0.75 * s), V(-2.9, 1.15, 1.3 * s), V(-1.6, 1.2, 1.65 * s), V(-0.2, 1.05, 1.75 * s), V(0.9, 0.85, 1.7 * s)], (t) => 0.025 * (1 - t) + 0.005, LEGC, { rad: 6, tub: 120 });
    fl.userData.aid = 'antena';
    fl.userData.grp = s > 0 ? 'legR' : 'ext';
    root.add(fl);
  }
  A('olho', V(-2.38, 0.98, 0.22), 'Olhos compostos pedunculados', 'Montados em pedúnculos móveis — característica dos Malacostraca.', 'ext cab');
  A('antenula', V(-2.85, 0.85, 0.12), 'Antênulas (1.º par)', 'Com dois flagelos: tato, química e equilíbrio (estatocisto na base).', 'ext cab ap');
  A('antena', V(-3.2, 1.0, 0.75), 'Antenas (2.º par)', 'Flagelo muito longo, tátil. Os crustáceos são os únicos artrópodes com 2 pares de antenas.', 'ext cab ap', { g: 'legR' });
  A('escafo', V(-2.6, 0.75, 0.29), 'Escafocerito', 'Escama achatada da antena (é o seu exopodito).', 'ext cab ap');

  // 3.º maxilípedes visíveis
  for (const s of [1, -1]) {
    const pts = chainPts(V(-1.92, 0.36, 0.09 * s), [[0.12, s > 0 ? 160 : 200, -15], [0.22, s > 0 ? 178 : 182, -5], [0.18, s > 0 ? 180 : 180, -8], [0.14, 180, -12]]);
    const mx = limb(pts, [0.035, 0.032, 0.03, 0.025, 0.018], LEGC);
    tag(mx, { aid: 'maxilip' });
    root.add(mx);
  }
  A('maxilip', V(-2.35, 0.28, 0.1), 'Maxilípedes (3 pares)', 'Apêndices torácicos que manipulam o alimento junto da boca (atrás das mandíbulas e maxilas).', 'ext cab ap');
  A('boca', V(-1.92, 0.38, 0), 'Mandíbulas e maxilas', 'Escondidas por trás dos 3.os maxilípedes: mandíbulas (trituram) + 2 pares de maxilas.', 'ext cab ap');

  // ---------- PEREIÓPODES ----------
  const chela = (pal, dir, s, scale, col) => {
    const g = new THREE.Group();
    const d = dir.clone().normalize();
    const side = V(-d.z, 0, d.x).normalize().multiplyScalar(s);
    const pEnd = pal.clone().addScaledVector(d, 0.5 * scale);
    g.add(vtube([pal, pal.clone().addScaledVector(d, 0.25 * scale), pEnd], (t) => [0.13 * scale * (1 - 0.3 * t), 0.075 * scale, 0.075 * scale], sh(col), { rad: 16, tub: 12 }));
    // dedo fixo (do própodo) e dáctilo (móvel)
    g.add(vtube([pEnd.clone().addScaledVector(side, 0.05 * scale), pEnd.clone().addScaledVector(d, 0.25 * scale).addScaledVector(side, 0.07 * scale), pEnd.clone().addScaledVector(d, 0.48 * scale).addScaledVector(side, 0.02 * scale)], (t) => 0.05 * scale * (1 - t) + 0.006, sh(col), { rad: 10, tub: 16 }));
    const dac = vtube([pEnd.clone().addScaledVector(side, -0.05 * scale), pEnd.clone().addScaledVector(d, 0.24 * scale).addScaledVector(side, -0.1 * scale), pEnd.clone().addScaledVector(d, 0.46 * scale).addScaledVector(side, -0.03 * scale)], (t) => 0.05 * scale * (1 - t) + 0.006, sh(col), { rad: 10, tub: 16 });
    dac.userData.isDac = true;
    g.add(dac);
    return g;
  };
  for (const s of [1, -1]) {
    const Y = (a) => (s > 0 ? a : 360 - a);
    // quelípodes
    const pts = chainPts(V(-1.55, 0.36, 0.3 * s), [[0.12, Y(100), -25], [0.22, Y(128), -8], [0.55, Y(152), 12], [0.3, Y(172), 2]]);
    const q = limb(pts, [0.08, 0.075, 0.085, 0.1, 0.11], sh(LEGC));
    q.add(chela(pts[4], V(-1, 0.02, 0.1 * s), s, 1.3, SHELL));
    tag(q, { aid: 'quelip', grp: s > 0 ? 'legR' : 'ext' });
    root.add(q);
    // patas locomotoras 2–5
    [[-1.3, 104], [-1.05, 94], [-0.8, 80], [-0.55, 66]].forEach(([x, yw], i) => {
      const lp = chainPts(V(x, 0.38, 0.32 * s), [[0.1, Y(yw), -20], [0.2, Y(yw), 15], [0.45, Y(yw + 3), 25], [0.22, Y(yw + 5), -20], [0.3, Y(yw + 6), -55], [0.15, Y(yw + 6), -72]]);
      const lg = limb(lp, [0.045, 0.042, 0.04, 0.035, 0.03, 0.022, 0.008], sh(LEGC));
      if (i < 2) { const tip = lp[6], pre = lp[5]; lg.add(seg(pre.clone().lerp(tip, 0.3).add(V(0.02 * (i ? -1 : 1), 0, 0)), tip.clone().add(V(0.03, 0, 0)), 0.018, 0.004, LEGC)); }
      tag(lg, { aid: 'patas', grp: s > 0 ? 'legR' : 'ext' });
      root.add(lg);
      if (i === 3) { const gp = ell([0.03, 0.02, 0.03], V(x, 0.34, 0.34 * s), 0x2a1208, { low: true }); gp.userData.aid = 'gonoporo'; root.add(gp); }
    });
  }
  A('quelip', V(-2.6, 0.45, 0.65), 'Quelípodes (1.º par de patas)', 'Pereiópodes com pinça (quela) grande: defesa e captura.', 'ext ap', { g: 'legR' });
  A('quela', V(-3.0, 0.55, 0.75), 'Quela (pinça)', 'Formada pelo própodo (dedo fixo) e pelo dáctilo (dedo móvel).', 'ap', { g: 'legR' });
  A('patas', V(-0.9, 0.15, 1.15), 'Patas locomotoras (pares 2–5)', 'Os pares 2 e 3 têm pequenas pinças. Com os quelípodes, são 5 pares de pereiópodes: daí "Decapoda".', 'ext ap', { g: 'legR' });
  A('gonoporo', V(-0.55, 0.33, 0.34), 'Gonóporo masculino', 'No macho abre na coxa do 5.º par de patas (na fêmea, no 3.º par).', 'vent rep');

  // pleópodes
  for (let i = 0; i < 5; i++) {
    const c = acurve.getPointAt((i + 0.5) / 6);
    for (const s of [1, -1]) {
      const base = V(c.x, c.y - 0.18, 0.12 * s);
      if (i < 2) {
        // gonopódios do macho: dirigidos para a frente
        const g = seg(base, base.clone().add(V(-0.32 + i * 0.08, -0.08, 0.02 * s)), 0.025, 0.012, PALE);
        g.userData.aid = 'gonopod';
        g.userData.grp = s > 0 ? 'legR' : 'ext';
        root.add(g);
      } else {
        const pr = base.clone().add(V(0.02, -0.1, 0.02 * s));
        const g = new THREE.Group();
        g.add(seg(base, pr, 0.025, 0.022, LEGC));
        for (const dz of [0.02, -0.02]) {
          const e = pr.clone().add(V(0.12, -0.13, dz * s + 0.02 * s));
          g.add(seg(pr, e, 0.015, 0.006, LEGC));
          g.add(setae(pr, e, 6, 0.06, 0xe8c9a8, V(0.6, -0.3, 0)));
        }
        tag(g, { aid: 'pleop', grp: s > 0 ? 'legR' : 'ext' });
        root.add(g);
      }
    }
  }
  A('pleop', V(1.0, 0.33, 0.12), 'Pleópodes (nadadores)', 'Apêndices birramosos do abdómen. Nas fêmeas seguram os ovos até à eclosão.', 'ext ap', { g: 'legR' });
  A('gonopod', V(0.05, 0.48, 0.13), 'Gonopódios (pleópodes 1–2 do macho)', 'Modificados para transferir esperma.', 'ext ap rep', { g: 'legR' });

  // ---------- INTERNOS ----------
  const I = (m, sys, aid, right = false) => { m.userData.grp = right ? 'intR' : 'int'; m.userData.grp2 = 'int'; m.userData.sys = sys; m.userData.aid = aid; root.add(m); return m; };
  const gut = 0xb1c769, dg = 0xb38a43, red = 0xd8524c, blue = 0x4f7fd9, green = 0x2f9e6f, gill = 0xe7c8b4, tes = 0xf1eedf, mus = 0xeab3a0;
  // brânquias nas câmaras branquiais (ambos os lados)
  for (const s of [-1, 1])
    for (let i = 0; i < 7; i++) {
      const x = -1.7 + i * 0.22;
      for (let k = 0; k < 3; k++) {
        const b = ell([0.06, 0.24, 0.05], V(x + k * 0.05 - 0.05, 0.66 + k * 0.03, (0.36 - k * 0.04) * s), mat(gill, { r: 0.8, bump: 'hair', bs: 3 }), { rot: [0.35 * s, 0, -0.35] });
        I(b, 'resp', 'branquias', s > 0);
      }
    }
  A('branquias', V(-0.95, 0.85, -0.36), 'Brânquias', 'Plumosas, presas às bases das patas (podobrânquias), dentro da câmara branquial. A água é bombeada pelo escafognatito da 2.ª maxila.', 'int resp', { g: 'int' });
  // digestivo
  I(vtube([V(-1.93, 0.4, 0), V(-1.88, 0.6, 0), V(-1.8, 0.8, 0)], 0.04, gut, { rad: 10, tub: 12 }), 'dig', 'esof');
  I(ell([0.3, 0.22, 0.21], V(-1.72, 1.0, 0), mat(0xc8d27a, { r: 0.5 })), 'dig', 'estomago');
  I(ell([0.14, 0.13, 0.12], V(-1.33, 0.98, 0), mat(0xb8c868, { r: 0.5 })), 'dig', 'estomago');
  for (let k = 0; k < 3; k++) I(seg(V(-1.75 + k * 0.08, 1.12, 0), V(-1.72 + k * 0.08, 1.02, 0), 0.025, 0.004, 0x5a4a20), 'dig', 'moinho');
  I(vtube([V(-1.22, 0.98, 0), V(-0.9, 0.94, 0), V(-0.4, 0.92, 0), V(0.0, 0.88, 0), V(0.6, 0.88, 0), V(1.2, 0.78, 0), V(1.8, 0.62, 0), V(2.28, 0.44, 0)], 0.035, gut, { rad: 10, tub: 80 }), 'dig', 'intest');
  for (const s of [-1, 1]) for (const [x, z, r] of [[-1.05, 0.22, 0.32], [-0.55, 0.2, 0.3], [-0.8, 0.12, 0.22]])
    I(ell([r, r * 0.6, r * 0.6], V(x, 0.72, z * s), mat(dg, { r: 0.7, bump: 'bumps', bs: 1 })), 'dig', 'gdig', s > 0);
  A('esof', V(-1.9, 0.62, 0), 'Esófago', 'Curto, liga a boca ao estômago.', 'int dig', { g: 'int' });
  A('estomago', V(-1.72, 1.2, 0), 'Estômago (cardíaco + pilórico)', 'Câmara cardíaca grande, com o moinho gástrico, e câmara pilórica que filtra as partículas.', 'int dig', { g: 'int' });
  A('moinho', V(-1.65, 1.1, 0), 'Moinho gástrico', 'Dentes calcificados na parede do estômago que trituram o alimento.', 'int dig', { g: 'int' });
  A('intest', V(1.2, 0.8, 0), 'Intestino', 'Tubo que percorre o abdómen e termina no ânus, na base do télson.', 'int dig', { g: 'int' });
  A('gdig', V(-0.75, 0.62, -0.2), 'Glândula digestiva (hepatopâncreas)', 'Produz enzimas e absorve nutrientes; também reserva.', 'int dig', { g: 'int' });
  A('anus', V(2.3, 0.42, 0), 'Ânus', 'Na face ventral, na base do télson.', 'int dig', { g: 'int' });
  // circulatório
  const heart = ell([0.22, 0.1, 0.17], V(-0.6, 1.17, 0), mat(red, { r: 0.4 }));
  I(heart, 'circ', 'coracao');
  I(ell([0.32, 0.15, 0.27], V(-0.6, 1.15, 0), mat(0xf3b0b0, { op: 0.28 })), 'circ', 'pericard');
  for (const [x, z] of [[-0.7, 0.12], [-0.5, 0.12], [-0.6, 0.17]]) for (const s of [-1, 1]) I(ell([0.022, 0.012, 0.022], V(x, 1.22, z * s), 0x4a0808, { low: true }), 'circ', 'ostios', s > 0);
  I(vtube([V(-0.8, 1.17, 0), V(-1.4, 1.17, 0), V(-2.0, 1.02, 0), V(-2.15, 0.92, 0)], 0.018, red, { rad: 8, tub: 30 }), 'circ', 'arterias');
  I(vtube([V(-0.4, 1.15, 0), V(0.2, 1.03, 0), V(1.0, 0.92, 0), V(1.8, 0.72, 0), V(2.25, 0.52, 0)], 0.016, red, { rad: 8, tub: 50 }), 'circ', 'arterias');
  I(vtube([V(-0.6, 1.08, 0), V(-0.58, 0.75, 0.02), V(-0.6, 0.44, 0), V(-1.6, 0.44, 0)], 0.018, red, { rad: 8, tub: 30 }), 'circ', 'arterias');
  A('coracao', V(-0.6, 1.24, 0), 'Coração', 'Dorsal, dentro do seio pericárdico. Sistema circulatório aberto.', 'int circ', { g: 'int' });
  A('pericard', V(-0.32, 1.12, 0.1), 'Seio pericárdico', 'Cavidade que envolve o coração; a hemolinfa entra no coração por aqui.', 'int circ', { g: 'int' });
  A('ostios', V(-0.6, 1.24, -0.15), 'Óstios (3 pares)', 'Aberturas com válvulas na parede do coração.', 'int circ', { g: 'int' });
  A('arterias', V(0.6, 1.0, 0), 'Artérias', 'Anterior (para cabeça e olhos), dorsal abdominal e esternal (desce até ao lado ventral).', 'int circ', { g: 'int' });
  // nervoso
  I(ell([0.1, 0.08, 0.12], V(-2.05, 0.9, 0), blue), 'nerv', 'cerebro');
  for (const s of [-1, 1]) I(vtube([V(-2.05, 0.86, 0.06 * s), V(-1.98, 0.62, 0.07 * s), V(-1.78, 0.44, 0.03 * s)], 0.012, blue, { rad: 6, tub: 16 }), 'nerv', 'cerebro', s > 0);
  I(ell([0.09, 0.05, 0.06], V(-1.76, 0.43, 0), blue), 'nerv', 'subes');
  const nPts = [V(-1.76, 0.43, 0), V(-1.0, 0.42, 0), V(-0.15, 0.44, 0), ...[0.15, 0.35, 0.55, 0.75, 0.95].map((t) => acurve.getPointAt(t).add(V(0, -0.2, 0)))];
  I(vtube(nPts, 0.014, blue, { rad: 6, tub: 80 }), 'nerv', 'cordao');
  for (const x of [-1.5, -1.25, -1.0, -0.75, -0.5]) I(ell([0.045, 0.03, 0.04], V(x, 0.42, 0), blue, { low: true }), 'nerv', 'cordao');
  for (let i = 0; i < 6; i++) I(ell([0.04, 0.03, 0.04], acurve.getPointAt((i + 0.5) / 6).add(V(0, -0.2, 0)), blue, { low: true }), 'nerv', 'cordao');
  A('cerebro', V(-2.08, 0.96, 0), 'Cérebro (gânglio supra-esofágico)', 'Ligado ao gânglio subesofágico por conetivos que rodeiam o esófago.', 'int nerv', { g: 'int' });
  A('subes', V(-1.76, 0.4, 0), 'Gânglio subesofágico', 'Controla as peças bucais.', 'int nerv', { g: 'int' });
  A('cordao', V(0.6, 0.53, 0), 'Cordão nervoso ventral', 'Duplo, com gânglios em cada segmento (escada ganglionar).', 'int nerv', { g: 'int' });
  // excretor
  for (const s of [-1, 1]) { I(ell([0.1, 0.09, 0.08], V(-2.02, 0.6, 0.16 * s), green), 'exc', 'gverde', s > 0); I(ell([0.07, 0.05, 0.05], V(-1.95, 0.72, 0.12 * s), mat(0x8fd1b0, { op: 0.8 })), 'exc', 'gverde', s > 0); }
  A('gverde', V(-2.04, 0.58, -0.16), 'Glândula antenal (glândula verde)', 'Órgão excretor e osmorregulador; abre na base da antena.', 'int exc', { g: 'int' });
  // reprodutor
  for (const s of [-1, 1]) I(ell([0.3, 0.06, 0.08], V(-0.35, 1.0, 0.09 * s), tes), 'rep', 'testiculo', s > 0);
  I(ell([0.2, 0.05, 0.07], V(0.0, 0.98, 0), tes), 'rep', 'testiculo');
  I(vtube([V(-0.3, 0.98, -0.12), V(-0.45, 0.85, -0.22), V(-0.4, 0.7, -0.26), V(-0.52, 0.55, -0.3), V(-0.55, 0.38, -0.33)], 0.012, tes, { rad: 6, tub: 30 }), 'rep', 'vasdef');
  A('testiculo', V(-0.2, 1.02, 0), 'Testículo', 'Dorsal, por baixo do coração.', 'int rep', { g: 'int' });
  A('vasdef', V(-0.45, 0.7, -0.26), 'Canal deferente', 'Leva o esperma até ao gonóporo na coxa da 5.ª pata.', 'int rep', { g: 'int' });
  // músculos abdominais
  const mpts = [0.05, 0.25, 0.45, 0.65, 0.85, 0.98].map((t) => acurve.getPointAt(t).add(V(0, -0.06, 0)));
  I(vtube(mpts, (t) => [0.26 - 0.1 * t, 0.12, 0.13], mat(mus, { r: 0.6, bump: 'hair', bs: 1 }), { rad: 18, tub: 40 }), 'musc', 'musc');
  A('musc', V(1.3, 0.55, 0.05), 'Músculos flexores do abdómen', 'Massa muscular potente (a "cauda" que se come).', 'int', { g: 'int' });

  // ---------- TABULEIRO DE APÊNDICES ----------
  const tray = buildTray(anchors);
  root.add(tray);

  const views = {
    hero: { pos: [-5.5, 3.6, 6.8], target: [-0.2, 0.55, 0] },
    lateral: { pos: [-0.2, 1.4, 8.6], target: [-0.2, 0.6, 0] },
    dorsal: { pos: [-0.3, 10.5, 2.0], target: [-0.3, 0.4, 0] },
    head: { pos: [-4.8, 2.0, 3.6], target: [-2.2, 0.75, 0] },
    ventral: { pos: [-0.3, -4.2, 3.4], target: [-0.3, 0.45, 0] },
    cut: { pos: [-0.1, 1.7, 8.4], target: [-0.1, 0.75, 0] },
    xsec: { pos: [-4.2, 1.6, 1.8], target: [-0.75, 0.75, 0] },
    tray: { pos: [0.3, 2.05, 10.8], target: [0.3, 2.05, 0] },
  };
  return {
    root, anchors, views,
    defaults: { show: { ext: 1, legR: 1, int: 0, intR: 0, tray: 0 } },
    systems: { dig: ['Digestivo', gut], circ: ['Circulatório', red], nerv: ['Nervoso', blue], exc: ['Excretor', green], resp: ['Respiratório', gill], rep: ['Reprodutor', tes], musc: ['Músculos', mus] },
  };
}

// Apêndices "desmontados" e coloridos por ramo, como numa prancha de laboratório
function buildTray(anchors) {
  const g = new THREE.Group();
  const P = 0xe39a6f, E = 0x7fa8d6, X = 0xe8cf6a, G = 0xb98a6a, F = 0xd9a7a0;
  const m = (c) => mat(c, { r: 0.55 });
  const items = [];
  const add = (obj, id, name, desc, pos, lab) => {
    obj.position.copy(pos);
    obj.traverse((o) => { if (o.isMesh) { o.userData.grp = 'tray'; o.userData.cut = 'none'; o.userData.aid = id; } });
    g.add(obj);
    anchors[id] = { p: lab || V(0, 0, 0), obj, name, desc, set: 'tray', g: 'tray', inline: true };
    items.push(obj);
  };
  const L = (pts, r, c) => limb(pts, r, c, {});
  const straight = (x0, lens, y = 0, pitch = 0) => { const pts = [V(x0, y, 0)]; let x = x0, yy = y; for (const l of lens) { x += l * Math.cos(pitch); yy += l * Math.sin(pitch); pts.push(V(x, yy, 0)); } return pts; };
  const flag = (from, len, c, dy = 0, r = 0.018) => vtube([from, from.clone().add(V(len * 0.5, dy * 0.6, 0)), from.clone().add(V(len, dy, 0))], (t) => r * (1 - t) + 0.004, c, { rad: 6, tub: 16 });
  const plt = (c, a, b, col) => plate(c, a, b, 0.12, col);
  const gillP = (at) => { const o = ell([0.04, 0.15, 0.03], at.clone().add(V(0.04, 0.15, 0)), mat(G, { bump: 'hair', bs: 3 }), { rot: [0, 0, -0.4] }); return o; };

  // coluna 1 — cabeça
  const c1 = -3.7, c2 = -1.0, c3 = 2.4;
  let o = new THREE.Group();
  o.add(L(straight(0, [0.14, 0.12, 0.1]), [0.05, 0.045, 0.04, 0.035], m(P)));
  o.add(flag(V(0.36, 0, 0), 1.1, m(F), 0.12));
  o.add(flag(V(0.36, 0, 0), 0.85, m(F), -0.1));
  add(o, 't_antenula', 'Antênula', 'Pedúnculo de 3 segmentos e dois flagelos.', V(c1, 3.35, 0), V(0.7, 0.1, 0));
  o = new THREE.Group();
  o.add(L(straight(0, [0.14, 0.14]), [0.07, 0.065, 0.055], m(P)));
  o.add(plt(V(0.48, 0.12, 0), V(0.22, 0.03, 0), V(0, 0.06, 0), m(X)));
  o.add(L(straight(0.28, [0.12, 0.1, 0.08], -0.02), [0.045, 0.04, 0.035, 0.03], m(E)));
  o.add(flag(V(0.58, -0.02, 0), 1.6, m(E), -0.05));
  add(o, 't_antena', 'Antena', 'Exopodito = escama (escafocerito); endopodito = flagelo longo.', V(c1, 2.75, 0), V(1.0, 0, 0));
  o = new THREE.Group();
  o.add(ell([0.22, 0.13, 0.08], V(0.15, 0, 0), m(P)));
  for (let k = 0; k < 4; k++) o.add(seg(V(0.33, -0.06 + k * 0.04, 0), V(0.4, -0.06 + k * 0.04, 0), 0.015, 0.008, 0x8a5a3a));
  o.add(L([V(0.12, 0.1, 0), V(0.05, 0.3, 0), V(0.12, 0.42, 0), V(0.25, 0.46, 0)], [0.03, 0.028, 0.025, 0.02], m(E)));
  add(o, 't_mand', 'Mandíbula', 'Protopodito robusto com dentes (tritura) + palpo (endopodito).', V(c1, 2.1, 0), V(0.15, 0, 0));
  o = new THREE.Group();
  o.add(plt(V(0.15, 0, 0), V(0.16, 0, 0), V(0, 0.07, 0), m(P)));
  o.add(plt(V(0.18, -0.1, 0), V(0.12, -0.02, 0), V(0, 0.05, 0), m(P)));
  o.add(plt(V(0.38, 0.04, 0), V(0.1, 0.02, 0), V(0, 0.035, 0), m(E)));
  add(o, 't_maxilula', '1.ª maxila (maxílula)', 'Lâminas que seguram e passam o alimento.', V(c1, 1.55, 0), V(0.2, 0, 0));
  o = new THREE.Group();
  o.add(plt(V(0.12, 0, 0), V(0.14, 0, 0), V(0, 0.08, 0), m(P)));
  o.add(plt(V(0.28, 0.02, 0), V(0.08, 0, 0), V(0, 0.03, 0), m(E)));
  o.add(plt(V(0.25, 0.18, 0), V(0.3, 0.04, 0), V(0, 0.1, 0), m(X)));
  add(o, 't_maxila', '2.ª maxila', 'Tem o escafognatito (lâmina amarela) que bate e faz correr a água pelas brânquias.', V(c1, 0.95, 0), V(0.3, 0.18, 0));

  // coluna 2 — maxilípedes e quelípode
  const mxp = (endoL, withGill, scale = 1) => {
    const o = new THREE.Group();
    o.add(L(straight(0, [0.12, 0.12]), [0.06, 0.055, 0.05], m(P)));
    const ep = straight(0.24, endoL.map((l) => l * scale), 0, -0.15);
    o.add(L(ep, endoL.map((_, i) => 0.045 - i * 0.006).concat([0.015]), m(E)));
    o.add(L([V(0.2, 0.04, 0), V(0.35, 0.14, 0), V(0.55, 0.2, 0)], [0.025, 0.02, 0.015], m(X)));
    o.add(setae(V(0.35, 0.14, 0), V(0.75, 0.24, 0), 8, 0.08, 0xf1e2b8, V(0.3, 0.6, 0)));
    o.add(flag(V(0.55, 0.2, 0), 0.25, m(X), 0.06, 0.012));
    if (withGill) o.add(gillP(V(0.05, 0.05, 0)));
    return o;
  };
  add(mxp([0.12, 0.08], false), 't_mxp1', '1.º maxilípede', 'Lamelar, ainda parecido com uma maxila.', V(c2, 3.35, 0), V(0.3, 0, 0));
  add(mxp([0.14, 0.12, 0.1, 0.08], true), 't_mxp2', '2.º maxilípede', 'Já com forma de pata e uma brânquia.', V(c2, 2.75, 0), V(0.4, -0.05, 0));
  const m3 = mxp([0.22, 0.2, 0.16, 0.12, 0.1], true);
  add(m3, 't_mxp3', '3.º maxilípede', 'O maior; cobre as outras peças bucais.', V(c2, 2.05, 0), V(0.6, -0.1, 0));
  o = new THREE.Group();
  o.add(L(straight(0, [0.12, 0.12]), [0.08, 0.075, 0.07], m(P)));
  o.add(L(straight(0.24, [0.22, 0.45, 0.25]), [0.07, 0.075, 0.08, 0.09], m(E)));
  o.add(ell([0.3, 0.12, 0.09], V(1.42, 0, 0), m(E)));
  o.add(vtube([V(1.65, 0.05, 0), V(1.88, 0.07, 0), V(2.05, 0.03, 0)], (t) => 0.05 * (1 - t) + 0.008, m(E), { rad: 8, tub: 10 }));
  o.add(vtube([V(1.62, -0.06, 0), V(1.85, -0.1, 0), V(2.03, -0.04, 0)], (t) => 0.05 * (1 - t) + 0.008, m(E), { rad: 8, tub: 10 }));
  o.add(gillP(V(0.05, 0.05, 0)));
  add(o, 't_quelip', 'Quelípode', 'Protopodito (coxa+base) + endopodito (ísquio, mero, carpo, própodo, dáctilo). Sem exopodito no adulto.', V(c2 - 0.2, 1.25, 0), V(1.4, 0, 0));
  anchors.t_prot = { p: V(0.12, 0, 0), obj: o, name: 'Protopodito', desc: 'Parte basal do apêndice (coxa + base). Cor-de-laranja nesta prancha.', set: 'tray', g: 'tray' };
  anchors.t_endo = { p: V(0.7, 0, 0), obj: o, name: 'Endopodito', desc: 'Ramo interno. Azul nesta prancha. Nas patas é o ramo que forma a pata.', set: 'tray', g: 'tray' };
  anchors.t_exo = { p: V(0.4, 0.15, 0), obj: m3, name: 'Exopodito', desc: 'Ramo externo. Amarelo nesta prancha. Falta nas patas locomotoras do adulto.', set: 'tray', g: 'tray' };
  anchors.t_epi = { p: V(0.1, 0.25, 0), obj: o, name: 'Brânquia (epipodito)', desc: 'Presa à coxa da pata, dentro da câmara branquial.', set: 'tray', g: 'tray' };

  // coluna 3 — patas e abdómen
  const leg = (chel) => {
    const o = new THREE.Group();
    o.add(L(straight(0, [0.1, 0.1]), [0.05, 0.048, 0.045], m(P)));
    o.add(L(straight(0.2, [0.12, 0.42, 0.2, 0.3, 0.14]), [0.045, 0.042, 0.038, 0.032, 0.025, 0.006], m(E)));
    if (chel) o.add(seg(V(1.15, 0.03, 0), V(1.4, 0.06, 0), 0.02, 0.005, m(E)));
    o.add(gillP(V(0.05, 0.05, 0)));
    return o;
  };
  add(leg(true), 't_p2', '2.ª pata locomotora', 'Com pequena pinça (também a 3.ª).', V(c3 - 0.5, 3.35, 0), V(0.8, 0, 0));
  add(leg(false), 't_p4', '4.ª pata locomotora', 'Sem pinça (também a 5.ª).', V(c3 - 0.5, 2.75, 0), V(0.8, 0, 0));
  o = new THREE.Group();
  o.add(L(straight(0, [0.12]), [0.04, 0.035], m(P)));
  o.add(L([V(0.12, 0, 0), V(0.4, 0.05, 0), V(0.55, 0.12, 0), V(0.58, 0.2, 0)], [0.035, 0.03, 0.03, 0.025], m(E)));
  add(o, 't_gono', 'Pleópode 1 (gonopódio ♂)', 'Rígido, em calha: transfere o esperma.', V(c3 - 0.5, 2.15, 0), V(0.4, 0.05, 0));
  o = new THREE.Group();
  o.add(L(straight(0, [0.15]), [0.04, 0.035], m(P)));
  o.add(flag(V(0.15, 0, 0), 0.55, m(E), 0.08, 0.02));
  o.add(flag(V(0.15, 0, 0), 0.5, m(X), -0.08, 0.02));
  o.add(setae(V(0.2, 0.02, 0), V(0.65, 0.08, 0), 10, 0.09, 0xf1e2b8, V(0.2, 1, 0)));
  o.add(setae(V(0.2, -0.02, 0), V(0.6, -0.08, 0), 10, 0.09, 0xf1e2b8, V(0.2, -1, 0)));
  add(o, 't_pleop', 'Pleópode 3 (nadador)', 'Birramoso típico, com sedas. Apêndice abdominal.', V(c3 - 0.5, 1.55, 0), V(0.4, 0, 0));
  o = new THREE.Group();
  o.add(ell([0.12, 0.09, 0.05], V(0.05, 0, 0), m(P)));
  o.add(plate(V(0.42, 0.13, 0), V(0.32, 0.08, 0), V(-0.05, 0.16, 0), 0.12, m(X)));
  o.add(plate(V(0.38, -0.12, 0), V(0.3, -0.06, 0), V(0.04, 0.13, 0), 0.12, m(E)));
  add(o, 't_urop', 'Urópode', 'Último par: ramos largos que formam o leque caudal com o télson.', V(c3 - 0.5, 0.9, 0), V(0.45, 0, 0));

  return g;
}
