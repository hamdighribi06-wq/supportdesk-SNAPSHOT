import { createRouter, createWebHistory } from 'vue-router'

import { keycloak } from '../services/keycloak'

import DashboardView from '../views/DashboardView.vue'
import TicketsView from '../views/TicketsView.vue'
import CreateTicketView from '../views/CreateTicketView.vue'
import ProfileView from '../views/ProfileView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true,
        roles: ['admin']
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/tickets',
      name: 'tickets',
      component: TicketsView,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/tickets/create',
      name: 'create-ticket',
      component: CreateTicketView,
      meta: {
        requiresAuth: true,
        roles: ['client']
      }
    },

    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDeniedView
    }
  ]
})

router.beforeEach((to) => {

  // 1. Vérifier l'authentification
  if (to.meta.requiresAuth && !keycloak.authenticated) {
    return '/'
  }

  // 2. Utilisateur authentifié mais sans rôle métier
  if (
    to.meta.requiresAuth &&
    !keycloak.tokenParsed?.realm_access?.roles
      ?.some(role =>
        ['admin', 'team-lead', 'agent', 'client'].includes(role)
      )
  ) {
    return '/access-denied'
  }

  // 3. Vérifier les rôles spécifiques de la route
  const requiredRoles = to.meta.roles as string[] | undefined

  if (requiredRoles) {

    const userRoles =
      keycloak.tokenParsed?.realm_access?.roles ?? []

    const hasRole = requiredRoles.some(role =>
      userRoles.includes(role)
    )

    if (!hasRole) {
      return '/access-denied'
    }
  }

  return true
})

export default router