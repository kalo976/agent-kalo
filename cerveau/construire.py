"""Construit le coffre Obsidian « cerveau Kalo » à partir des fichiers du projet."""
import os, re, glob, openpyxl, collections
P="/mnt/project-files"; V=P+"/kalo/cerveau"; SK=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".claude", "skills")
def w(rel, txt):
    f=os.path.join(V,rel); os.makedirs(os.path.dirname(f),exist_ok=True); open(f,"w").write(txt.strip()+"\n")
def body(path):
    t=open(path).read()
    return re.sub(r"^---.*?---\s*","",t,flags=re.S)
def front(path):
    m=re.search(r"description:\s*(.*)",open(path).read()); return m.group(1).strip().strip('"') if m else ""

# Marque
w("Marque/Identité Kalo.md","---\ntags: [marque]\n---\n"+body(SK+"/kalo-marque/SKILL.md")+"\n\nVoir aussi [[Règles à ne jamais enfreindre]], [[Magasin Kalo]], [[Style vidéo de référence]].")
w("Marque/Règles à ne jamais enfreindre.md","""---
tags: [marque, règles]
---
# Règles à ne jamais enfreindre
- Jamais de stock, de chiffre de vente, de marge ni de donnée client dans un contenu publié (les fichiers internes en contiennent).
- Jamais un prix, une caractéristique, une classe énergie ou un avis inventé : si l'info manque, écrire [à compléter].
- Tout prix d'appareil avec étiquette énergie : classe + échelle A à G.
- Prix barré = prix le plus bas des 30 jours précédents ; dates de l'offre indiquées.
- Jamais le nom ni le logo Darty ; jamais de nom de concurrent.
- Rien n'est publié sans validation de yakesh, et aucun livrable créatif n'arrive chez Chimène sans la chaîne qualité du 22/10/2026 (superviseur, puis un seul échange avec le challenger de l'île Arène, puis Ousséni sans note par erreurs flagrantes si la mission compte 2 livrables au plus ; tribunal seulement si nécessaire). Chimène valide avec une note d'au moins 8/10. Voir [[Chaîne qualité]].
- Kalo uniquement : ne jamais mélanger avec Meubles & Déco Mayotte.
Source complète : [[Identité Kalo]].""")
w("Entreprise/Magasin Kalo.md","""---
tags: [entreprise]
---
# Magasin Kalo
- Électroménager, TV, multimédia, climatisation. 53 rue du Commerce, 97600 Mamoudzou (Mayotte).
- Site : kalo.yt · Facebook : Kalo.976 · Slogan : « La Qualité pour votre maison ».
- Services : conseil en magasin, livraison à domicile, SAV local.
- Clientèle : familles nombreuses, jeunes ménages, professionnels (snacks, épiceries, restaurants). Achat préparé sur Facebook, conclu en magasin.
- Évolution annoncée : future « bascule Darty phase 1 » (interne, ne pas communiquer).
- Calendrier Facebook : fourni chaque mois par un tiers, voir [[Calendrier et temps forts]].
Liens : [[Identité Kalo]], [[Catalogue kalo.yt]], [[Équipe d'agents]].""")

# Produits
wb=openpyxl.load_workbook(P+"/kalo/fiches/liens-produits-kalo-yt_2026-10-16.xlsx",read_only=True)
rows=list(wb["Produits kalo.yt"].iter_rows(values_only=True))[1:]
cats=collections.defaultdict(list)
for r in rows:
    if r[0] is None: continue
    cats[r[2] or "Autres"].append(r)
idx=["---\ntags: [produits]\n---\n# Catalogue kalo.yt (relevé du 16/10/2026)\n","Prix TTC publics du site. Pas de stock ici (règle : [[Règles à ne jamais enfreindre]]). Packshots : [[Packshots]].\n"]
for c,lst in sorted(cats.items()):
    n=c.replace("/","-"); idx.append(f"- [[{n}]] : {len(lst)} produits")
    t=[f"---\ntags: [produits]\n---\n# {c}\n","Retour : [[Catalogue kalo.yt]]\n","| Produit | Réf. | Prix TTC | Fiche |","|---|---|---|---|"]
    for r in lst:
        prix=f"{r[5]:g} €".replace(".",",") if isinstance(r[5],(int,float)) else (r[5] or "")
        t.append(f"| {r[1]} | {r[4] or ''} | {prix} | {r[6] or ''} |")
    w(f"Produits/{n}.md","\n".join(t))
