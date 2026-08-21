import {
  createRouter,
  createWebHistory
} from 'vue-router'

import { keycloak } from '../services/keycloak'

import DashboardView from '../views/DashboardView.vue'
import TicketsView from '../views/TicketsView.vue'
import TicketDetailsView from '../views/TicketDetailsView.vue'
import CreateTicketView from '../views/CreateTicketView.vue'
import ProfileView from '../views/ProfileView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'

const BUSINESS_ROLES = [
  'ADMIN',
  'TEAM_LEAD',
  'AGENT',
  'CLIENT'
]

const router = createRouter({
  history: createWebHistory(),

  routes: [

    {
      path: '/',
      redirect: '/tickets'
    },

    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,

      meta: {
        requiresAuth: true,
        roles: ['ADMIN']
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
      path: '/tickets/:id',
      name: 'ticket-details',
      component: TicketDetailsView,

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
        roles: ['CLIENT']
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

  if (
    to.meta.requiresAuth &&
    !keycloak.authenticated
  ) {
    return '/access-denied'
  }

  const roles =
    keycloak.tokenParsed?.realm_access?.roles ?? []

  const businessRole =
    roles.find(role =>
      BUSINESS_ROLES.includes(role)
    )

  if (
    to.meta.requiresAuth &&
    !businessRole
  ) {
    return '/access-denied'
  }

  const requiredRoles =
    to.meta.roles as string[] | undefined

  if (
    requiredRoles &&
    !requiredRoles.includes(businessRole!)
  ) {
    return '/access-denied'
  }

  return true
})

export default router