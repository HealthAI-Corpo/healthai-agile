# HealthAI - Application Monorepo

Structure monorepo contenant le backend et frontend de HealthAI.

## 📁 Structure

```
app/
├── back/                          # Microservices backend
│   ├── healthai-api/             # API Gateway
│   ├── healthai-vision/          # Service IA Vision
│   ├── healthai-workout/         # Service Workout
│   ├── init.sql/                 # Scripts d'initialisation DB
│   │   ├── 01_schema.sql
│   │   └── seed.sql
│   └── .env                      # Variables d'environnement backend
├── front/                         # Application frontend
├── docker-compose.yml            # Orchestration globale
├── .env.example                  # Template variables d'environnement
└── README.md                      # Ce fichier
```

## 🚀 Démarrage rapide

### 1. Configuration

```bash
# À la racine du projet (app/)
cp .env.example .env
# Éditer .env si nécessaire
```

### 2. Démarrage des services

```bash
# Démarrer tous les services
docker-compose up -d

# Suivre les logs
docker-compose logs -f

# Vérifier le statut
docker-compose ps
```

### 3. Accès aux services

- **API Gateway**: http://localhost:8000
- **Service Vision**: http://localhost:8001
- **Service Workout**: http://localhost:8002
- **MongoDB**: localhost:27017
- **PostgreSQL**: localhost:5432

## 📊 Services

### PostgreSQL

- **Image**: postgres:16-alpine
- **Initialisation**: Scripts SQL auto-exécutés au premier démarrage depuis `back/init.sql/`
- **Volume**: `postgres-data` (persistance)
- **Santé**: Health check intégré

### MongoDB

- **Image**: mongo:7
- **Port**: 27017
- **Volume**: `mongo-data` (persistance)

### Microservices API

- Rebuild automatique lors des modifications de code (live reload)
- Variables d'environnement via `.env` et `back/[service]/.env`

## 🔧 Commandes utiles

```bash
# Arrêter tout
docker-compose down

# Supprimer les volumes (données)
docker-compose down -v

# Rebuild d'une image spécifique
docker-compose up --build healthai-api

# Logs d'un service
docker-compose logs healthai-api -f

# Entrer dans un conteneur
docker-compose exec postgres psql -U healthai -d healthai
docker-compose exec mongo mongosh
```

## 📝 Variables d'environnement

Voir `.env.example` pour la liste complète des variables.

### Variables critiques:

- `POSTGRES_DB`: Nom de la base de données
- `POSTGRES_USER`: Utilisateur PostgreSQL
- `POSTGRES_PASSWORD`: Mot de passe PostgreSQL
- Ports des services (`HEALTHAI_API_PORT`, `HEALTHAI_VISION_PORT`, etc.)

## 🗄️ Base de données

### Initialisation automatique

La base est initialisée au premier démarrage avec:

1. `01_schema.sql` - Création des tables et indexes
2. `02_seed.sql` - Données de test

### Connexion directe

```bash
# Depuis le conteneur
docker-compose exec postgres psql -U healthai -d healthai

# Depuis l'hôte
psql -h localhost -U healthai -d healthai
```

## 🛑 Troubleshooting

### PostgreSQL ne démarre pas

```bash
# Vérifier les logs
docker-compose logs postgres

# Nettoyer et recommencer
docker-compose down -v
docker-compose up postgres
```

### Port déjà utilisé

Modifier le port dans `.env`:

```env
POSTGRES_PORT=5433  # au lieu de 5432
MONGO_PORT=27018    # au lieu de 27017
```

### Les microservices ne se connectent pas à la DB

Vérifier que PostgreSQL est "healthy":

```bash
docker-compose ps  # Vérifier status "healthy"
```

## 📦 Frontend

Pour activer le frontend, décommenter la section `healthai-front` dans `docker-compose.yml`:

```yaml
healthai-front:
    build: ./front
    container_name: healthai-front
    ports:
        - "${FRONT_PORT:-3000}:3000"
```
