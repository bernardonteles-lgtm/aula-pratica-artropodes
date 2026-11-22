// Geometria procedimental partilhada por todos os modelos.
// Convenção: anterior = -x, dorsal = +y, lado esquerdo do animal = +z.
import * as THREE from 'three';

export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);

// ---------- texturas (canvas) ----------
const texCache = {};
export function noiseTex(kind = 'hair', seed = 1) {
  const key = kind + seed;
  if (texCache[key]) return texCache[key];
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  g.fillStyle = '#808080';
  g.fillRect(0, 0, 512, 512);
  if (kind === 'hair') {
    for (let i = 0; i < 9000; i++) {
      const x = rnd() * 512, y = rnd() * 512, a = rnd() * 0.6 - 0.3, l = 4 + rnd() * 9;
      g.strokeStyle = `rgba(${rnd() > 0.5 ? 255 : 0},${rnd() > 0.5 ? 255 : 0},${rnd() > 0.5 ? 255 : 0},0.35)`;
      g.strokeStyle = rnd() > 0.5 ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.35)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
      g.stroke();
    }
  } else if (kind === 'bumps') {
    for (let i = 0; i < 1800; i++) {
      const x = rnd() * 512, y = rnd() * 512, r = 1 + rnd() * 4;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,.7)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x, y, r, 0, 7);
      g.fill();
    }
  } else if (kind === 'fine') {
    const d = g.getImageData(0, 0, 512, 512);
    for (let i = 0; i < d.data.length; i += 4) {
      const v = 110 + rnd() * 40;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
    }
    g.putImageData(d, 0, 0);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  texCache[key] = t;
  return t;
}

