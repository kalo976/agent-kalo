"""Construit la page « Ville Kalo » (cerveau/ville.html) : prénoms, pôles et consignes des agents,
fiche marque et catalogue kalo.yt intégrés pour le bouton « Parle à … »."""
import glob, json, os, re, openpyxl
ICI = os.path.dirname(os.path.abspath(__file__))
SK = os.path.join(ICI, "..", ".claude", "skills")
P = "/mnt/project-files"
# L'import reconstruit aussi le cerveau, et partage sa table des prénoms et des lectures
from construire import PRENOMS  # noqa: E402
COURT = {
    "kalo-cerveau": "Le maire : tient le cerveau, range et relie tout.",
    "kalo-chef-com": "Direction com : brief, répartition, contrôle final.",
    "kalo-calendrier": "Le planning du mois et les saisons de Mayotte.",
    "kalo-operations-commerciales": "Black Friday, soldes, Ramadan, fêtes.",
    "kalo-marque": "La voix de Kalo et les règles légales.",
    "kalo-critique": "Avocat du diable : renvoie tout ce qui n'est pas assez solide.",
    "kalo-post-facebook": "Les posts Facebook et Instagram.",
    "kalo-whatsapp-sms": "Les statuts WhatsApp et les SMS.",
    "kalo-fiches-produits": "Les fiches du site kalo.yt.",
    "kalo-visuel-produit": "Les affiches au format validé.",
    "kalo-video-courte": "Les Reels, TikTok et vidéos Remotion.",
    "kalo-community-manager": "Les réponses aux commentaires et messages.",
    "kalo-avis-clients": "Les avis Google et Facebook.",
    "kalo-statistiques": "Les bilans de performance.",
    "kalo-veille-concurrence": "Les prix et promos des concurrents.",
    "kalo-challenger-affiches": "Challenge les affiches de Sahel.",
    "kalo-challenger-videos": "Challenge les vidéos de Kamil.",
    "kalo-challenger-posts": "Challenge les posts de Zaïna.",
    "kalo-challenger-operations": "Challenge les opérations de Zayeb.",
    "kalo-challenger-calendrier": "Challenge le calendrier de Chanisse.",
}
from construire import lit as LIT  # noqa: E402
# Les consignes parlent encore d'îles : sur la page, on parle de pôles, de bureaux et de mairie
VILLE = [
    ("au centre de l'archipel Kalo", "le maire de la ville Kalo"), ("au centre de l'archipel", "à la mairie"),
    ("de l'archipel Kalo", "de la ville Kalo"), ("où vivent les challengers", "où travaillent les challengers"),
    ("de l'île", "du pôle"), ("l'île", "le pôle"), ("île Arène", "pôle Arène"), ("si une île change", "si un pôle change"),
    ("(îles, prénoms, cerveau au centre", "(pôles, prénoms, mairie au centre"), ("## L'archipel", "## La ville"),
    ("cerveau/archipel.html", "cerveau/ville.html"), ("construire_archipel.py", "construire_ville.py"),
]
def en_ville(t):
    for vieux, neuf in VILLE:
        t = t.replace(vieux, neuf)
    return t
agents = []
for sk, (prenom, pole) in PRENOMS.items():
    texte = en_ville(open(os.path.join(SK, sk, "SKILL.md")).read())
    corps = re.sub(r"^---.*?---\s*", "", texte, flags=re.S)
    description = re.search(r"^description:\s*(.+)$", texte, re.M).group(1).strip().strip('"')
    notes = re.findall(r"\[\[([^\]]+)\]\]", LIT.get(sk, "[[00 Cerveau Kalo]]"))
    agents.append({"id": sk, "prenom": prenom, "pole": pole, "court": COURT[sk], "description": description, "lit": notes, "consignes": corps})
# Catalogue : le relevé kalo.yt le plus récent, prix publics seulement (jamais la colonne de disponibilité)
fichier = sorted(glob.glob(P + "/kalo/fiches/liens-produits-kalo-yt_*.xlsx"))[-1]
a, m, j = re.search(r"(\d{4})-(\d\d)-(\d\d)", fichier).groups()
lignes = openpyxl.load_workbook(fichier, read_only=True)["Produits kalo.yt"].iter_rows(values_only=True)
entete = list(next(lignes))
col = lambda *noms: next(entete.index(n) for n in noms if n in entete)
c_nom, c_ref, c_prix = col("Nom du produit (site)", "Nom du produit"), col("Référence"), col("Prix TTC (€)")
catalogue = []
for r in lignes:
    if r[c_nom] is None:
        continue
    prix = f"{r[c_prix]:g} €".replace(".", ",") if isinstance(r[c_prix], (int, float)) else ""
    catalogue.append(f"{r[c_nom]} | {r[c_ref] or ''} | {prix}")
# Notes du cerveau pour la vue « Le cerveau » : titre, dossier, première ligne utile et liens
CACHE = re.compile(r"interne|ne pas communiquer|stock|marge|chiffre d'affaires", re.I)
racine = P + "/kalo/cerveau/"
fichiers = sorted(glob.glob(racine + "**/*.md", recursive=True))
noms = [os.path.basename(f)[:-3] for f in fichiers]
notes = []
for f, nom in zip(fichiers, noms):
    texte = re.sub(r"^---.*?---\s*", "", open(f).read(), flags=re.S)
    titre = next((l[2:].strip() for l in texte.splitlines() if l.startswith("# ")), nom)
    extrait = ""
    for l in texte.splitlines():
        if l.startswith(("#", "|", "---")):
            continue
        l = re.sub(r"\[\[([^\]|]+)(\|[^\]]+)?\]\]", r"\1", l).strip(" -*>|#")
        if len(l) > 30 and not l.startswith(("Source", "Retour", "Île", "Pôle")) and not CACHE.search(l):
            extrait = re.sub(r"[*`]", "", l)[:150]
            break
    cibles = {c.split("|")[0] for c in re.findall(r"\[\[([^\]]+)\]\]", texte)}
    notes.append({"t": en_ville(titre.replace("🧠 ", "")), "d": os.path.dirname(f[len(racine):]) or "Accueil",
                  "x": en_ville(extrait), "l": sorted(noms.index(c) for c in cibles if c in noms and c != nom)})
donnees = json.dumps({"agents": agents, "catalogue": catalogue, "notes": notes, "releve": f"{j}/{m}/{a}"}, ensure_ascii=False)
page = open(os.path.join(ICI, "ville_modele.html")).read().replace("__DATA__", donnees.replace("</", "<\\/"))
open(os.path.join(ICI, "ville.html"), "w").write(page)
print("ville.html :", len(page), "octets,", len(agents), "agents,", len(catalogue), "produits du relevé du", f"{j}/{m}/{a}")
