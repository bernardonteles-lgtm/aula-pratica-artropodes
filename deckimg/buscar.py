import json, os, time, urllib.request, urllib.parse
UA={'User-Agent':'DeckImagens/1.0 (github.com/bernardonteles-lgtm)'}
Q=["Biblioteca Joanina","card catalog","library stacks bookshelves","Biblioteca Nacional de Portugal","server room data center","book spines shelf","Real Gabinete Português de Leitura","Universidade de Coimbra biblioteca","microfilm archive","scientific journals bound volumes"]
os.makedirs('deckimg/out',exist_ok=True); meta=[]
def get(u):
    for a in range(5):
        try: return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read()
        except Exception as e: print('retry',e); time.sleep(5*(a+1))
for qi,q in enumerate(Q):
    u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'action':'query','format':'json','generator':'search','gsrnamespace':6,'gsrlimit':6,'gsrsearch':q+' filetype:bitmap','prop':'imageinfo','iiprop':'url|size|extmetadata','iiurlwidth':1600})
    d=json.loads(get(u))
    for k,p in enumerate(sorted(d.get('query',{}).get('pages',{}).values(),key=lambda p:p.get('index',0))):
        ii=p['imageinfo'][0]; m=ii.get('extmetadata',{})
        f=f'deckimg/out/q{qi}_{k}.jpg'
        b=get(ii.get('thumburl') or ii['url'])
        if not b: continue
        open(f,'wb').write(b); time.sleep(1)
        meta.append({'file':f,'q':q,'title':p['title'],'page':ii['descriptionurl'],'w':ii['width'],'h':ii['height'],
          'artist':m.get('Artist',{}).get('value'),'license':m.get('LicenseShortName',{}).get('value'),'desc':(m.get('ImageDescription',{}).get('value') or '')[:300]})
json.dump(meta,open('deckimg/out/meta.json','w'),ensure_ascii=False,indent=1)
