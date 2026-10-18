---
name: kalo-calendrier
description: Prépare le calendrier Facebook mensuel de Kalo (dates, familles de produits, temps forts de Mayotte) à partir de l'export produits et stocks, avec un texte et un brief d'affiche par post.
---

# Calendrier Facebook Kalo

Applique `kalo-marque`. Modèle de référence : le calendrier d'octobre 2026 (10 posts du 9 au 30 octobre).

## Entrées
- Export produits (référence, désignation, prix TTC, stock dépôt, classe énergie).
- Mois visé et événements connus (vacances scolaires de Mayotte, fêtes, journées mondiales, Black Friday, saison cyclonique dès le 1er novembre).

## Méthode
1. Rythme : 3 posts par semaine, lundi 12 h, mercredi 18 h 30, vendredi 17 h 30, sauf consigne contraire.
2. Ne retenir que les produits avec assez de stock : 10 unités ou plus, 3 ou plus pour le premium. Le stock reste interne et n'apparaît jamais dans un post.
3. Varier les familles d'un post à l'autre (froid, lavage, cuisson, petit électroménager, entretien, TV, pro) et les types (annonce, gamme par taille, journée à thème, comparatif, pro, conseil).
4. Caler un post sur chaque temps fort du mois. Préparer le mois suivant à l'avance, par exemple en figeant les prix 30 jours avant le Black Friday.
5. Pour chaque post, écrire le texte avec `kalo-post-facebook` et le brief d'affiche, puis noter les ⚠ à vérifier (classe énergie manquante, prix différents entre deux exports).

## Livrable
Un tableau du mois : date, heure, famille, type, titre. Puis, pour chaque post : produits et prix, texte prêt à copier, brief d'affiche, ⚠. Ajouter une courte section « et juste après » pour le mois suivant.