// Asa com nervuras (textura com transparência)
export function wingTex(kind = 'hind', base = 'rgba(210,225,215,0.45)', vein = 'rgba(70,60,40,0.9)') {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const g = c.getContext('2d');
  g.scale(2, 2);
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 256);
  g.strokeStyle = vein;
  g.lineWidth = 2.2;
  // nervuras longitudinais a partir da base (x=0)
  const n = kind === 'hind' ? 16 : 9;
  for (let i = 0; i < n; i++) {
    const y1 = 10 + (i / (n - 1)) * 236;
    g.beginPath();
    g.moveTo(0, 128 + (y1 - 128) * 0.15);
    g.bezierCurveTo(170, 128 + (y1 - 128) * 0.5, 340, y1, 512, y1);
    g.stroke();
  }
  // nervuras transversais
  g.lineWidth = 1;
  for (let k = 0; k < 140; k++) {
    const x = 60 + Math.random() * 440, y = Math.random() * 256;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + 4, y + 12);
    g.stroke();
  }
  if (kind === 'tegmen') {
    // manchas típicas de gafanhoto
    g.fillStyle = 'rgba(90,70,40,0.35)';
    for (let k = 0; k < 14; k++) {
      g.beginPath();
      g.ellipse(80 + Math.random() * 400, 60 + Math.random() * 140, 10 + Math.random() * 14, 6 + Math.random() * 9, 0, 0, 7);
      g.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------- material / malha ----------
export function mat(color, o = {}) {
  const M = o.phys ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  const m = new M({
    color,
    roughness: o.r ?? 0.55,
    metalness: o.m ?? 0.0,
    side: o.side ?? THREE.FrontSide,
    transparent: (o.op ?? 1) < 1 || !!o.map,
    opacity: o.op ?? 1,
    flatShading: !!o.flat,
  });
  if (o.phys) { m.clearcoat = 1; m.clearcoatRoughness = 0.15; m.sheen = 0.3; m.sheenColor = new THREE.Color(0xffffff); }
  if (o.bump) { m.bumpMap = noiseTex(o.bump, o.seed || 1); m.bumpScale = o.bs ?? 1.5; }
  if (o.map) { m.map = o.map; m.alphaTest = 0.02; m.side = THREE.DoubleSide; m.depthWrite = false; }
  if (o.emissive) { m.emissive = new THREE.Color(o.emissive); m.emissiveIntensity = o.ei ?? 0.4; }
  m.userData.baseOpacity = m.opacity;
  m.userData.baseTransparent = m.transparent;
  m.userData.baseEmissive = m.emissive.clone();
  m.userData.baseEI = m.emissiveIntensity;
  return m;
}

export function mk(geo, color, o = {}) {
  const m = new THREE.Mesh(geo, color instanceof THREE.Material ? color : mat(color, o));
  m.castShadow = o.shadow ?? true;
  m.receiveShadow = false;
  if (o.name) m.name = o.name;
  return m;
}

const sphG = new THREE.SphereGeometry(1, 64, 44);
const sphLow = new THREE.SphereGeometry(1, 24, 18);

export function ell(r, pos, color, o = {}) {
  const m = mk(o.low ? sphLow : sphG, color, o);
  m.scale.set(r[0], r[1], r[2]);
  m.position.copy(pos);
  if (o.rot) m.rotation.set(o.rot[0] || 0, o.rot[1] || 0, o.rot[2] || 0);
  return m;
}

// Segmento cónico entre dois pontos
export function seg(a, b, r0, r1, color, o = {}) {
  const d = b.clone().sub(a);
  const L = d.length();
  const g = new THREE.CylinderGeometry(r1, r0, L, Math.max(o.rs ?? 18, 8), 1, !!o.open);
  const m = mk(g, color, o);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(UP, d.normalize());
  return m;
}

// Tubo de raio variável ao longo de uma curva; secção elíptica
// rfn(t) -> número | [largura(z), alturaCima, alturaBaixo]
export function vtube(pts, rfn, color, o = {}) {
  if (typeof rfn !== 'function') { const k = rfn; rfn = () => k; }
  const curve = pts instanceof THREE.Curve ? pts : new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const T = Math.round((o.tub ?? 64) * 1.5), R = Math.max(12, Math.round((o.rad ?? 24) * 1.4));
  const side0 = o.side0 ? o.side0.clone() : V(0, 0, 1);
  const pos = [], idx = [], uv = [];
  for (let i = 0; i <= T; i++) {
    const t = i / T;
    const c = curve.getPointAt(t);
    const tg = curve.getTangentAt(t);
    let side = side0.clone().sub(tg.clone().multiplyScalar(side0.dot(tg))).normalize();
    if (side.lengthSq() < 1e-6) side = V(0, 1, 0);
    const up = V().crossVectors(tg, side).normalize();
    // garantir que "up" aponta para +y quando possível
    if (up.y < 0 && !o.keepUp) up.multiplyScalar(-1);
    let r = rfn(t);
    if (typeof r === 'number') r = [r, r, r];
    const [w, hu, hd] = r;
    for (let j = 0; j <= R; j++) {
      const a = (j / R) * Math.PI * 2;
      const cs = Math.cos(a), sn = Math.sin(a);
      const h = sn >= 0 ? hu : hd;
      const p = c.clone().add(side.clone().multiplyScalar(cs * w)).add(up.clone().multiplyScalar(sn * h));
      pos.push(p.x, p.y, p.z);
      uv.push(t, j / R);
    }
  }
  for (let i = 0; i < T; i++)
    for (let j = 0; j < R; j++) {
      const a = i * (R + 1) + j, b = a + R + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  if (o.cap !== false) {
    for (const [ring, flip] of [[0, true], [T, false]]) {
      const c = curve.getPointAt(ring / T);
      const ci = pos.length / 3;
      pos.push(c.x, c.y, c.z); uv.push(0.5, 0.5);
      const start = ci + 1;
      for (let j = 0; j <= R; j++) { const k = (ring * (R + 1) + j) * 3; pos.push(pos[k], pos[k + 1], pos[k + 2]); uv.push(0.5, 0.5); }
      for (let j = 0; j < R; j++) flip ? idx.push(ci, start + j + 1, start + j) : idx.push(ci, start + j, start + j + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return mk(g, color, o);
}

// Cúpula sobre um contorno fechado (vista dorsal no plano xz)
// outline: array de [x,z] (meia-volta ou volta completa); hfn(s) altura 0..1
export function dome(outline, center, H, color, o = {}) {
  const pts = outline.map(([x, z]) => new THREE.Vector3(x, 0, z));
  const curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  const U = o.U ?? 96, S = o.S ?? 24;
  const pos = [], idx = [];
  const prof = o.prof || ((s) => Math.pow(Math.max(0, 1 - s * s), 0.55));
  const under = o.under ?? null; // altura da face inferior (concha)
  const rows = under != null ? 2 : 1;
  for (let face = 0; face < rows; face++) {
    for (let i = 0; i <= U; i++) {
      const P = curve.getPoint(i / U);
      for (let j = 0; j <= S; j++) {
        const s = 1 - j / S; // de bordo (1) para centro (0)
        const x = center[0] + (P.x - center[0]) * s;
        const z = center[1] + (P.z - center[1]) * s;
        let y = face === 0 ? H * prof(s) : under * prof(s);
        if (o.hmod) y += o.hmod(x, z, s, face);
        pos.push(x, (o.y0 || 0) + y, z);
      }
    }
  }
  const per = (U + 1) * (S + 1);
  for (let face = 0; face < rows; face++)
    for (let i = 0; i < U; i++)
      for (let j = 0; j < S; j++) {
        const a = face * per + i * (S + 1) + j, b = a + S + 1;
        if (face === 0) idx.push(a, b, a + 1, b, b + 1, a + 1);
        else idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = mk(g, color, o);
  m.userData.surf = (x, z) => {
    // altura aproximada da superfície dorsal no ponto (x,z) — procura simples
    let best = 0, bd = 1e9;
    for (let k = 0; k < pos.length / 3 && k < per; k++) {
      const dx = pos[k * 3] - x, dz = pos[k * 3 + 2] - z;
      const d = dx * dx + dz * dz;
      if (d < bd) { bd = d; best = pos[k * 3 + 1]; }
    }
    return best;
  };
  return m;
}

// Cadeia articulada: origem + lista [comprimento, rumo(º, no plano xz, 0=+x, 90=+z), inclinação(º, + = para cima)]
export function chainPts(origin, specs) {
  const pts = [origin.clone()];
  let p = origin.clone();
  for (const [L, yaw, pitch] of specs) {
    const yr = (yaw * Math.PI) / 180, pr = (pitch * Math.PI) / 180;
    const d = V(Math.cos(yr) * Math.cos(pr), Math.sin(pr), Math.sin(yr) * Math.cos(pr));
    p = p.clone().add(d.multiplyScalar(L));
    pts.push(p);
  }
  return pts;
}

// Espelha uma lista de pontos para o outro lado (z -> -z)
export const mirrorPts = (pts) => pts.map((p) => V(p.x, p.y, -p.z));

// Membro: segmentos com articulações; colors pode ser cor única ou array
export function limb(pts, radii, colors, o = {}) {
  const g = new THREE.Group();
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const col = Array.isArray(colors) ? colors[i % colors.length] : colors;
    const r0 = radii[i], r1 = radii[i + 1] ?? radii[i] * 0.8;
    const s = seg(pts[i], pts[i + 1], r0, r1, col, { ...o, rs: o.rs ?? 16 });
    g.add(s);
    segs.push(s);
    if (o.joints !== false && i > 0) {
      const j = ell([r0 * 1.05, r0 * 1.05, r0 * 1.05], pts[i], o.jointColor ?? col, { low: true, ...o });
      g.add(j);
    }
  }
  g.userData.segs = segs;
  g.userData.pts = pts;
  return g;
}

// Cerdas (sedas) ao longo de um segmento — finos cilindros
export function setae(a, b, n, len, color, dir, o = {}) {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const p = a.clone().lerp(b, t);
    const d = dir.clone().normalize().multiplyScalar(len * (0.8 + 0.4 * Math.sin(i * 7.1)));
    g.add(seg(p, p.clone().add(d), o.r ?? 0.006, 0.002, color, { rs: 6, shadow: false }));
  }
  return g;
}

// Placa achatada (elipsoide muito fino) orientada por dois vetores
export function plate(center, a, b, thick, color, o = {}) {
  const m = mk(sphG, color, o);
  const ax = a.clone(), bx = b.clone();
  const n = V().crossVectors(ax, bx).normalize();
  const basis = new THREE.Matrix4().makeBasis(ax.clone().normalize(), bx.clone().normalize(), n);
  m.quaternion.setFromRotationMatrix(basis);
  m.scale.set(ax.length(), bx.length(), thick * Math.min(ax.length(), bx.length()));
  m.position.copy(center);
  return m;
}

// Forma plana (Shape) extrudida fina, posicionada por matriz
export function flatShape(points2d, thick, color, o = {}) {
  const sh = new THREE.Shape(points2d.map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: true, bevelThickness: thick * 0.4, bevelSize: thick * 0.4, bevelSegments: 3, curveSegments: 36 });
  g.translate(0, 0, -thick / 2);
  return mk(g, color, o);
}

export function tag(obj, data) {
  obj.traverse((c) => { if (c.isMesh) Object.assign(c.userData, data); });
  return obj;
}
