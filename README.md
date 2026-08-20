# 🔐 SupportDesk — Vue.js + Keycloak

SupportDesk est une Single Page Application (SPA) développée avec **Vue.js 3**, **TypeScript**, **Pinia**, **Vue Router** et sécurisée avec **Keycloak**.

L'application permet de gérer des tickets selon le rôle et l'équipe de l'utilisateur.

Le projet utilise Keycloak pour :

- l'authentification des utilisateurs ;
- la gestion des rôles ;
- la gestion des groupes/équipes ;
- la génération et le rafraîchissement des tokens ;
- la protection des routes ;
- la déconnexion complète de la session Keycloak.

---

# 📋 Sommaire

- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Rôles](#-rôles)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Démarrer Keycloak](#-démarrer-keycloak)
- [Configurer Keycloak](#-configurer-keycloak)
- [Démarrer la SPA](#-démarrer-la-spa)
- [Utilisateurs de test](#-utilisateurs-de-test)
- [Tester les fonctionnalités](#-tester-les-fonctionnalités)
- [Sécurité](#-sécurité)
- [Structure du projet](#-structure-du-projet)
- [Arrêter l'application](#-arrêter-lapplication)
- [Points importants](#-points-importants)

---

# 🏗 Architecture

L'application est composée de deux parties principales :

```text
                    ┌─────────────────────┐
                    │      Navigateur     │
                    │                     │
                    │   Vue.js SPA        │
                    │   localhost:5173    │
                    └──────────┬──────────┘
                               │
                               │ OpenID Connect
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Keycloak       │
                    │                     │
                    │   localhost:8089    │
                    │                     │
                    │ Realm: supportdesk  │
                    └─────────────────────┘