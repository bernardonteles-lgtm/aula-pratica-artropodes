import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const r = await build({ entryPoints: ['src/main.js'], bundle: true, minify: !process.env.DEV, format: 'iife', write: false, target: 'es2020', legalComments: 'none' });
const js = r.outputFiles[0].text;
const css = readFileSync('src/style.css', 'utf8');
const html = `<!DOCTYPE html>
<html lang="pt-PT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Filo Arthropoda — Laboratório interativo</title>
<meta name="description" content="Aula prática interativa sobre o Filo Arthropoda: filogenia, Merostomata, Arachnida, Crustacea e Insecta com modelos 3D dissecáveis.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Kalam:wght@400;700&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
<div id="app">
  <header>
    <div class="brand"><b>Filo Arthropoda</b> · laboratório</div>
    <div class="crumb" id="crumb"></div>
    <div class="tools">
      <button id="bMenu" title="Índice (I)">Índice</button>
      <button id="bTest" title="Esconder nomes para testar (T)">Modo teste</button>
      <button id="bFs" title="Ecrã inteiro (F)">⛶</button>
    </div>
  </header>
  <main>
    <section id="stage">
      <div id="gl"></div>
      <div id="html"></div>
      <div id="labels"></div>
      <div class="hint">arrastar: rodar · roda: zoom · botão direito: deslocar · duplo clique: repor vista · passar sobre um nome: descrição</div>
      <div id="tip"></div>
    </section>
    <aside id="panel">
      <div class="kicker" id="kicker"></div>
      <h1 id="title"></h1>
      <div class="sub" id="sub"></div>
      <div class="notes" id="notes"></div>
      <div class="legend" id="legend"></div>
      <div class="info" id="info"></div>
    </aside>
  </main>
  <footer>
    <button class="nav" id="prev" title="Anterior (←)">←</button>
    <div class="prog"></div>
    <span class="count" id="count"></span>
    <button class="nav" id="next" title="Seguinte (→ ou espaço)">→</button>
  </footer>
  <div id="menu"></div>
</div>
<script>${js.replace(/<\/script/g, '<\\/script')}</script>
</body>
</html>
`;
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', html);
console.log('ok', (html.length / 1024).toFixed(0) + ' KB');
