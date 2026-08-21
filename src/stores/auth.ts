import { defineStore } from 'pinia'
import { keycloak } from '../services/keycloak'
import { tickets, type Ticket } from '../data/tickets'

const BUSINESS_ROLES = [
  'ADMIN',
  'TEAM_LEAD',
  'AGENT',
  'CLIENT'
]

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as string | null,
    email: null as string | null,
    isAuthenticated: false,
    role: null as string | null,
    team: null as string | null,
    token: null as string | null
  }),

  actions: {

    updateAuth() {
      this.isAuthenticated =
        keycloak.authenticated ?? false

      this.token =
        keycloak.token ?? null

      if (!this.isAuthenticated) {
        this.user = null
        this.email = null
        this.role = null
        this.team = null
        this.token = null

        return
      }

      const tokenParsed = keycloak.tokenParsed

      this.user =
        tokenParsed?.preferred_username ?? null

      this.email =
        tokenParsed?.email ?? null

      const roles =
        tokenParsed?.realm_access?.roles ?? []

      this.role =
        roles.find(role =>
          BUSINESS_ROLES.includes(role)
        ) ?? null

      const groups =
        tokenParsed?.groups ?? []

      const teams = groups
        .filter(group =>
          group.startsWith('/team-')
        )
        .map(group =>
          group.substring(1)
        )

      this.team =
        teams.length > 0
          ? teams[0]
          : null
    },

    async login() {
      await keycloak.login()
    },

    async logout() {

      const channel =
      new BroadcastChannel('supportdesk-auth')

      channel.postMessage({
        type: 'LOGOUT'
      })

      channel.close()

      this.user = null
      this.email = null
      this.isAuthenticated = false
      this.role = null
      this.team = null
      this.token = null

      await keycloak.logout({
        redirectUri: window.location.origin
      })
    },

    async refreshToken() {
      try {
        await keycloak.updateToken(30)

        this.updateAuth()

        return true

      } catch (error) {

        console.error(
          'Impossible de rafraîchir le token',
          error
        )

        await this.logout()

        return false
      }
    },

    getVisibleTickets(): Ticket[] {

      if (this.role === 'ADMIN') {
        return tickets
      }

      if (this.role === 'CLIENT') {
        return tickets.filter(
          ticket =>
            ticket.client === this.user
        )
      }

      if (
        this.role === 'AGENT' ||
        this.role === 'TEAM_LEAD'
      ) {
        return tickets.filter(
          ticket =>
            ticket.team === this.team
        )
      }

      return []
    },

    canManageTicket(ticket: Ticket) {

      if (this.role === 'ADMIN') {
        return true
      }

      if (
        this.role === 'AGENT' &&
        ticket.team === this.team
      ) {
        return true
      }

      if (
        this.role === 'TEAM_LEAD' &&
        ticket.team === this.team
      ) {
        return true
      }

      return false
    }
  }
})