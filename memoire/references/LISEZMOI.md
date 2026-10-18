# Références de style (#enregistre)

Quand yakesh envoie « #enregistre », Claude archive ici tout ce qu'il a joint (photos, vidéos, textes) et en tire :
1. **Le fond d'abord** : ce que la personne explique (transcription de la voix, idées, méthode, conseils) dans `00_contenu-transcription.md`. C'est la priorité de yakesh (17/10/2026).
2. **Savoir le faire** : transformer la méthode en procédure, outil ou skill pour Kalo (ou Meubles & Déco), et le faire réellement quand c'est possible.
3. **Le montrer en vidéo** : une courte vidéo Remotion qui présente ce qui a été appris ou construit (`kalo/videos/`).
4. **Le style** ensuite : une fiche de style par média.
5. Finir par un résumé court dans le fil : ce qu'elle explique, ce que Claude sait maintenant faire, ce qui manque.

Transcription : `ffmpeg` vers un WAV 16 kHz mono, puis `faster-whisper` (modèle « small », français), relue avec les sous-titres incrustés.

## Rangement
```
references/
  INDEX.md                      une ligne par référence (date, entreprise, type, fiche, ce qu'on retient)
  AAAA-MM-JJ/
    01_<nom-court>.<ext>        copie du fichier envoyé (jamais modifié)
    00_contenu-transcription.md transcription + ce qui est expliqué (le fond)
    01_<nom-court>.style.md     fiche d'analyse de style
    01_<nom-court>_images/      captures clés extraites (vidéos)
    textes.md                   textes collés tels quels (posts, légendes)
```
Entreprise : `kalo`, `meubles-deco` ou `autre`, notée dans la fiche et l'index.

## Fiche de style (modèle)
- Source, entreprise, date d'envoi, ce que yakesh en a dit.
- Couleurs (hex), typo (familles, graisses, tailles relatives, casse), mise en page et cadrage.
- Vidéo : durée, format, nombre de plans et durée moyenne, rythme, mouvements de caméra, transitions, textes animés et sous-titres, musique (tempo, genre, calage sur les coupes), voix.
- Texte : ton, longueur, emojis, accroche, appel à l'action, hashtags.
- « À reprendre » : règles concrètes pour l'affiche Kalo (format validé dans `kalo/visuels/`) et la vidéo Remotion.
- « À ne pas reprendre » : ce qui contredit la charte de l'entreprise.
