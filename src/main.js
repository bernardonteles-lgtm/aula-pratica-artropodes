import { Stage3D } from './engine.js';
import { SLIDES } from './slides.js';
import { buildLimulus } from './models/limulus.js';
import { buildSpider } from './models/spider.js';
import { buildCrayfish } from './models/crayfish.js';
import { buildDaphnia } from './models/daphnia.js';
import { buildGrasshopper } from './models/grasshopper.js';
import { buildCuticle } from './models/cuticle.js';

const $ = (s) => document.querySelector(s);
const stage = new Stage3D($('#gl'), $('#labels'));
stage.register('limulus', buildLimulus);
stage.register('aranha', buildSpider);
stage.register('lagostim', buildCrayfish);
stage.register('daphnia', buildDaphnia);
stage.register('gafanhoto', buildGrasshopper);
stage.register('cuticula', buildCuticle);

let si = 0, step = 0, lastSlide = -1;

function resolve(slide, k) {
  const m = stage.getModel(slide.model);
  const st = { view: slide.view || 'hero', show: { ...m.defaults.show }, cut: 0, tcut: null, focus: null, labels: new Set(), spin: false, explode: {}, param: { ...(m.defaults.param || {}) } };
  const all = [slide.init || {}, ...slide.steps.slice(0, k + 1)];
  for (const s of all) {
    if (s.view) st.view = s.view;
    if (s.show) Object.assign(st.show, s.show);
    if ('cut' in s) st.cut = s.cut;
    if ('tcut' in s) st.tcut = s.tcut;
    if ('focus' in s) st.focus = s.focus;
    if (s.clear) st.labels.clear();
    (s.labels || []).forEach((l) => st.labels.add(l));
    (s.unlabel || []).forEach((l) => st.labels.delete(l));
    if (s.explode) Object.assign(st.explode, s.explode);
    if (s.param) Object.assign(st.param, s.param);
  }
  st.spin = !!slide.steps[k].spin;
  st.newLabels = new Set(slide.steps[k].labels || []);
  return st;
}

function renderPanel(slide, k, fresh) {
  $('#kicker').textContent = slide.sec;
  $('#title').innerHTML = slide.title;
  $('#sub').innerHTML = slide.sub || '';
  const notes = $('#notes');
  if (fresh) notes.innerHTML = '';
  const want = slide.steps.slice(0, k + 1).map((s) => s.n).filter(Boolean);
  // reconstruir quando se recua
  const have = notes.children.length;
  if (have > want.length || fresh) {
    notes.innerHTML = '';
    want.forEach((t) => { const d = document.createElement('div'); d.className = 'note'; d.innerHTML = t; notes.appendChild(d); });
  } else {
    for (let i = have; i < want.length; i++) { const d = document.createElement('div'); d.className = 'note new'; d.innerHTML = want[i]; notes.appendChild(d); }
  }
  [...notes.children].forEach((d, i) => d.classList.toggle('cur', i === want.length - 1 && !!slide.steps[k].n));
  const last = notes.lastElementChild;
  if (last) last.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  // legenda de sistemas
  const lg = $('#legend');
  lg.innerHTML = '';
  if (slide.model) {
    const m = stage.getModel(slide.model);
    const st = resolve(slide, k);
    if (st.focus && m.systems) {
      for (const s of st.focus) if (m.systems[s]) lg.innerHTML += `<span><i style="background:#${m.systems[s][1].toString(16).padStart(6, '0')}"></i>${m.systems[s][0]}</span>`;
    }
  }
  $('#info').style.display = 'none';
}

function applyHtml(slide, k) {
  const host = $('#html');
  const z = host.querySelector('.zoomable');
  host.querySelectorAll('[data-s]').forEach((el) => {
    const s = el.dataset.s;
    let show;
    if (s.includes('-')) { const [a, b] = s.split('-').map(Number); show = k >= a && k <= b; }
    else show = k >= +s;
    el.classList.toggle('hide-s', !show);
  });
  host.querySelectorAll('[data-hl]').forEach((el) => {
    const s = el.dataset.hl;
    let on;
    if (s.includes('-')) { const [a, b] = s.split('-').map(Number); on = k >= a && k <= b; }
    else on = k >= +s;
    el.classList.toggle('hl-on', on);
  });
  let zoom = [50, 50, 1];
  for (const s of slide.steps.slice(0, k + 1)) if (s.zoom) zoom = s.zoom;
  if (z) z.style.transform = `scale(${zoom[2]}) translate(${50 - zoom[0]}%, ${50 - zoom[1]}%)`;
  if (slide.onStep) slide.onStep(k, host);
}

