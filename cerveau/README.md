# Cerveau Kalo (coffre Obsidian)

Mémoire commune des agents com Kalo, reprise de la méthode vue dans les vidéos de référence du 17/10/2026 : un coffre Obsidian au centre, tous les agents branchés dessus, et la règle « avant d'écrire une seule ligne, l'agent lit le cerveau ». Un gardien (`kalo-cerveau`) le tient à jour.

- Le coffre vit dans `/mnt/project-files/kalo/cerveau/` (ouvrir ce dossier dans Obsidian, vue Graphe).
- `construire.py` le reconstruit à partir des fichiers du projet (fiche marque, catalogue kalo.yt, packshots, journal de l'équipe, références #enregistre, agents) : `python3 cerveau/construire.py`.
- Le catalogue ne contient que les prix publics du site, jamais de stock.

## L'archipel (prénoms et îles)
- `construire_archipel.py` produit `archipel.html` (carte isométrique des 20 agents autour du cerveau, fiche de chaque agent, bouton « Parle à … ») à partir de `archipel_modele.html`. Il reconstruit aussi le cerveau.
- Prénoms et îles : table `PRENOMS` dans `construire.py` (et section « Qui je suis » de chaque skill).
- Page publiée : https://claude.ai/artifact/Y1oSpU6Lt4Xv5V3LCdThxj
