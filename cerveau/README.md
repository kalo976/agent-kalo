# Cerveau Kalo (coffre Obsidian)

Mémoire commune des agents com Kalo, reprise de la méthode vue dans les vidéos de référence du 17/10/2026 : un coffre Obsidian au centre, tous les agents branchés dessus, et la règle « avant d'écrire une seule ligne, l'agent lit le cerveau ». Un gardien (`kalo-cerveau`) le tient à jour.

- Le coffre vit dans `/mnt/project-files/kalo/cerveau/` (ouvrir ce dossier dans Obsidian, vue Graphe).
- `construire.py` le reconstruit à partir des fichiers du projet (fiche marque, catalogue kalo.yt, packshots, journal de l'équipe, références #enregistre, agents) : `python3 cerveau/construire.py`.
- Le catalogue ne contient que les prix publics du site, jamais de stock.

## La ville (prénoms et pôles)
- `construire_ville.py` produit `ville.html` à partir de `ville_modele.html` : la mairie au centre (le cerveau, tenu par David, le maire), un bâtiment de bureaux avec une pièce par pôle, et une maison par agent sur la rue du Lagon et la rue des Ylangs. Quand un agent reçoit une tâche, il part de chez lui au bureau, puis rentre. Fiche de chaque agent et bouton « Parle à … ». Il reconstruit aussi le cerveau.
- Le catalogue vient du relevé kalo.yt le plus récent (`kalo/fiches/liens-produits-kalo-yt_*.xlsx`), prix publics seulement.
- Prénoms et pôles : table `PRENOMS` dans `construire.py` (et section « Qui je suis » de chaque skill, qui parle encore d'îles : la page les traduit en pôles).
- Page publiée : https://claude.ai/artifact/Y1oSpU6Lt4Xv5V3LCdThxj