function show(newSi, newStep) {
  si = Math.max(0, Math.min(SLIDES.length - 1, newSi));
  const slide = SLIDES[si];
  step = Math.max(0, Math.min(slide.steps.length - 1, newStep));
  const fresh = si !== lastSlide;
  renderPanel(slide, step, fresh);
  if (slide.model) {
    $('#html').classList.remove('on');
    $('#gl').style.visibility = 'visible';
    $('#labels').style.visibility = 'visible';
    $('.hint').style.display = '';
    stage.active = true;
    stage.apply(slide.model, resolve(slide, step), fresh && false);
  } else {
    stage.active = false;
    $('#gl').style.visibility = 'hidden';
    $('#labels').style.visibility = 'hidden';
    $('.hint').style.display = 'none';
    const host = $('#html');
    host.classList.add('on');
    if (fresh) host.innerHTML = `<div class="hs"><div class="zoomable">${typeof slide.html === 'function' ? slide.html() : slide.html}</div></div>`;
    applyHtml(slide, step);
  }
  lastSlide = si;
  updateFooter();
  try { history.replaceState(null, '', `#d${si + 1}-${step + 1}`); } catch (e) {}
}

function updateFooter() {
  const slide = SLIDES[si];
  const dots = slide.steps.map((_, i) => `<b class="${i <= step ? 'on' : ''}"></b>`).join('');
  $('#count').innerHTML = `${si + 1} / ${SLIDES.length}<span class="stepdots">${slide.steps.length > 1 ? dots : ''}</span>`;
  $('#crumb').innerHTML = `${slide.sec} · <span>${slide.title.replace(/<[^>]+>/g, '')}</span>`;
  document.querySelectorAll('.prog i').forEach((el) => {
    const n = +el.dataset.i;
    el.className = n === si ? 'cur' : n < si ? 'done' : '';
  });
  document.querySelectorAll('#menu a').forEach((a) => a.classList.toggle('cur', +a.dataset.i === si));
}

function buildChrome() {
  const prog = $('.prog');
  let sec = null, box = null;
  const menu = $('#menu');
  SLIDES.forEach((s, i) => {
    if (s.sec !== sec) {
      sec = s.sec;
      box = document.createElement('div');
      box.className = 'sec';
      box.title = sec;
      prog.appendChild(box);
      menu.insertAdjacentHTML('beforeend', `<h4>${sec}</h4>`);
    }
    const d = document.createElement('i');
    d.dataset.i = i;
    d.title = s.title.replace(/<[^>]+>/g, '');
    d.onclick = () => show(i, 0);
    box.appendChild(d);
    const a = document.createElement('a');
    a.dataset.i = i;
    a.innerHTML = `${i + 1}. ${s.title.replace(/<[^>]+>/g, '')}`;
    a.onclick = () => { show(i, 0); menu.style.display = 'none'; };
    menu.appendChild(a);
  });
}

const next = () => { const s = SLIDES[si]; if (step < s.steps.length - 1) show(si, step + 1); else if (si < SLIDES.length - 1) show(si + 1, 0); };
const prev = () => { if (step > 0) show(si, step - 1); else if (si > 0) show(si - 1, SLIDES[si - 1].steps.length - 1); };

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
  else if (e.key === 'Home') show(0, 0);
  else if (e.key === 'End') show(SLIDES.length - 1, 0);
  else if (e.key.toLowerCase() === 't') toggleTest();
  else if (e.key.toLowerCase() === 'f') toggleFs();
  else if (e.key.toLowerCase() === 'i') toggleMenu();
  else if (e.key === 'Escape') $('#menu').style.display = 'none';
});
$('#next').onclick = next;
$('#prev').onclick = prev;
function toggleTest() { stage.setTest(!stage.testMode); $('#bTest').classList.toggle('on', stage.testMode); }
function toggleFs() { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen(); } catch (e) {} }
function toggleMenu() { const m = $('#menu'); m.style.display = m.style.display === 'block' ? 'none' : 'block'; }
$('#bTest').onclick = toggleTest;
$('#bFs').onclick = toggleFs;
$('#bMenu').onclick = toggleMenu;

// dica ao passar por cima de uma legenda
const tip = $('#tip');
$('#labels').addEventListener('mouseover', (e) => {
  const el = e.target.closest('.lbl');
  if (!el || !stage.model) return;
  const a = stage.model.anchors[el.dataset.id];
  if (!a || !a.desc || (stage.testMode && !stage.revealed.has(a.id))) return;
  tip.innerHTML = `<b>${a.name}</b>${a.desc}`;
  const r = el.getBoundingClientRect(), sr = $('#stage').getBoundingClientRect();
  let x = r.left - sr.left, y = r.bottom - sr.top + 6;
  x = Math.min(x, sr.width - 310);
  if (y > sr.height - 120) y = r.top - sr.top - 110;
  tip.style.left = Math.max(6, x) + 'px';
  tip.style.top = y + 'px';
  tip.style.opacity = 1;
});
$('#labels').addEventListener('mouseout', (e) => { if (e.target.closest('.lbl')) tip.style.opacity = 0; });
stage.onLabelClick = (a) => {
  if (stage.testMode && !stage.revealed.has(a.id)) { $('#info').style.display = 'none'; return; }
  const box = $('#info');
  box.innerHTML = `<b>${a.name}</b>${a.desc || ''}`;
  box.style.display = 'block';
};

buildChrome();
const m = location.hash.match(/^#d(\d+)(?:-(\d+))?/);
show(m ? +m[1] - 1 : 0, m && m[2] ? +m[2] - 1 : 0);
window.__lab = { show, stage, SLIDES, get si() { return si; }, get step() { return step; } };
