"""Construit la page « Archipel Kalo » (cerveau/archipel.html) : prénoms, îles et consignes des agents,
fiche marque et catalogue kalo.yt intégrés pour le bouton « Parle à … »."""
import glob, json, os, re, openpyxl
ICI = os.path.dirname(os.path.abspath(__file__))
SK = os.path.join(ICI, "..", ".claude", "skills")
P = "/mnt/project-files"
# L'import reconstruit aussi le cerveau, et partage sa table des prénoms et des lectures
from construire import PRENOMS  # noqa: E402
COURT = {
    "kalo-cerveau": "Le gardien du cerveau : il range et relie tout.",
    "kalo-chef-com": "La directrice com : brief, répartition, contrôle final.",
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
    corps = re.sub(r"^---.*?---\s*", "", open(os.path.join(SK, sk, "SKILL.md")).read(), flags=re.S)
    notes = re.findall(r"\[\[([^\]]+)\]\]", LIT.get(sk, "[[00 Cerveau Kalo]]"))
    agents.append({"id": sk, "prenom": prenom, "ile": ile, "court": COURT[sk], "lit": notes, "consignes": corps})
wb = openpyxl.load_workbook(P + "/kalo/fiches/liens-produits-kalo-yt_2026-10-16.xlsx", read_only=True)
catalogue = []
for r in list(wb["Produits kalo.yt"].iter_rows(values_only=True))[1:]:
    if r[0] is None:
        continue
    prix = f"{r[5]:g} €".replace(".", ",") if isinstance(r[5], (int, float)) else ""
    catalogue.append(f"{r[1]} | {r[4] or ''} | {prix}")
notes = sorted(glob.glob(P + "/kalo/cerveau/**/*.md", recursive=True))
donnees = json.dumps({"agents": agents, "catalogue": catalogue, "notes": [os.path.basename(n)[:-3] for n in notes]}, ensure_ascii=False)
page = open(os.path.join(ICI, "archipel_modele.html")).read().replace("__DATA__", donnees.replace("</", "<\\/"))
open(os.path.join(ICI, "archipel.html"), "w").write(page)
print("archipel.html :", len(page), "octets,", len(agents), "agents")
