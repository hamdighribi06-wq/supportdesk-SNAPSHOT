# SupportDesk

SupportDesk est une SPA de gestion de tickets de support interne développée avec **Vue 3**, **TypeScript**, **Pinia**, **Vue Router** et **Keycloak**.

L'application permet à différents profils — client, agent, team-lead et administrateur — d'accéder uniquement aux fonctionnalités et tickets correspondant à leur rôle et à leur équipe.

Le projet ne possède **aucun backend applicatif** : les tickets sont simulés côté frontend. **Keycloak est la seule brique serveur** utilisée pour l'authentification et la gestion des identités, rôles et groupes.

---

## 1. Fonctionnalités

### Authentification

L'application utilise Keycloak pour :

- la connexion utilisateur ;
- la déconnexion ;
- la récupération de la session existante au chargement ;
- l'authentification via **Authorization Code Flow + PKCE (S256)** ;
- le rafraîchissement automatique du token ;
- la gestion de la session entre plusieurs onglets ;
- l'accès à une page profil.

### Gestion des rôles

Les rôles applicatifs sont récupérés depuis les claims du token Keycloak :

- `CLIENT`
- `AGENT`
- `TEAM_LEAD`
- `ADMIN`

### Gestion des équipes

Les équipes sont récupérées depuis les groupes Keycloak présents dans le token.

Équipes utilisées dans le jeu de données :

- `team-support`
- `team-network`

### Gestion des tickets

Les tickets sont simulés localement dans le frontend.

Selon le rôle :

- **Client** : crée des tickets, consulte ses tickets et ajoute des commentaires sur ses tickets.
- **Agent** : consulte et traite les tickets de son équipe, prend en charge les tickets, répond et modifie leur statut.
- **Team Lead** : intervient sur les tickets de son équipe, réassigne les tickets, les escalade et les clôture.
- **Admin** : accède à l'ensemble des tickets et au tableau de bord.

### Accès refusé

Un utilisateur authentifié qui ne possède aucun rôle applicatif reconnu est redirigé vers une page `Access Denied`.

---

## 2. Technologies utilisées

- Vue 3
- TypeScript
- Composition API
- Vue Router
- Pinia
- Keycloak
- Docker / Docker Compose
- Vite

---

## 3. Prérequis

Avant de lancer le projet, installer :

- Node.js et npm
- Docker
- Docker Compose

Vérifier les installations :

```bash
node --version
npm --version
docker --version
docker compose version
```

---

## 4. Structure du projet

```text
supportdesk/
├── keycloak/
│   ├── docker-compose.yml
│   └── realm-export/
│       └── realm-export.json
│
├── src/
│   ├── data/
│   │   └── tickets.ts
│   │
│   ├── router/
│   │   └── index.ts
│   │
│   ├── services/
│   │   └── keycloak.ts
│   │
│   ├── stores/
│   │   └── auth.ts
│   │
│   └── views/
│       ├── AccessDeniedView.vue
│       ├── CreateTicketView.vue
│       ├── DashboardView.vue
│       ├── ProfileView.vue
│       ├── TicketDetailsView.vue
│       └── TicketsView.vue
│
├── package.json
├── package-lock.json
├── vite.config.ts
└── README.md
```

---

# 5. Démarrage de Keycloak

Le projet fournit un environnement Keycloak Dockerisé avec un realm exporté.

Depuis la racine du projet :

```bash
docker compose -f keycloak/docker-compose.yml up -d
```

Vérifier que le conteneur est démarré :

```bash
docker ps
```

Keycloak démarre avec le realm fourni dans :

```text
keycloak/realm-export/realm-export.json
```

Le realm est importé automatiquement au démarrage grâce à l'option `--import-realm`.

---

# 6. Vérifier Keycloak

Une fois le conteneur démarré, ouvrir l'interface d'administration Keycloak à l'adresse configurée dans `keycloak/docker-compose.yml`.

Le realm du projet doit être présent après l'import automatique.

