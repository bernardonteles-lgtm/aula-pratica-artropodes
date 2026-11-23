# Procura e descarrega fotografias com licença livre no Wikimedia Commons.
# Corre no GitHub Actions. Para cada entrada de lista.json usa "file" (nome exato do ficheiro) ou "q" (pesquisa).
import json, re, os, urllib.request, urllib.error, urllib.parse, html, time

UA = {'User-Agent': 'aula-pratica-artropodes/1.0 (educational project)'}
API = 'https://commons.wikimedia.org/w/api.php'
OK = re.compile(r'^(CC0|Public domain|PD|CC BY(-SA)? ?[0-9.]*|CC-BY(-SA)?-[0-9.]+)', re.I)


def fetch(url, tries=5):
    for k in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code == 429 and k < tries - 1:
                time.sleep(15 * (k + 1))
                continue
            raise


def get(params):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json'})
    return json.loads(fetch(url))


BAD = re.compile(r'tattoo|collage|drawing|illustration|diagram|morpholog|\bmap\b|stamp|plate|haeckel|tagged|sketch|logo', re.I)


def clean(s):
    return html.unescape(re.sub('<[^>]+>', '', s or '')).strip()


def info(pages):
    out = []
    for p in pages:
        ii = (p.get('imageinfo') or [{}])[0]
        md = ii.get('extmetadata', {})
        out.append({
            'title': p.get('title'), 'thumb': ii.get('thumburl'), 'w': ii.get('width', 0), 'mime': ii.get('mime', ''),
            'license': clean(md.get('LicenseShortName', {}).get('value', '')),
            'artist': clean(md.get('Artist', {}).get('value', ''))[:120],
            'source': ii.get('descriptionurl'),
            'desc': clean(md.get('ImageDescription', {}).get('value', ''))[:200],
            'idx': p.get('index', 0),
        })
    return sorted(out, key=lambda x: x['idx'])


lista = json.load(open('fotos/lista.json'))
cred = json.load(open('fotos/creditos.json')) if os.path.exists('fotos/creditos.json') else {}
cand = json.load(open('fotos/candidatos.json')) if os.path.exists('fotos/candidatos.json') else {}
base = {'action': 'query', 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size|mime', 'iiurlwidth': 960}
for it in lista:
    if it['id'] in cred and os.path.exists(f"fotos/{it['id']}.jpg") and not it.get('refresh'):
        continue
    try:
        if it.get('file'):
            r = get({**base, 'titles': 'File:' + it['file']})
        else:
            r = get({**base, 'generator': 'search', 'gsrsearch': it['q'] + ' filetype:bitmap', 'gsrnamespace': 6, 'gsrlimit': 12})
        lst = info(list(r.get('query', {}).get('pages', {}).values()))
        good = [x for x in lst if not BAD.search(x['title'] or '') and OK.match(x['license']) and 'NC' not in x['license'].upper() and 'ND' not in x['license'].upper()
                and x['mime'] in ('image/jpeg', 'image/png') and (x['w'] >= 500 or it.get('file')) and x['thumb']]
        cand[it['id']] = [{k: x[k] for k in ('title', 'license', 'artist', 'desc')} for x in good[:8]]
        n = it.get('n', 0)
        pick = good[n] if len(good) > n else None
        if pick:
            data = fetch(pick['thumb'])
            open(f"fotos/{it['id']}.jpg", 'wb').write(data)
            cred[it['id']] = {k: pick[k] for k in ('title', 'license', 'artist', 'source')}
        time.sleep(4)
    except Exception as e:
        cand[it['id']] = [{'erro': str(e)}]

json.dump(cred, open('fotos/creditos.json', 'w'), ensure_ascii=False, indent=1)
json.dump(cand, open('fotos/candidatos.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps(cred, ensure_ascii=False, indent=1))
