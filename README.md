# Projet TIP - Backend

## Description

Backend de l'application TIP, développé avec Node.js, Express et MongoDB. Ce projet implémente un système d'authentification complet avec gestion des tokens JWT et une gestion avancée des parcs solaires.

## Structure du Projet

```
backend/
├── controllers/         # Contrôleurs par entité (auth, user, park)
├── models/
│   ├── park/            # Schémas du parc (modulaires)
│   └── user/            # Schémas utilisateur (modulaires)
│   └── blacklist.js     # Schéma pour la blacklist des tokens
├── routes/              # Routes par entité (auth, user, park)
├── middlewares/         # Middlewares (auth, validation, blacklist, erreurs)
├── services/            # Services métier (ex: gestion des tokens)
├── validators/
│   ├── park/            # Validateurs spécifiques au parc
│   ├── common/          # Validateurs communs (adresse, contact)
│   └── user.validator.js
├── tests/               # Tests unitaires et d'intégration
├── errors/              # Gestion centralisée des erreurs
├── utils/               # Fonctions utilitaires
├── index.js             # Point d'entrée
├── package.json
├── jest.config.js
└── Dockerfile
```

## Fonctionnalités

- Authentification complète (inscription, connexion, déconnexion)
- Gestion des tokens JWT (access token et refresh token)
- Validation avancée des données (via middlewares et validateurs personnalisés)
- Gestion des erreurs centralisée
- Blacklist des tokens
- Gestion CRUD des parcs solaires
- Architecture modulaire (schémas, validateurs, middlewares)
- Tests unitaires (Jest)

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB
- Docker (optionnel)

## Installation

### Installation Locale

1. Cloner le repository

```bash
git clone [URL_DU_REPO]
```

2. Installer les dépendances

```bash
cd backend
npm install
```

3. Configurer les variables d'environnement
   Créer un fichier `.env` à la racine du dossier backend avec les variables suivantes :

```
MONGODB_URI=mongodb://localhost:27017/tip
JWT_SECRET=votre_secret_jwt
JWT_REFRESH_SECRET=votre_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
```

4. Démarrer le serveur

```bash
npm start
```

### Installation avec Docker

1. Construire l'image

```bash
docker-compose build
```

2. Démarrer les conteneurs

```bash
docker-compose up
```

## API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh-token` - Rafraîchissement du token

### Utilisateurs

- `POST /api/users` - Créer un utilisateur
- `GET /api/users` - Lister tous les utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Parcs

- `POST /api/parks` - Créer un parc (protégé par authentification JWT)
- `GET /api/parks` - Lister tous les parcs
- `GET /api/parks/:id` - Détails d'un parc
- `PUT /api/parks/:id` - Modifier un parc
- `DELETE /api/parks/:id` - Supprimer un parc

## Format des Données

### Inscription

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "profil": {
    "firstName": "string",
    "lastName": "string",
    "birthDate": "date",
    "gender": "string",
    "phone": "string"
  },
  "address": {
    "address": "string",
    "addressComplement": "string",
    "city": "string",
    "zipCode": "string",
    "country": "string"
  }
}
```

### Connexion

```json
{
  "email": "string",
  "password": "string"
}
```

### Création d'un parc

**Headers :**

```
Authorization: Bearer <votre_access_token>
Content-Type: application/json
```

**Body :**

```json
{
  "name": "Parc Solaire de Test",
  "parkId": "PS-TEST-001",
  "commissioningDate": "2024-03-30T00:00:00.000Z",
  "location": {
    "address": "123 Route du Soleil",
    "zipCode": "75001",
    "city": "Paris",
    "department": "Paris",
    "region": "Île-de-France",
    "country": "France",
    "coordinates": {
      "latitude": 48.8566,
      "longitude": 2.3522,
      "altitude": 35
    }
  },
  "technical": {
    "installedPower": 10.5,
    "totalSurface": 25000,
    "panelCount": 40000,
    "panelType": "Monocristallin",
    "inverterType": "SMA",
    "panelOrientation": 180,
    "panelTilt": 30,
    "installationType": "terrestre"
  },
  "administrative": {
    "contractNumber": "CONTRACT-2024-001",
    "contractStartDate": "2024-01-01T00:00:00.000Z",
    "contractEndDate": "2034-01-01T00:00:00.000Z",
    "purchasePrice": 85.5,
    "contractType": "CRE",
    "status": "en_construction"
  },
  "maintenance": {
    "type": "préventive",
    "description": "Maintenance préventive trimestrielle des panneaux solaires",
    "startDate": "2024-04-01T09:00:00.000Z",
    "endDate": "2024-04-01T17:00:00.000Z",
    "status": "planifiée",
    "technician": "<userId>",
    "cost": 2500,
    "notes": "Vérification des connexions et nettoyage des panneaux"
  },
  "performance": {
    "date": "2024-03-30T00:00:00.000Z",
    "energyProduction": 8500,
    "efficiency": 85.5,
    "temperature": 25,
    "weatherConditions": "ensoleillé",
    "notes": "Production optimale grâce aux conditions météorologiques favorables"
  },
  "address": "123 Route du Soleil",
  "city": "Paris",
  "zipCode": "75001",
  "country": "France",
  "contactPhone": "+33612345678",
  "contactEmail": "contact@parc-solaire-test.fr",
  "totalPower": 10.5,
  "installationDate": "2024-01-15T00:00:00.000Z",
  "status": "actif"
}
```

**Remarque :**

- Le champ `technician` doit contenir un ID utilisateur valide (ObjectId MongoDB)
- Les champs `createdBy` et `lastModifiedBy` sont automatiquement remplis à partir du token JWT

## Middlewares

- **auth.middleware.js** : vérifie et décode le token JWT, ajoute l'utilisateur à `req.user`
- **validation.middleware.js** : valide les données d'entrée selon les schémas
- **blacklist.middleware.js** : gère la blacklist des tokens
- **error.middleware.js** : gestion centralisée des erreurs

## Services

- **token.service.js** : génération, vérification et gestion des tokens JWT

## Tests

- Les tests sont situés dans le dossier `tests/` et utilisent Jest
- Pour lancer les tests :

```bash
npm test
```

## Sécurité

- Hachage des mots de passe avec bcrypt
- Tokens JWT pour l'authentification
- Blacklist des tokens invalides
- Validation des données d'entrée

## Développement

- Utilisation de ES Modules
- Architecture MVC modulaire
- Gestion des erreurs centralisée
- Logging des erreurs

## Améliorations Futures

- [ ] Documentation API avec Swagger
- [ ] Système de logging structuré
- [ ] Rate limiting
- [ ] Gestion des rôles utilisateurs avancée
- [ ] Plus de tests unitaires et d'intégration

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

[À DÉFINIR]