w("Produits/Catalogue kalo.yt.md","\n".join(idx))
w("Produits/Packshots.md","---\ntags: [produits, visuels]\n---\nDossier des images : `kalo/packshots/` et `kalo/visuels/packshots/`.\n\n"+open(P+"/kalo/packshots/RECAPITULATIF.md").read())

# Contenus déjà produits (journal)
jl=["---\ntags: [contenus]\n---\n# Contenus produits par l'équipe\n","Chaque nouveau contenu validé ajoute une note ici (David s'en charge).\n"]
for f in sorted(glob.glob(P+"/kalo/journal/*/*.md")):
    day=f.split("/")[-2]; name=os.path.basename(f)[:-3]
    title=f"{day} {name}"
    w(f"Contenus/{title}.md",f"---\ntags: [contenus]\ndate: {day}\n---\nSource : `{f.replace(P+'/','')}`\n\n"+open(f).read())
    jl.append(f"- [[{title}]]")
w("Contenus/Index des contenus.md","\n".join(jl)+"\n\nIdées en attente : `kalo/journal/idees.md`.")
w("Calendrier/Calendrier et temps forts.md","""---
tags: [calendrier]
---
# Calendrier et temps forts
- Le calendrier mensuel des posts est fourni par un tiers : on ne le crée pas nous-mêmes.
- Rythme Facebook : lundi 12 h, mercredi 18 h 30, vendredi 17 h 30.
- Temps forts : voir [[2026-10-17 calendrier_temps-forts-novembre-2026]] et [[2026-10-17 operations-commerciales_black-friday-2026]].
- Saisons de Mayotte : voir [[Identité Kalo]].""")
w("Clients/Questions et réponses clients.md","""---
tags: [clients]
---
# Questions et réponses clients
Réponses types validées ou à valider : [[2026-10-17 community-manager_reponses-types-P05-P07]], [[2026-10-17 avis-clients_modeles-reponses]].
À compléter par David avec chaque nouvelle question fréquente (horaires, zones de livraison, SAV, paiement). Aucune donnée personnelle de client ici.""")

# Références de style
for f in sorted(glob.glob(P+"/references/*/00_*.md")):
    day=f.split("/")[-2]; name=os.path.basename(f)[3:-3]
    w(f"Références/{day} {name}.md",f"---\ntags: [références]\n---\nSource : `{f.replace(P+'/','')}`\n\n"+open(f).read())
refs=[os.path.basename(x)[:-3] for x in glob.glob(V+"/Références/*.md") if "Style vidéo" not in x]
w("Références/Style vidéo de référence.md","---\ntags: [références]\n---\n# Références (#enregistre)\nIndex complet : `references/INDEX.md`.\n\n"+"\n".join(f"- [[{r}]]" for r in sorted(refs)))

