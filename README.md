# Projet TIP - Backend

## Description

Backend de l'application TIP, développé avec Node.js, Express et MongoDB. Ce projet implémente un système d'authentification complet avec gestion des tokens JWT.

## Structure du Projet

```
backend/
├── controllers/     # Contrôleurs de l'application
├── models/         # Schémas Mongoose
├── routes/         # Routes de l'API
├── services/       # Services métier
├── errors/         # Messages d'erreur centralisés
├── utils/          # Utilitaires
└── index.js        # Point d'entrée de l'application
```

## Fonctionnalités

- Authentification complète (inscription, connexion, déconnexion)
- Gestion des tokens JWT (access token et refresh token)
- Validation des données
- Gestion des erreurs centralisée
- Blacklist des tokens

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

## Sécurité

- Hachage des mots de passe avec bcrypt
- Tokens JWT pour l'authentification
- Blacklist des tokens invalides
- Validation des données d'entrée

## Développement

- Utilisation de ES Modules
- Architecture MVC
- Gestion des erreurs centralisée
- Logging des erreurs

## Améliorations Futures

- [ ] Implémentation des middlewares de validation
- [ ] Ajout de tests unitaires
- [ ] Documentation API avec Swagger
- [ ] Système de logging structuré
- [ ] Rate limiting
- [ ] Gestion des rôles utilisateurs

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

[À DÉFINIR]

## Gestion des Parcs

### Endpoints Parcs

- `POST /api/parks` - Créer un parc (protégé par authentification JWT)
- `GET /api/parks` - Lister tous les parcs
- `GET /api/parks/:id` - Détails d'un parc
- `PUT /api/parks/:id` - Modifier un parc
- `DELETE /api/parks/:id` - Supprimer un parc

### Exemple de création de parc

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

## Utilisation du token JWT

Pour toutes les routes protégées, ajoutez dans les headers :

```
Authorization: Bearer <votre_access_token>
```