Vérifier notamment :

- les rôles ;
- les groupes ;
- les utilisateurs ;
- le client de l'application ;
- la configuration PKCE.

---

# 7. Rôles Keycloak

Le realm contient les rôles applicatifs suivants :

| Rôle | Description |
|---|---|
| `CLIENT` | Crée et consulte ses propres tickets |
| `AGENT` | Traite les tickets de son équipe |
| `TEAM_LEAD` | Supervise les tickets de son équipe |
| `ADMIN` | Accès global et tableau de bord |

---

# 8. Équipes Keycloak

Deux équipes sont utilisées pour couvrir le périmètre fonctionnel :

| Équipe | Identifiant |
|---|---|
| Support | `team-support` |
| Réseau | `team-network` |

Les utilisateurs appartenant à une équipe récupèrent cette information depuis les groupes Keycloak présents dans leurs claims.

---

# 9. Utilisateurs de test

Le realm fourni contient des utilisateurs couvrant les différents scénarios fonctionnels :

| Utilisateur | Rôle | Équipe |
|---|---|---|
| `admin1` | `ADMIN` | - |
| `teamlead1` | `TEAM_LEAD` | `team-support` |
| `agent1` | `AGENT` | `team-support` |
| `agent2` | `AGENT` | `team-network` |
| `client1` | `CLIENT` | - |
| `client2` | `CLIENT` | - |

> Les mots de passe des utilisateurs de test sont ceux définis dans `keycloak/realm-export/realm-export.json`.

Si les identifiants ou mots de passe sont modifiés dans le realm, utiliser les valeurs présentes dans le fichier d'export.

---

# 10. Installation de la SPA

Dans un autre terminal, depuis la racine du projet :

```bash
npm install
```

Puis lancer le serveur de développement :

```bash
npm run dev
```

Vite affiche ensuite l'URL locale de l'application, généralement :

```text
http://localhost:5173
```

Ouvrir cette adresse dans le navigateur.

---

# 11. Ordre de démarrage recommandé

Pour éviter les problèmes de connexion à Keycloak, suivre cet ordre :

### Étape 1 — Démarrer Keycloak

```bash
docker compose -f keycloak/docker-compose.yml up -d
```

### Étape 2 — Installer les dépendances

```bash
npm install
```

### Étape 3 — Démarrer Vue

```bash
npm run dev
```

### Étape 4 — Ouvrir l'application

Ouvrir l'URL affichée par Vite, par exemple :

```text
http://localhost:5173
```

### Étape 5 — Se connecter

L'application redirige automatiquement vers Keycloak pour l'authentification.

---

# 12. Scénarios de test


## 12.1 Test CLIENT

Se connecter avec :

```text
Utilisateur : client1
```

Vérifier que le client peut :

- accéder à la liste de ses tickets ;
- ne voir que ses propres tickets ;
- créer un ticket ;
- consulter les détails d'un de ses tickets ;
- ajouter un commentaire sur ses tickets.

Le client ne doit pas pouvoir :

- consulter les tickets d'un autre client ;
- accéder au dashboard administrateur ;
- effectuer les actions réservées aux agents ou team-leads.

---

## 12.2 Test AGENT — équipe Support

Se connecter avec :

```text
Utilisateur : agent1
Rôle       : AGENT
Équipe     : team-support
```

Vérifier que l'agent :

- voit uniquement les tickets de `team-support` ;
- peut prendre en charge un ticket ;
- peut répondre/commenter ;
- peut modifier le statut d'un ticket ;
- ne voit pas les tickets appartenant à `team-network`.

---

## 12.3 Test AGENT — équipe Réseau

Se connecter avec :

```text
Utilisateur : agent2
Rôle       : AGENT
Équipe     : team-network
```

Vérifier que l'agent :

- voit uniquement les tickets de `team-network` ;
- peut traiter les tickets de son équipe ;
- ne peut pas traiter les tickets de `team-support`.

