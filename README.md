# Filo Arthropoda — laboratório interativo

Aula prática em formato de apresentação: cada clique (→ ou espaço) faz aparecer o passo seguinte.
Começa na filogenia e passa aos organismos. Cinco modelos 3D podem ser rodados, dissecados e legendados:

- **Merostomata** — *Limulus* (vista dorsal, face ventral, brânquias foliáceas, corte sagital)
- **Arachnida** — aranha migalomorfa (morfologia externa, segmentos da pata, anatomia interna)
- **Crustacea / Malacostraca** — lagostim (externa, os 19 pares de apêndices, corte sagital e transversal, ciclo de vida)
- **Crustacea / Branchiopoda** — *Daphnia* (transparente; partenogénese e efípio)
- **Insecta** — gafanhoto (externa, peças bucais, patas e asas, sistemas internos, metamorfose)

Os restantes grupos (picnogónidos, escorpiões, opiliões, ácaros, classes de crustáceos, miriápodes…) aparecem como desenhos.

## Utilização
- **→ / espaço / PageDown**: avançar · **← / PageUp**: recuar (funciona com comando de apresentações)
- **Arrastar**: rodar · **roda**: zoom · **duplo clique**: repor vista
- **Passar o rato sobre um nome**: descrição; **clicar**: fixa a descrição no painel
- **T** — *Modo teste*: esconde os nomes (clicar para revelar) · **I** — índice · **F** — ecrã inteiro
- Link direto para um diapositivo: `…/index.html#d12-3` (diapositivo 12, passo 3)

## Publicar no GitHub Pages
1. Criar um repositório público `aula-pratica-artropodes` e enviar estes ficheiros (o `index.html` já está compilado).
2. *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`*.
3. O site fica em `https://<utilizador>.github.io/aula-pratica-artropodes/`.

## Editar
O conteúdo está em `src/` (`slides.js` = guião e textos; `models/` = modelos 3D; `art.js` = desenhos).
```
npm install
npm run build     # gera index.html (tudo num só ficheiro)
```

## Fontes científicas
Conteúdo baseado na aula teórica (figuras de Hickman et al., *Integrated Principles of Zoology*), com notas de filogenia atual
(Ecdysozoa; Pancrustacea; Mandibulata — Regier et al. 2010, *Nature* 463:1079; posição de Xiphosura — Ballesteros et al. 2022, *Mol. Biol. Evol.* 39: msac021).
Os modelos são esquemáticos: as posições relativas dos órgãos seguem os esquemas do manual, mas formas e proporções estão simplificadas.

Biblioteca 3D: [three.js](https://threejs.org) (MIT).
