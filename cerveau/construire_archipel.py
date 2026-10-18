"""Construit la page « Archipel Kalo » (cerveau/archipel.html) : prénoms, îles et consignes des agents,
fiche marque et catalogue kalo.yt intégrés pour le bouton « Parle à … »."""
import glob, json, os, re, openpyxl
ICI = os.path.dirname(os.path.abspath(__file__))
SK = os.path.join(ICI, "..", ".claude", "skills")
P = "/mnt/project-files"
# L'import reconstruit aussi le cerveau, et partage sa table des prénoms et des lectures
from construire import PRENOMS  # noqa: E402
COURT = {
    "kalo-cerveau": "Tient le cerveau : range et relie tout.",
    "kalo-chef-com": "Direction com : brief, répartition, contrôle final.",
    "kalo-calendrier": "Le planning du mois et les saisons de Mayotte.",
    "kalo-operations-commerciales": "Black Friday, soldes, Ramadan, fêtes.",
    "kalo-marque": "La voix de Kalo et les règles légales.",
    "kalo-post-facebook": "Les posts Facebook et Instagram.",
    "kalo-whatsapp-sms": "Les statuts WhatsApp et les SMS.",
    "kalo-fiches-produits": "Les fiches du site kalo.yt.",
    "kalo-visuel-produit": "Les affiches au format validé.",
    "kalo-video-courte": "Les Reels, TikTok et vidéos Remotion.",
    "kalo-community-manager": "Les réponses aux commentaires et messages.",
    "kalo-avis-clients": "Les avis Google et Facebook.",
    "kalo-statistiques": "Les bilans de performance.",
    "kalo-veille-concurrence": "Les prix et promos des concurrents.",
}
from construire import lit as LIT  # noqa: E402
agents = []
for sk, (prenom, ile) in PRENOMS.items():
    texte = open(os.path.join(SK, sk, "SKILL.md")).read()
    corps = re.sub(r"^---.*?---\s*", "", texte, flags=re.S)
    description = re.search(r"^description:\s*(.+)$", texte, re.M).group(1).strip().strip('"')
    notes = re.findall(r"\[\[([^\]]+)\]\]", LIT.get(sk, "[[00 Cerveau Kalo]]"))
    agents.append({"id": sk, "prenom": prenom, "ile": ile, "court": COURT[sk], "description": description, "lit": notes, "consignes": corps})
wb = openpyxl.load_workbook(P + "/kalo/fiches/liens-produits-kalo-yt_2026-10-16.xlsx", read_only=True)
catalogue = []
for r in list(wb["Produits kalo.yt"].iter_rows(values_only=True))[1:]:
    if r[0] is None:
        continue
    prix = f"{r[5]:g} €".replace(".", ",") if isinstance(r[5], (int, float)) else ""
    catalogue.append(f"{r[1]} | {r[4] or ''} | {prix}")
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
        if len(l) > 30 and not l.startswith(("Source", "Retour", "Île")) and not CACHE.search(l):
            extrait = re.sub(r"[*`]", "", l)[:150]
            break
    cibles = {c.split("|")[0] for c in re.findall(r"\[\[([^\]]+)\]\]", texte)}
    notes.append({"t": titre.replace("🧠 ", ""), "d": os.path.dirname(f[len(racine):]) or "Accueil",
                  "x": extrait, "l": sorted(noms.index(c) for c in cibles if c in noms and c != nom)})
donnees = json.dumps({"agents": agents, "catalogue": catalogue, "notes": notes}, ensure_ascii=False)
page = open(os.path.join(ICI, "archipel_modele.html")).read().replace("__DATA__", donnees.replace("</", "<\\/"))
open(os.path.join(ICI, "archipel.html"), "w").write(page)
print("archipel.html :", len(page), "octets,", len(agents), "agents")
