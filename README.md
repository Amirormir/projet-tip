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
