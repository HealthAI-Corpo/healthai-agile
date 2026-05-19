# Conventions de Travail - healthai-workout

## 1. Gestion des Branches

| Branche | Rôle |
|---------|------|
| `main` | Production — code stable, jamais poussé directement |
| `develop` | Intégration — les tests doivent passer à 100 % |
| `feat/us-[ID]-[slug]` | Une User Story, une branche (ex: `feat/us-1-auth`) |
| `fix/[slug]` | Correction de bug urgent |

**Règles d'or**
- Zéro push direct sur `main` ou `develop`.
- Squash and Merge uniquement — historique propre.
- Supprimer la branche distante après fusion.
- Une branche = un seul sujet.

## 2. Commits (Conventional Commits)

```
<type>(<scope optionnel>): <description courte>
```

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation uniquement |
| `test` | Ajout ou modification de tests |
| `chore` | Maintenance, dépendances, outils |
| `refactor` | Refacto sans changement de comportement |

## 3. Workflow de Développement

1. Créer la branche depuis `develop` : `git checkout -b feat/us-X-slug develop`
2. Lier la branche à l'Issue GitHub correspondante dans la description de la PR.
3. Développer, tester localement (`uv run pytest`), linter (`uv run ruff check .`).
4. Ouvrir une PR vers `develop` avec le template fourni.
5. Validation PO obligatoire avant fusion.

## 4. Definition of Done (DoD)

Une US est **Done** quand :
- [ ] Le code respecte les conventions (ruff propre, pas de warning).
- [ ] Les tests unitaires couvrent le cas nominal et les cas d'erreur.
- [ ] La PR est liée à l'Issue GitHub.
- [ ] Le PO a validé les critères d'acceptation sur la branche de feature.
- [ ] La branche est fusionnée via Squash and Merge dans `develop`.

## 5. Estimation (Story Points — échelle de Fibonacci)

| Points | Complexité |
|--------|-----------|
| 1 | Trivial — moins d'une heure |
| 2 | Simple — demi-journée |
| 3 | Modéré — une journée |
| 5 | Complexe — deux à trois jours |
| 8 | Très complexe — à découper |

## 6. Labels GitHub

| Label | Usage |
|-------|-------|
| `user-story` | Issue de type US |
| `bug` | Anomalie |
| `sprint-1` / `sprint-2` / `sprint-3` | Sprint d'appartenance |
| `priorite-1` / `priorite-2` / `priorite-3` | Priorité MoSCoW |
| `blocked` | Bloquée par une dépendance |
