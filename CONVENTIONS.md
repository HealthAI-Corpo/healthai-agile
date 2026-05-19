# Conventions de Travail - healthai-workout

## 1. Gestion des Branches (Cadre Strict)
- **main** : Branche de production, code stable uniquement.
- **develop** : Branche d'integration. Les tests doivent passer a 100%.
- **feat/us-[ID]-[description]** : Branche dediee a une User Story (ex: `feat/us-1-auth`).
- **fix/[description]** : Correction de bug urgent.

### Regles d'Or
- **Zera direct push** : Interdiction de pousser du code directement sur `main` ou `develop`.
- **Une branche = Une US** : On ne traite qu'un seul sujet a la fois par branche.
- **Clean History** : On privilegie le "Squash and Merge" pour garder un historique propre.
- **Suppression post-merge** : Toute branche fusionnee doit etre supprimee du serveur.

## 2. Commits (Conventional Commits)
- `feat:` : Nouvelle fonctionnalite.
- `fix:` : Correction de bug.
- `docs:` : Documentation.
- `chore:` : Maintenance / Outils.

## 3. Workflow de Developpement
1. Creer une branche depuis `develop`.
2. Lier la branche a l'Issue GitHub correspondante.
3. Developper et tester localement.
4. Ouvrir une PR vers `develop`.
5. Validation par le PO obligatoire avant fusion.
