# Akkor Hôtel

Une plateforme complète de réservation d'hôtels construite avec TypeScript, Express, MongoDB et React.

## Fonctionnalités

- **Gestion des Utilisateurs**: Inscription, connexion, gestion du profil avec accès basé sur les rôles (utilisateur, employé, administrateur)
- **Authentification JWT**: Authentification sécurisée basée sur les jetons avec autorisation par rôle
- **Gestion des Hôtels**: Parcourir, rechercher, trier et paginer les hôtels. Opérations CRUD pour les administrateurs
- **Système de Réservation**: Créer, consulter, modifier et annuler les réservations avec règles de propriété
- **Interface Réactive**: Interface frontale React adaptée aux appareils mobiles avec design moderne
- **Documentation API**: Swagger/OpenAPI disponible à `/api-docs`
- **Tests Complets**: Suites de tests unitaires, d'intégration et E2E

## Pile Technologique

| Couche    | Technologie                                            |
| --------- | -------------------------------------------------------|
| Backend   | Express.js, TypeScript, Mongoose, JWT, Joi, Swagger    |
| Frontend  | React 18, TypeScript, Vite, React Router v6, Axios     |
| Base de données  | MongoDB                                         |
| Tests     | Jest, Supertest, Vitest, Testing Library, Cypress      |
 
## Prérequis

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** >= 6.x (en local ou URI distant)

## Installation

### Cloner le dépôt
```bash
git clone git clone https://github.com/bapti-art/akkor-hotel.git
cd akkor-hotel-final
```

### Installer toutes les dépendances (backend + frontend)
```bash
npm run install:all
```

### Installer les dépendances E2E (optionnel, pour Cypress)
```bash
cd e2e
npm install
```

### Ou installer individuellement
```bash
npm run backend:install
npm run frontend:install
```

## Configuration

Copiez le fichier d'exemple d'environnement et configurez-le:

```bash
cp backend/.env.example backend/.env
```

Variables d'environnement:

| Variable       | Description                  | Défaut                                        |
| -------------- | ---------------------------- | ----------------------------------------------|
| `PORT`         | Port du serveur backend      | `3000`                                        |
| `MONGODB_URI`  | Chaîne de connexion MongoDB  | `mongodb://localhost:27017/akkor-hotel`       |
| `JWT_SECRET`   | Clé secrète pour la signature JWT   | `akkor-hotel-secret-key`               |
| `JWT_EXPIRES_IN` | Expiration du jeton JWT    | `7d`                                          |
| `NODE_ENV`     | Mode d'environnement         | `development`                                 |

## Exécution de l'application

### Développement

### Démarrer le backend (port 3000)
```bash
npm run backend:dev
```

### Démarrer le frontend (port 5173) — dans un terminal séparé
```bash
npm run frontend:dev
```

Le frontend redirige automatiquement les requêtes API vers le backend.

### Données d'amorçage

Remplissez la base de données avec des données d'exemple :

```bash
cd backend
npm run seed
```

Cela crée:
- **Administrateur**: admin@akkor.com / Admin123!
- **Employé**: employee@akkor.com / Employee123!
- **Utilisateur**: user@akkor.com / User123!
- 5 hôtels d'exemple

## Documentation API

Dès que le backend est démarré, consultez : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Principaux endpoints API

| Méthode | Endpoint                  | Authentification | Description                            |
| ------- | ------------------------- | ---------------- | -------------------------------------- |
| POST    | `/api/auth/register`      | Aucune           | Enregistrer un nouvel utilisateur      |
| POST    | `/api/auth/login`         | Aucune           | Se connecter et obtenir un JWT         |
| GET     | `/api/users/me`           | Utilisateur      | Récupérer l'utilisateur courant        |
| GET     | `/api/users`              | Employé/Admin    | Lister tous les utilisateurs           |
| GET     | `/api/hotels`             | Aucune           | Lister les hôtels (avec pagination)    |
| POST    | `/api/hotels`             | Admin            | Créer un hôtel                         |
| PUT     | `/api/hotels/:id`         | Admin            | Mettre à jour un hôtel                 |
| DELETE  | `/api/hotels/:id`         | Admin            | Supprimer un hôtel                     |
| POST    | `/api/bookings`           | Utilisateur      | Créer une réservation                  |
| GET     | `/api/bookings`           | Utilisateur      | Récupérer mes réservations             |
| GET     | `/api/bookings/search`    | Admin            | Rechercher dans toutes les réservations |
| PUT     | `/api/bookings/:id`       | Propriétaire/Admin | Mettre à jour une réservation        |
| DELETE  | `/api/bookings/:id`       | Propriétaire/Admin | Supprimer une réservation            |

## Tests

### Exécuter tous les tests

```bash
npm run test:all
```

### Tests backend

```bash
npm run backend:test
```

Les tests backend utilisent une instance MongoDB en mémoire (mongodb-memory-server), donc aucune base de données lancée n'est nécessaire.

- **Tests unitaires** : validation des modèles, schémas Joi
- **Tests d'intégration** : tests complets des endpoints API avec authentification

### Tests frontend

```bash
npm run frontend:test
```

- Tests de rendu des composants
- Tests du contexte d'authentification
- Tests d'interaction utilisateur

### Tests E2E (Cypress)

```bash
cd e2e
npm run cypress:open
npm run cypress:run
```

> **Note** : le backend et le frontend doivent être démarrés avant d'exécuter les tests E2E.

## Structure du projet

```
akkor-hotel-final/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration DB, env, Swagger
│   │   ├── controllers/   # Gestionnaires de routes
│   │   ├── middleware/    # Authentification, validation
│   │   ├── models/        # Schémas Mongoose
│   │   ├── routes/        # Routes Express
│   │   ├── tests/         # Tests unitaires et d'intégration
│   │   ├── app.ts         # Initialisation de l'application Express
│   │   ├── server.ts      # Point d'entrée
│   │   └── seed.ts        # Script d'amorçage de la base
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Composants UI réutilisables
│   │   ├── context/       # Contexte React (Auth)
│   │   ├── pages/         # Composants de pages
│   │   ├── services/      # Client API
│   │   ├── tests/         # Tests de composants
│   │   ├── types/         # Interfaces TypeScript
│   │   ├── App.tsx        # Composant racine et routage
│   │   ├── main.tsx       # Point d'entrée
│   │   └── index.css      # Styles globaux
│   └── package.json
├── e2e/
│   ├── cypress/
│   │   ├── e2e/           # Scénarios de tests E2E
│   │   └── support/       # Commandes Cypress
│   └── cypress.config.ts
├── package.json           # Scripts racine du monorepo
└── README.md
```