Ce scénario permet de vérifier que le filtrage dépend bien de l'équipe de l'utilisateur.

---

## 12.4 Test TEAM_LEAD

Se connecter avec :

```text
Utilisateur : teamlead1
Rôle       : TEAM_LEAD
Équipe     : team-support
```

Vérifier que le team-lead peut :

- consulter les tickets de son équipe ;
- réassigner un ticket ;
- escalader un ticket ;
- clôturer un ticket.

Il ne doit pas avoir accès aux tickets de l'autre équipe.

---

## 12.5 Test ADMIN

Se connecter avec :

```text
Utilisateur : admin1
Rôle       : ADMIN
```

Vérifier que l'administrateur :

- voit tous les tickets ;
- peut accéder au dashboard ;
- peut consulter les informations globales ;
- n'est pas limité à une équipe.

Le lien `Dashboard` est visible uniquement pour l'administrateur.

---

## 12.6 Test utilisateur sans rôle

Créer ou utiliser dans Keycloak un utilisateur authentifié ne possédant aucun des rôles applicatifs suivants :

```text
CLIENT
AGENT
TEAM_LEAD
ADMIN
```

Après authentification, l'utilisateur doit être redirigé vers :

```text
/access-denied
```

Cette page indique que l'utilisateur ne possède pas les autorisations nécessaires.

---

# 13. Gestion du token

L'application utilise le token Keycloak pour déterminer :

- l'identité de l'utilisateur ;
- les rôles ;
- les groupes/équipes.

Le rôle est récupéré depuis les claims Keycloak, notamment :

```text
realm_access.roles
```

Les groupes sont récupérés depuis :

```text
groups
```

Le rafraîchissement du token est géré automatiquement afin de maintenir la session active.

---

# 14. PKCE

L'authentification utilise :

```text
Authorization Code Flow
+
PKCE
+
S256
```

La configuration Keycloak et le service frontend utilisent la méthode PKCE `S256`.

Aucun mot de passe utilisateur n'est géré directement par la SPA.

---

# 15. Gestion de session et logout

La SPA gère :

- l'initialisation de la session au chargement ;
- le refresh du token ;
- le logout Keycloak ;
- la propagation du logout aux autres onglets via `BroadcastChannel`.

Lorsqu'un utilisateur se déconnecte, la session Keycloak est fermée et l'utilisateur est redirigé vers l'application.

---

# 16. Données de tickets

Les tickets sont simulés dans le frontend.

Le fichier principal contenant le jeu de données est :

```text
src/data/tickets.ts
```

Chaque ticket possède notamment des informations permettant de déterminer :

- son propriétaire/client ;
- son équipe ;
- son statut ;
- son contenu ;
- ses commentaires ;
- son traitement.

Aucun backend applicatif n'est nécessaire pour faire fonctionner la démonstration.

---

# 17. Filtrage selon le rôle

La visibilité des tickets est adaptée au rôle :

```text
CLIENT
  ↓
ses propres tickets

AGENT
  ↓
tickets de son équipe

TEAM_LEAD
  ↓
tickets de son équipe

ADMIN
  ↓
tous les tickets
```

Les actions disponibles dans l'interface sont également adaptées au rôle et au périmètre de l'utilisateur connecté.

---

# 18. Routes principales

Les principales routes de l'application sont :

| Route | Fonction |
|---|---|
| `/tickets` | Liste des tickets accessibles |
| `/tickets/:id` | Détails d'un ticket |
| `/tickets/new` | Création d'un ticket |
| `/profile` | Profil utilisateur |
| `/dashboard` | Dashboard administrateur |
| `/access-denied` | Accès refusé |

Les routes protégées utilisent les guards du Vue Router.

---

# 19. Sécurité côté frontend

Les contrôles d'accès sont appliqués à plusieurs niveaux :

### Navigation

Le router vérifie :

- l'authentification ;
- le rôle requis ;
- l'accès à certaines pages.

### Interface