# Agents : prénom et île de chaque agent (archipel Kalo)
PRENOMS={"kalo-cerveau":("David","Centre"),"kalo-chef-com":("Chimène","Pilotage"),"kalo-calendrier":("Chanisse","Pilotage"),"kalo-operations-commerciales":("Zayeb","Pilotage"),
"kalo-marque":("Gamil","Marque"),"kalo-critique":("Ousséni","Marque"),"kalo-post-facebook":("Zaïna","Écriture"),"kalo-whatsapp-sms":("Anli","Écriture"),"kalo-fiches-produits":("Thomas","Écriture"),
"kalo-visuel-produit":("Sahel","Création"),"kalo-video-courte":("Kamil","Création"),"kalo-community-manager":("Charza","Clients"),"kalo-avis-clients":("Nasser","Clients"),
"kalo-statistiques":("Nahim","Analyse"),"kalo-veille-concurrence":("Chloé","Analyse"),
"kalo-challenger-affiches":("Roukia","Arène"),"kalo-challenger-videos":("Bacar","Arène"),"kalo-challenger-posts":("Faïza","Arène"),
"kalo-challenger-operations":("Fahardine","Arène"),"kalo-challenger-calendrier":("Mariama","Arène")}
ag=["---\ntags: [agents]\n---\n# Équipe d'agents Kalo\n","Tous les agents sont branchés sur ce cerveau : **avant d'écrire une seule ligne, ils lisent [[00 Cerveau Kalo]] puis les notes liées à leur métier.** David ([[kalo-cerveau]]) tient le cerveau.\n","| Prénom | Île | Agent | Métier | Lit d'abord |","|---|---|---|---|---|"]
lit={"kalo-marque":"[[Identité Kalo]]","kalo-calendrier":"[[Calendrier et temps forts]]","kalo-operations-commerciales":"[[Calendrier et temps forts]], [[Catalogue kalo.yt]]",
"kalo-post-facebook":"[[Identité Kalo]], [[Index des contenus]], [[Catalogue kalo.yt]]","kalo-visuel-produit":"[[Packshots]], [[Style vidéo de référence]]","kalo-video-courte":"[[Style vidéo de référence]], [[Packshots]]",
"kalo-whatsapp-sms":"[[Index des contenus]]","kalo-community-manager":"[[Questions et réponses clients]], [[Magasin Kalo]]","kalo-avis-clients":"[[Questions et réponses clients]]",
"kalo-fiches-produits":"[[Catalogue kalo.yt]], [[Packshots]]","kalo-statistiques":"[[Index des contenus]]","kalo-veille-concurrence":"[[Catalogue kalo.yt]]","kalo-chef-com":"[[00 Cerveau Kalo]] en entier","kalo-critique":"[[Identité Kalo]], la note de l'agent relu"}
# chaque challenger lit les mêmes notes que le créatif qu'il affronte
for ch,cr in {"kalo-challenger-affiches":"kalo-visuel-produit","kalo-challenger-videos":"kalo-video-courte","kalo-challenger-posts":"kalo-post-facebook",
              "kalo-challenger-operations":"kalo-operations-commerciales","kalo-challenger-calendrier":"kalo-calendrier"}.items():
    lit[ch]=lit[cr]+f", [[{cr}]]"
for d in sorted(glob.glob(SK+"/kalo-*")):
    n=os.path.basename(d); desc=front(d+"/SKILL.md"); p,ile=PRENOMS.get(n,("?","?"))
    if n=="kalo-cerveau": continue
    ag.append(f"| {p} | {ile} | [[{n}]] | {desc[:110]}… | {lit.get(n,'[[Identité Kalo]]')} |")
    w(f"Agents/{n}.md",f"---\ntags: [agents]\nprenom: {p}\nile: {ile}\n---\n# {p} ({n})\nÎle : {ile}\n\n{desc}\n\n**Avant chaque tâche, lire :** {lit.get(n,'[[Identité Kalo]]')} et [[Règles à ne jamais enfreindre]].\n\nRetour : [[Équipe d'agents]]")
w("Agents/kalo-cerveau.md","""---
tags: [agents]
prenom: David
ile: Centre
---
# David (kalo-cerveau), au centre
Tient ce coffre à jour. Après chaque livrable validé, chaque #enregistre, chaque nouveau fichier de yakesh : crée ou met à jour la note, la relie ([[...]]) aux notes voisines et met à jour [[00 Cerveau Kalo]].
Retire ce qui est faux ou périmé (avec la date), et ne range jamais de stock, de vente ni de donnée client.
Retour : [[Équipe d'agents]]""")
w("Agents/Équipe d'agents.md","\n".join(ag))

w("00 Cerveau Kalo.md","""---
tags: [accueil]
---
# 🧠 Cerveau Kalo
La mémoire commune de toute l'équipe com Kalo (coffre Obsidian : ouvrir le dossier `kalo/cerveau/` dans Obsidian puis la vue Graphe).

**Règle d'or : avant d'écrire une seule ligne, chaque agent lit cette note puis les notes de son métier.** David ([[kalo-cerveau]]) la tient à jour.

## Les îles
- **Marque** : [[Identité Kalo]] · [[Règles à ne jamais enfreindre]]
- **Entreprise** : [[Magasin Kalo]]
- **Produits** : [[Catalogue kalo.yt]] · [[Packshots]]
- **Contenus** : [[Index des contenus]]
- **Calendrier** : [[Calendrier et temps forts]]
- **Clients** : [[Questions et réponses clients]]
- **Références de style** : [[Style vidéo de référence]]
- **Équipe** : [[Équipe d'agents]]

## Manque encore (à fournir par yakesh)
- Les anciens posts Facebook publiés (copier-coller) pour que les agents connaissent ce qui a déjà été dit.
- Les statistiques de la page, les horaires du magasin, les zones de livraison, le lien de la fiche Google.
""")
print(sum(len(f) for _,_,f in os.walk(V)),"notes")
