// Motor 3D: cena, câmara, cortes de dissecação, legendas com linhas de chamada.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PAL, hex } from './palette.js';
const PALC = Object.fromEntries(Object.entries(PAL).map(([k, v]) => [k, new THREE.Color(v)]));

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export class Stage3D {
  constructor(host, labelHost) {
    this.host = host;
    this.labelHost = labelHost;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio, 1.25), 2));
    this.renderer.localClippingEnabled = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.55;

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.05, 200);
    this.camera.position.set(0, 3, 12);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 40;

    const key = new THREE.DirectionalLight(0xfff3e0, 2.0);
    key.position.set(-4, 9, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(4096, 4096);
    const sc = key.shadow.camera;
    sc.left = sc.bottom = -7; sc.right = sc.top = 7; sc.near = 1; sc.far = 30;
    key.shadow.bias = -0.0005;
    key.shadow.radius = 4;
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfd8ff, 0.9);
    rim.position.set(5, 4, -7);
    this.scene.add(rim);
    this.scene.add(new THREE.HemisphereLight(0xf1f5ea, 0x2a332d, 0.55));

    this.ground = new THREE.Mesh(new THREE.CircleGeometry(9, 64), new THREE.ShadowMaterial({ opacity: 0.32 }));
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -0.001;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    // planos de corte (coordenadas do mundo)
    this.sagPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 50);
    this.transPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 1000);

    this.models = {};
    this.model = null;
    this.state = null;
    this.cur = { cut: 0, explode: {}, groups: {}, param: {} };
    this.camTween = null;
    this.labels = new Map();
    this.testMode = false;
    this.revealed = new Set();
    this.hoverId = null;
    this.tprev = performance.now();
    this.active = false;

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.classList.add('leaders');
    labelHost.appendChild(this.svg);

    new ResizeObserver(() => this.resize()).observe(host);
    this.resize();
    this.controls.addEventListener('start', () => { this.camTween = null; this.userMoved = true; });
    this.renderer.domElement.addEventListener('dblclick', () => this.state && this.flyTo(this.state.view, 0.9));
    const loop = () => { requestAnimationFrame(loop); this.tick(); };
    loop();
  }

  resize() {
    const w = this.host.clientWidth || 1, h = this.host.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = w + 'px';
    this.renderer.domElement.style.height = h + 'px';
    this.camera.aspect = w / h;
    // em ecrãs estreitos afastar a câmara um pouco
    const asp = w / h;
    // em palcos estreitos as colunas de legendas ocupam mais espaço: afastar a câmara
    const narrow = w < 1000 && w >= 640 ? Math.pow(1000 / w, 1.15) : 1;
    this.fitScale = Math.max(asp < 1.3 ? Math.min(2.6, 1.45 / asp) : 1, narrow);
    this.camera.updateProjectionMatrix();
    this.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    this.W = w; this.H = h;
    const compact = w < 640;
    if (compact !== this.compact) { this.compact = compact; if (this.labels) { this.updateTest(); this.onLabels && this.onLabels(); } }
    if (this.labels) for (const [, L] of this.labels) L.h = 0;
  }

  register(name, builder) { this.builders = this.builders || {}; this.builders[name] = builder; }

  getModel(name) {
    if (!this.models[name]) {
      const m = this.builders[name]();
      m.name = name;
      this.scene.add(m.root);
      m.root.visible = false;
      // preparar materiais (corte + estado base)
      m.meshes = [];
      m.root.traverse((o) => {
        if (!o.isMesh) return;
        const u = o.userData;
        if (!u.grp) u.grp = 'ext';
        if (!u.cut) u.cut = u.grp === 'ext' || u.grp.startsWith('ext') ? 'ext' : 'int';
        if (u.cut === 'ext') o.material.clippingPlanes = [this.sagPlane, this.transPlane];
        else if (u.cut === 'int') o.material.clippingPlanes = [this.transPlane];
        o.material.clipShadows = true;
        if (u.cut === 'ext' && o.material.side === THREE.FrontSide && !u.noInside) o.material.side = THREE.DoubleSide;
        u.home = o.position.clone();
        if (u.sys) u.origColor = o.material.color.clone();
        const mu = o.material.userData;
        if (!(mu.baseEmissive && mu.baseEmissive.isColor)) mu.baseEmissive = o.material.emissive.clone();
        if (mu.baseOpacity == null) mu.baseOpacity = o.material.opacity;
        if (mu.baseTransparent == null) mu.baseTransparent = o.material.transparent;
        if (mu.baseEI == null) mu.baseEI = o.material.emissiveIntensity;
        if (u.cut === 'int') o.material.side = THREE.DoubleSide;
        m.meshes.push(o);
      });
      // expandir conjuntos de legendas
      m.sets = {};
      for (const [id, a] of Object.entries(m.anchors)) {
        a.id = id;
        (a.set || '').split(' ').filter(Boolean).forEach((s) => (m.sets[s] = m.sets[s] || []).push(id));
      }
      this.models[name] = m;
    }
    return this.models[name];
  }

  expandLabels(list) {
    const out = [];
    for (const l of list || []) {
      if (l.startsWith('@')) out.push(...(this.model.sets[l.slice(1)] || []));
      else out.push(l);
    }
    return out;
  }

  // aplica um estado resolvido (vindo do diapositivo)
  apply(modelName, state, instant = false) {
    const m = this.getModel(modelName);
    const changed = this.model !== m;
    if (changed) {
      if (this.model) this.model.root.visible = false;
      this.model = m;
      m.root.visible = true;
      this.cur = { cut: 0, tcut: null, explode: {}, groups: {}, param: { ...(m.defaults.param || {}) }, rot: 0 };
      // grupos começam no estado alvo para não piscarem
      for (const [g, v] of Object.entries(state.show)) this.cur.groups[g] = v;
      for (const [k, v] of Object.entries(state.param || {})) this.cur.param[k] = v;
      m.root.rotation.y = 0;
      this.clearLabels();
      instant = true;
    }
    this.ground.visible = m.ground !== false;
    this.state = state;
    const ids = new Set(this.expandLabels([...state.labels]));
    const fresh = new Set(this.expandLabels([...state.newLabels]));
    // remover legendas antigas
    this.hover(this.hoverId, false);
    for (const [id, L] of this.labels) if (!ids.has(id)) { L.el.remove(); L.line.remove(); L.dot.remove(); this.labels.delete(id); }
    for (const id of ids) if (!this.labels.has(id)) this.addLabel(id, fresh.has(id));
    for (const id of fresh) { const L = this.labels.get(id); if (L) { L.el.classList.remove('fresh'); void L.el.offsetWidth; L.el.classList.add('fresh'); } }
    this.flyTo(state.view, instant ? 0 : 1.3);
    this.updateTest();
    this.onLabels && this.onLabels();
  }

  flyTo(view, dur) {
    const v = typeof view === 'string' ? this.model.views[view] : view;
    if (!v) return;
    const k = this.fitScale || 1;
    const tgt = new THREE.Vector3(...v.target);
    const pos = new THREE.Vector3(...v.pos).sub(tgt).multiplyScalar(k).add(tgt);
    if (!dur) {
      this.camera.position.copy(pos);
      this.controls.target.copy(tgt);
      this.camTween = null;
      return;
    }
    this.camTween = { t: 0, dur, p0: this.camera.position.clone(), t0: this.controls.target.clone(), p1: pos, t1: tgt };
  }

  clearLabels() {
    for (const [, L] of this.labels) { L.el.remove(); L.line.remove(); L.dot.remove(); }
    this.labels.clear();
  }

  addLabel(id, fresh) {
    const a = this.model.anchors[id];
    if (!a) { console.warn('legenda em falta', id); return; }
    const el = document.createElement('div');
    el.className = 'lbl' + (fresh ? ' fresh' : '');
    el.innerHTML = `<span class="t">${a.name}</span>`;
    const sys = (a.set || '').split(' ').find((w) => PAL[w] && this.model.systems && this.model.systems[w]);
    if (sys) { el.style.borderLeftColor = hex(PAL[sys]); el.dataset.sys = sys; }
    el.dataset.id = id;
    if (a.desc) el.title = '';
    el.addEventListener('mouseenter', () => this.hover(id, true));
    el.addEventListener('mouseleave', () => this.hover(id, false));
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.testMode) { this.revealed.has(id) ? this.revealed.delete(id) : this.revealed.add(id); this.updateTest(); }
      this.onLabelClick && this.onLabelClick(a);
    });
    this.labelHost.appendChild(el);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', 3.2);
    this.svg.appendChild(line);
    this.svg.appendChild(dot);
    if (sys) { dot.style.fill = hex(PAL[sys]); line.style.stroke = hex(PAL[sys]); }
    this.labels.set(id, { el, line, dot, a, h: 0, n: this.labels.size + 1 });
    this.updateTest();
  }

  setTest(on) { this.testMode = on; this.revealed.clear(); this.updateTest(); }
  updateTest() {
    let n = 0;
    for (const [id, L] of this.labels) {
      n++;
      L.n = n;
      const hide = this.testMode && !this.revealed.has(id);
      L.el.querySelector('.t').textContent = this.compact ? String(n) : hide ? `? ${n}` : L.a.name;
      L.el.classList.toggle('quiz', hide);
      L.el.classList.toggle('num', !!this.compact);
      L.h = 0;
    }
  }
  labelList() { return [...this.labels.values()].map((L) => ({ id: L.a.id, n: L.n, name: L.a.name, desc: L.a.desc, hidden: this.testMode && !this.revealed.has(L.a.id) })); }

  hover(id, on) {
    if (id == null) { this.hoverId = null; this.hoverMeshes = []; return; }
    this.hoverId = on ? id : null;
    const L = this.labels.get(id);
    if (L) L.el.classList.toggle('hov', on);
    this.hoverMeshes = [];
    if (on) for (const m of this.model.meshes) if (m.userData.aid === id || (m.userData.aids && m.userData.aids.includes(id))) this.hoverMeshes.push(m);
  }

  groupVis(g) {
    if (!g) return 1;
    const v = this.cur.groups[g];
    return v == null ? 1 : v;
  }

  tick() {
    const now = performance.now(); const dt = Math.min((now - this.tprev) / 1000, 0.05); this.tprev = now;
    if (!this.active || !this.model) return;
    const m = this.model, st = this.state, cur = this.cur;
    const k = this.instant ? 1 : 1 - Math.exp(-dt * 4.5);
    // grupos
    for (const [g, v] of Object.entries(st.show)) {
      const c = cur.groups[g] ?? v;
      cur.groups[g] = c + (v - c) * k;
    }
    cur.cut += ((st.cut || 0) - cur.cut) * k;
    cur.tAmt = this.instant ? (st.tcut == null ? 0 : 1) : (cur.tAmt || 0) + ((st.tcut == null ? 0 : 1) - (cur.tAmt || 0)) * k;
    if (st.tcut != null) cur.tX = st.tcut;
    cur.tcut = cur.tAmt > 0.003 ? -10 + (cur.tX + 10) * cur.tAmt : null;
    for (const [e, v] of Object.entries(st.explode || {})) { const c = cur.explode[e] ?? 0; cur.explode[e] = c + (v - c) * k; }
    for (const e of Object.keys(cur.explode)) if (!(e in (st.explode || {}))) cur.explode[e] += (0 - cur.explode[e]) * k;
    for (const [p, v] of Object.entries(st.param || {})) { const c = cur.param[p] ?? v; cur.param[p] = typeof v === 'number' ? c + (v - c) * k : v; }

    // rotação
    if (st.spin && cur.cut < 0.02 && cur.tcut == null) m.root.rotation.y += dt * 0.35;
    else {
      let r = m.root.rotation.y % (Math.PI * 2);
      if (r > Math.PI) r -= Math.PI * 2;
      if (r < -Math.PI) r += Math.PI * 2;
      m.root.rotation.y = r + (0 - r) * Math.min(1, k * 1.4);
    }

    // planos
    this.sagPlane.constant = 6 * (1 - cur.cut) + 0.0001;
    this.transPlane.constant = cur.tcut == null ? 1000 : -cur.tcut;

    cur.tint = (cur.tint || 0) + ((st.tint ? 1 : 0) - (cur.tint || 0)) * k;
    // materiais
    const focus = this.tempFocus || st.focus;
    const t = performance.now() / 1000;
    for (const o of m.meshes) {
      const u = o.userData;
      let op = u.baseOp ?? o.material.userData.baseOpacity;
      op *= this.groupVis(u.grp);
      if (u.grp2) op *= this.groupVis(u.grp2);
      if (focus && u.sys && !focus.includes(u.sys)) op *= 0.1;
      if (focus && u.grp === 'ext' && u.sys == null) op *= 1;
      const mt = o.material;
      if (u.origColor && PALC[u.sys]) mt.color.copy(u.origColor).lerp(PALC[u.sys], cur.tint * 0.8);
      mt.opacity = op;
      mt.transparent = op < 0.995 || mt.userData.baseTransparent;
      mt.depthWrite = op > 0.6 && !mt.map;
      o.visible = op > 0.01;
      // explosão
      if (u.explode) {
        const e = cur.explode[u.exKey || 'x'] || 0;
        o.position.copy(u.home).addScaledVector(u.explode, e);
      }
      // destaque
      const hov = this.hoverMeshes && this.hoverMeshes.includes(o);
      if (hov) { mt.emissive.setRGB(0.9, 0.75, 0.25); mt.emissiveIntensity = 0.35 + 0.25 * Math.sin(t * 6); }
      else if (mt.emissiveIntensity !== mt.userData.baseEI || !mt.emissive.equals(mt.userData.baseEmissive)) { mt.emissive.copy(mt.userData.baseEmissive); mt.emissiveIntensity = mt.userData.baseEI; }
    }
    if (m.update) m.update(cur, dt, t);

    // câmara
    if (this.camTween) {
      const tw = this.camTween;
      tw.t += this.instant ? 1 : dt / tw.dur;
      const e = ease(Math.min(1, tw.t));
      this.camera.position.lerpVectors(tw.p0, tw.p1, e);
      this.controls.target.lerpVectors(tw.t0, tw.t1, e);
      if (tw.t >= 1) this.camTween = null;
    }
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.layoutLabels();
  }

  layoutLabels() {
    const W = this.W, H = this.H, cx = W / 2;
    const left = [], right = [];
    const v = new THREE.Vector3();
    const all = [];
    for (const [id, L] of this.labels) {
      const a = L.a;
      if (a.obj) a.obj.localToWorld(v.copy(a.p || new THREE.Vector3()));
      else this.model.root.localToWorld(v.copy(a.p));
      v.project(this.camera);
      const sx = (v.x * 0.5 + 0.5) * W, sy = (-v.y * 0.5 + 0.5) * H;
      let vis = v.z < 1 ? 1 : 0;
      if (a.g) vis *= this.groupVis(a.g);
      if (a.g2) vis *= this.groupVis(a.g2);
      if (a.when) vis *= a.when(this.cur) ? 1 : 0;
      if (!L.h) { L.h = L.el.offsetHeight || 22; L.w = L.el.offsetWidth || 100; }
      all.push({ L, sx, sy, vis });
    }
    if (this.compact) {
      for (const it of all) {
        const { L } = it;
        L.el.style.transform = `translate(${it.sx - L.w / 2}px, ${it.sy - L.h / 2}px)`;
        L.el.style.opacity = it.vis;
        L.el.style.pointerEvents = it.vis > 0.5 ? 'auto' : 'none';
        L.line.style.opacity = 0; L.dot.style.opacity = 0;
      }
      return;
    }
    const vis = all.filter((i) => i.vis > 0.3 && !i.L.a.inline);
    const mid = vis.length ? (Math.min(...vis.map((i) => i.sx)) + Math.max(...vis.map((i) => i.sx))) / 2 : cx;
    for (const it of all) {
      const a = it.L.a;
      if (a.inline) {
        const { L } = it;
        L.el.style.transform = `translate(${it.sx + 10}px, ${it.sy - L.h / 2}px)`;
        L.el.style.opacity = it.vis;
        L.el.style.pointerEvents = it.vis > 0.5 ? 'auto' : 'none';
        L.line.setAttribute('points', `${it.sx},${it.sy} ${it.sx + 10},${it.sy}`);
        L.line.style.opacity = it.vis;
        L.dot.setAttribute('cx', it.sx); L.dot.setAttribute('cy', it.sy); L.dot.style.opacity = it.vis;
        continue;
      }
      const side = a.side || (it.sx < mid ? 'l' : 'r');
      (side === 'l' ? left : right).push(it);
    }
    const place = (arr0, isLeft) => {
      if (!arr0.length) return;
      arr0.sort((p, q) => p.sy - q.sy);
      const need = arr0.reduce((a, i) => a + i.L.h + 5, 0);
      if (need > H - 20 && arr0.length > 3) {
        // demasiadas legendas: duas colunas (alternadas) neste lado
        const inner = arr0.filter((_, i) => i % 2 === 1), outer = arr0.filter((_, i) => i % 2 === 0);
        placeCol(outer, isLeft, 0);
        placeCol(inner, isLeft, 1);
      } else placeCol(arr0, isLeft, 0);
    };
    const placeCol = (arr, isLeft, lane) => {
      const gap = 5, top = 8, bot = H - 8;
      let y = top;
      for (const it of arr) { it.y = Math.max(it.sy - it.L.h / 2, y); y = it.y + it.L.h + gap; }
      let lim = bot;
      for (let i = arr.length - 1; i >= 0; i--) { const it = arr[i]; it.y = Math.min(it.y, lim - it.L.h); lim = it.y - gap; }
      for (const it of arr) it.y = Math.max(top, it.y);
      const xs = arr.map((i) => i.sx);
      if (!arr.length) return;
      const maxW = Math.max(...arr.map((i) => i.L.w));
      let col;
      if (isLeft) col = Math.min(Math.max(Math.min(...xs) - 46, maxW + 10), cx - 40);
      else col = Math.max(Math.min(Math.max(...xs) + 46, W - maxW - 10), cx + 40);
      if (lane === 1) {
        const outerW = Math.max(...arr.map((i) => i.L.w));
        col = isLeft ? Math.min(col + outerW + 14, cx - 20) : Math.max(col - outerW - 14, cx + 20);
        if (isLeft) col = Math.max(col, maxW * 2 + 26); else col = Math.min(col, W - maxW * 2 - 26);
      }
      for (const it of arr) {
        const { L } = it;
        const lx = isLeft ? col - L.w : col;
        L.el.style.transform = `translate(${lx}px, ${it.y}px)`;
        L.el.style.opacity = it.vis;
        L.el.style.pointerEvents = it.vis > 0.5 ? 'auto' : 'none';
        const ly = it.y + L.h / 2;
        const ex = isLeft ? col + 4 : col - 4;
        const mx = isLeft ? ex + 14 : ex - 14;
        L.line.setAttribute('points', `${ex},${ly} ${mx},${ly} ${it.sx},${it.sy}`);
        L.line.style.opacity = it.vis * 0.9;
        L.dot.setAttribute('cx', it.sx);
        L.dot.setAttribute('cy', it.sy);
        L.dot.style.opacity = it.vis;
        L.line.classList.toggle('hov', this.hoverId === L.a.id);
      }
    };
    place(left, true);
    place(right, false);
  }
}