Les menus et actions sont affichés en fonction du rôle.

### Tickets

La liste des tickets est filtrée selon :

- le rôle ;
- l'équipe ;
- l'utilisateur connecté.

### Actions

Les opérations telles que :

- prise en charge ;
- changement de statut ;
- réassignation ;
- escalade ;
- clôture ;

sont disponibles uniquement pour les profils autorisés.

> Important : ce projet est un POC frontend sans backend applicatif. Les données étant simulées côté navigateur, les contrôles frontend servent à démontrer le modèle d'autorisation demandé par l'exercice. Dans une application de production avec des données réelles, les autorisations devraient également être vérifiées côté serveur.

---

# 20. Arrêt de l'application

Pour arrêter la SPA :

```text
Ctrl + C
```

Pour arrêter Keycloak :

```bash
docker compose -f keycloak/docker-compose.yml down
```

Pour supprimer également les ressources Docker associées :

```bash
docker compose -f keycloak/docker-compose.yml down -v
```

---

# 21. Réinitialisation de Keycloak

Si nécessaire, arrêter les conteneurs et supprimer les volumes :

```bash
docker compose -f keycloak/docker-compose.yml down -v
```

Puis redémarrer :

```bash
docker compose -f keycloak/docker-compose.yml up -d
```

Le realm fourni sera réimporté au démarrage.

---

# 22. Développement

Lancer le projet en mode développement :

```bash
npm run dev
```

Construire l'application :

```bash
npm run build
```

Prévisualiser le build :

```bash
npm run preview
```

---

# 23. Architecture fonctionnelle

```text
                         ┌─────────────────┐
                         │    Keycloak     │
                         │                 │
                         │ Users           │
                         │ Roles           │
                         │ Groups/Teams    │
                         │ Tokens + PKCE   │
                         └────────┬────────┘
                                  │
                                  │ Authentication
                                  │ Claims
                                  ▼
┌────────────────────────────────────────────────────┐
│                 SupportDesk SPA                    │
│                                                    │
│  ┌──────────────┐    ┌──────────────┐              │
│  │ Vue Router   │    │    Pinia     │              │
│  │              │    │ Auth Store   │              │
│  └──────┬───────┘    └──────┬───────┘              │
│         │                    │                      │
│         └──────────┬─────────┘                      │
│                    ▼                                │
│              Vue Components                         │
│                                                    │
│  Tickets ─ Create ─ Details ─ Profile ─ Dashboard │
│                                                    │
│              Local ticket data                     │
└────────────────────────────────────────────────────┘
```

---

# 24. Résumé du modèle d'autorisation

```text
ADMIN
 └── Tous les tickets
     └── Dashboard

TEAM_LEAD
 └── Tickets de son équipe
     ├── Réassignation
     ├── Escalade
     └── Clôture

AGENT
 └── Tickets de son équipe
     ├── Prise en charge
     ├── Réponse/commentaire
     └── Changement de statut

CLIENT
 └── Ses propres tickets
     ├── Création
     ├── Consultation
     └── Commentaire
```

---

# 25. Livrable

Le dépôt contient les éléments nécessaires au fonctionnement du POC :

- SPA Vue 3 ;
- Composition API ;
- Vue Router ;
- Pinia ;
- intégration Keycloak ;
- authentification PKCE ;
- gestion des rôles ;
- gestion des équipes ;
- données de tickets simulées ;
- dashboard administrateur ;
- page d'accès refusé ;
- configuration Docker de Keycloak ;
- export du realm ;
- utilisateurs de test ;
- documentation de lancement et de test.

---

## Conclusion

SupportDesk démontre une architecture frontend Vue 3 sécurisée par Keycloak, avec une gestion des accès basée sur l'identité, les rôles et les équipes de l'utilisateur authentifié.

Le projet est conçu comme un POC autonome : Keycloak fournit l'authentification et les informations d'identité, tandis que les données métier sont simulées localement dans la SPA.
