// Bloco de tegumento de artrópode (cutícula + epiderme)
import * as THREE from 'three';
import { V, mat, mk, ell, seg, vtube } from '../geo.js';

function stripes(c1, c2, n) {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = c1; g.fillRect(0, 0, 64, 256);
  g.strokeStyle = c2; g.lineWidth = 2;
  for (let i = 0; i < n; i++) { const y = (i + 0.5) * (256 / n); g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(20, y - 3, 40, y + 3, 64, y); g.stroke(); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildCuticle() {
  const root = new THREE.Group();
  const anchors = {};
  const A = (id, p, name, desc, set, extra = {}) => (anchors[id] = { p, name, desc, set, ...extra });
  const W = 3.2, D = 2.0;
  const layer = (y0, y1, color, aid, ex, tex) => {
    const g = new THREE.BoxGeometry(W, y1 - y0, D);
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
    if (tex) { m.map = tex; m.color.set(0xffffff); }
    m.userData = { baseOpacity: 1, baseTransparent: false, baseEmissive: new THREE.Color(0), baseEI: 1 };
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(0, (y0 + y1) / 2, 0);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData = { aid, explode: V(0, ex, 0), exKey: 'layers', cut: 'none' };
    root.add(mesh);
    return mesh;
  };
  layer(2.0, 2.07, 0x7a4a1c, 'epi', 1.0);
  layer(1.5, 2.0, 0xb7772e, 'exo', 0.68, stripes('#b7772e', '#9a5f22', 10));
  layer(0.8, 1.5, 0xead9a0, 'endo', 0.36, stripes('#ecdca4', '#c9b47a', 16));
  layer(0.3, 0.34, 0x8f8a80, 'basal', -0.25);
  // epiderme: células
  const n = 8, cw = W / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < 5; j++) {
    const g = new THREE.BoxGeometry(cw * 0.94, 0.44, (D / 5) * 0.94);
    const m = new THREE.MeshStandardMaterial({ color: 0x8fb0d8, roughness: 0.5 });
    m.userData = { baseOpacity: 1, baseTransparent: false, baseEmissive: new THREE.Color(0), baseEI: 1 };
    const c = new THREE.Mesh(g, m);
    c.position.set(-W / 2 + cw * (i + 0.5), 0.57, -D / 2 + (D / 5) * (j + 0.5));
    c.castShadow = true;
    c.userData = { aid: 'epid', explode: V(0, 0, 0), exKey: 'layers', cut: 'none' };
    root.add(c);
    if (j === 4) {
      const nu = ell([0.07, 0.07, 0.03], V(c.position.x, 0.58, D / 2 + 0.001), 0x2b4a7a, { low: true });
      nu.userData = { aid: 'epid', explode: V(0, 0, 0), exKey: 'layers', cut: 'none' };
      root.add(nu);
    }
  }
  // seta + canal de glândula tegumentar + canais de poros
  const seta = vtube([V(-0.6, 0.65, 0.4), V(-0.6, 1.4, 0.4), V(-0.55, 2.07, 0.4), V(-0.35, 2.8, 0.4), V(0.1, 3.4, 0.4)], (t) => 0.06 * (1 - t) + 0.01, mat(0x5a3416, { r: 0.4 }), { rad: 10, tub: 40 });
  seta.userData.aid = 'seta'; seta.userData.grp = 'seta'; seta.userData.cut = 'none';
  root.add(seta);
  const gl = ell([0.22, 0.16, 0.2], V(0.9, 0.42, 0.6), mat(0x6fa0c8, { bump: 'bumps', bs: 1 }));
  gl.userData = { aid: 'glteg', grp: 'seta', cut: 'none' };
  root.add(gl);
  const duct = vtube([V(0.9, 0.55, 0.6), V(0.92, 1.3, 0.6), V(0.9, 2.08, 0.6)], 0.018, 0x2b4a7a, { rad: 6, tub: 20 });
  duct.userData = { aid: 'glteg', grp: 'seta', cut: 'none' };
  root.add(duct);
  for (let k = 0; k < 10; k++) {
    const x = -1.3 + k * 0.28, z = D / 2 + 0.002;
    const p = seg(V(x, 0.82, z), V(x + 0.03, 2.0, z), 0.006, 0.006, 0x6a4a20, { rs: 4, shadow: false });
    p.userData = { aid: 'poros', explode: V(0, 0, 0), exKey: 'layers', cut: 'none', grp: 'seta' };
    root.add(p);
  }

  A('epi', V(1.2, 2.06, 0.5), 'Epicutícula', 'Camada externa muito fina, com ceras e lípidos: impermeabiliza (evita a perda de água). Não tem quitina.', 'cut');
  A('exo', V(1.4, 1.75, 1.0), 'Exocutícula', 'Rígida e escura: proteínas endurecidas (esclerotização / curtimento). Nos crustáceos, também calcificada (CaCO₃).', 'cut');
  A('endo', V(1.4, 1.15, 1.0), 'Endocutícula', 'Mais espessa e flexível: quitina + proteínas em lamelas. É reabsorvida antes da muda.', 'cut');
  A('procut', V(-1.6, 1.4, 1.0), 'Procutícula = exo + endocutícula', 'Contém a quitina (polissacarídeo).', 'cut', { side: 'l' });
  A('epid', V(1.4, 0.57, 1.0), 'Epiderme', 'Camada única de células vivas que segrega toda a cutícula.', 'cut');
  A('basal', V(1.4, 0.32, 1.0), 'Membrana basal', 'Separa a epiderme dos tecidos internos.', 'cut');
  A('seta', V(-0.35, 2.8, 0.4), 'Seta (pelo sensorial)', 'Formada por células da epiderme; muitas são mecanorreceptores.', 'cut', { g: 'seta' });
  A('glteg', V(0.9, 2.08, 0.6), 'Glândula tegumentar e canal', 'Segrega substâncias para a superfície (por exemplo, o cimento da epicutícula).', 'cut', { g: 'seta' });
  A('poros', V(-1.3, 1.4, 1.0), 'Canais de poros', 'Atravessam a procutícula e levam materiais até à superfície.', 'cut', { g: 'seta', side: 'l' });

  const views = {
    hero: { pos: [4.6, 3.6, 7.0], target: [0, 1.3, 0] },
    front: { pos: [0.6, 2.0, 8.0], target: [0, 1.4, 0] },
    explode: { pos: [5.0, 3.6, 7.6], target: [0, 1.8, 0] },
  };
  return { root, anchors, views, defaults: { show: { ext: 1, seta: 1 } } };
}
