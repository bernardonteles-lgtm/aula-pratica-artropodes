# Fotografias com licença livre do Wikimedia Commons (corre no GitHub Actions).
#  - entradas de lista.json com "file": descarrega essa imagem (960 px) e regista os créditos;
#  - entradas só com "q": descarrega até 10 candidatas pequenas (330 px) para fotos/cand/, para escolha.
import json, re, os, urllib.request, urllib.error, urllib.parse, html, time

UA = {'User-Agent': 'aula-pratica-artropodes/1.0 (educational project)'}
API = 'https://commons.wikimedia.org/w/api.php'
OK = re.compile(r'^(CC0|Public domain|PD|CC BY(-SA)? ?[0-9.]*|CC-BY(-SA)?-[0-9.]+)', re.I)
BAD = re.compile(r'tattoo|collage|drawing|illustration|diagram|morpholog|\bmap\b|stamp|plate|haeckel|tagged|sketch|logo|toy|cartoon|scheme|anatomy|chart|label', re.I)


def fetch(url, tries=6):
    for k in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code == 429 and k < tries - 1:
                time.sleep(20 * (k + 1))
                continue
            raise


def get(params):
    return json.loads(fetch(API + '?' + urllib.parse.urlencode({**params, 'format': 'json'})))


def clean(s):
    return html.unescape(re.sub('<[^>]+>', '', s or '')).strip()


def info(pages):
    out = []
    for p in pages:
        ii = (p.get('imageinfo') or [{}])[0]
        md = ii.get('extmetadata', {})
        cats = clean(md.get('Categories', {}).get('value', ''))
        out.append({
            'title': p.get('title'), 'thumb': ii.get('thumburl'), 'w': ii.get('width', 0), 'h': ii.get('height', 0), 'mime': ii.get('mime', ''),
            'license': clean(md.get('LicenseShortName', {}).get('value', '')),
            'artist': clean(md.get('Artist', {}).get('value', ''))[:120],
            'source': ii.get('descriptionurl'),
            'desc': clean(md.get('ImageDescription', {}).get('value', ''))[:240],
            'quality': bool(re.search(r'Quality images|Featured pictures|Valued images', cats)),
            'idx': p.get('index', 0),
        })
    return sorted(out, key=lambda x: x['idx'])


def usable(x):
    lic = x['license'].upper()
    return (not BAD.search(x['title'] or '') and OK.match(x['license']) and 'NC' not in lic and 'ND' not in lic
            and x['mime'] in ('image/jpeg', 'image/png') and x['w'] >= 600 and x['thumb'])


lista = json.load(open('fotos/lista.json'))
cred = json.load(open('fotos/creditos.json')) if os.path.exists('fotos/creditos.json') else {}
os.makedirs('fotos/cand', exist_ok=True)
indice = json.load(open('fotos/cand/indice.json')) if os.path.exists('fotos/cand/indice.json') else {}

INAT = 'https://api.inaturalist.org/v1/observations'
STAGE = {'ovo': 7, 'larva': 6, 'pupa': 4, 'adulto': 2}


def inat_cands(name, stage=None, n=8):
    q = {'taxon_name': name, 'quality_grade': 'research', 'photo_license': 'cc0,cc-by,cc-by-sa', 'per_page': n, 'order_by': 'votes'}
    if stage:
        q.update({'term_id': 1, 'term_value_id': STAGE[stage]})
    d = json.loads(fetch(INAT + '?' + urllib.parse.urlencode(q)))
    out = []
    for o in d.get('results', []):
        for ph in o.get('photos', [])[:1]:
            lic = (ph.get('license_code') or '').upper()
            if not lic or 'NC' in lic or 'ND' in lic:
                continue
            out.append({'title': f"iNaturalist {o['id']}: {o.get('taxon', {}).get('name', name)}", 'thumb': ph['url'].replace('square', 'medium'),
                        'big': ph['url'].replace('square', 'large'), 'license': lic.replace('CC-', 'CC ').replace('CC0', 'CC0'),
                        'artist': (ph.get('attribution') or '')[:140], 'source': o.get('uri'), 'desc': o.get('place_guess', '') or '',
                        'quality': False, 'w': 1024, 'h': 768})
    return out


for it in lista:
    tid = it['id']
    try:
        if it.get('url'):
            if tid in cred and cred[tid].get('source') == it['source'] and os.path.exists(f'fotos/{tid}.jpg'):
                continue
            open(f'fotos/{tid}.jpg', 'wb').write(fetch(it['url']))
            cred[tid] = {k: it[k] for k in ('title', 'license', 'artist', 'source')}
            time.sleep(2)
            continue
        if it.get('file'):
            if tid in cred and cred[tid]['title'] == 'File:' + it['file'] and os.path.exists(f'fotos/{tid}.jpg'):
                continue
            r = get({'action': 'query', 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size|mime', 'iiurlwidth': 960, 'titles': 'File:' + it['file']})
            x = info(list(r['query']['pages'].values()))[0]
            open(f'fotos/{tid}.jpg', 'wb').write(fetch(x['thumb']))
            cred[tid] = {k: x[k] for k in ('title', 'license', 'artist', 'source')}
            time.sleep(2)
            continue
        if tid in indice and not it.get('refresh'):
            continue
        seen, cands = set(), []
        qs = it.get('q', [])
        qs = qs if isinstance(qs, list) else [qs]
        for q in qs:
            for extra in (' incategory:"Quality_images"', ''):
                r = get({'action': 'query', 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size|mime', 'iiurlwidth': 330,
                         'generator': 'search', 'gsrsearch': q + ' filetype:bitmap' + extra, 'gsrnamespace': 6, 'gsrlimit': 15})
                for x in info(list(r.get('query', {}).get('pages', {}).values())):
                    if x['title'] not in seen and usable(x):
                        seen.add(x['title'])
                        cands.append(x)
                time.sleep(2)
        cands.sort(key=lambda x: (not x['quality'], x['idx']))
        cands = cands[:10]
        for nm in it.get('inat', []):
            cands += inat_cands(nm, it.get('stage'))
            time.sleep(2)
        for k, x in enumerate(cands):
            open(f'fotos/cand/{tid}_{k}.jpg', 'wb').write(fetch(x['thumb']))
            time.sleep(1.5)
        indice[tid] = [{kk: x.get(kk) for kk in ('title', 'license', 'artist', 'source', 'desc', 'quality', 'w', 'h', 'big')} for x in cands]
    except Exception as e:
        indice[tid + '__erro'] = str(e)

json.dump(cred, open('fotos/creditos.json', 'w'), ensure_ascii=False, indent=1)
json.dump(indice, open('fotos/cand/indice.json', 'w'), ensure_ascii=False, indent=1)
print('ok', len(cred), len(indice))
