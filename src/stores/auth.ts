import { defineStore } from 'pinia'
import { keycloak } from '../services/keycloak'
import { tickets, type Ticket } from '../data/tickets'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as string | null,
    isAuthenticated: false,
    role: null as string | null,
    team: null as string | null,
    token: null as string | null
  }),

  actions: {

    // Met à jour le store à partir du token Keycloak
    updateAuth() {
      this.isAuthenticated = keycloak.authenticated ?? false
      this.token = keycloak.token ?? null

      if (!this.isAuthenticated) {
        this.user = null
        this.role = null
        this.team = null
        return
      }

      this.user =
        keycloak.tokenParsed?.preferred_username ?? null

      const roles =
        keycloak.tokenParsed?.realm_access?.roles ?? []

      const businessRoles = [
        'admin',
        'team-lead',
        'agent',
        'client'
      ]

      this.role = roles[0]

      const groups =
        keycloak.tokenParsed?.groups ?? []

      this.team = groups[0]?.replace('/teams/', '') ?? null
    },

    // Initialisation
    async init() {
      this.updateAuth()
    },

    // Login
    async login() {
      await keycloak.login()
    },

    // Logout
    async logout() {
      // Nettoyage du store
      this.user = null
      this.isAuthenticated = false
      this.role = null
      this.team = null
      this.token = null

      // Déconnexion réelle de Keycloak
      await keycloak.logout({
        redirectUri: window.location.origin
      })
    },

    // Refresh du token
    async refreshToken() {
      try {
        const refreshed = await keycloak.updateToken(30)

        if (refreshed) {
          console.log('Token rafraîchi')
        }

        // Dans tous les cas, on resynchronise le store
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
      if (this.role === 'admin') {
        return tickets
      }

      if (this.role === 'client') {
        return tickets.filter(
          ticket => ticket.client === this.user
        )
      }

      if (this.role === 'agent') {
        return tickets.filter(
          ticket => ticket.team === this.team
        )
      }

      if (this.role === 'team-lead') {
        return tickets.filter(
          ticket => ticket.team === this.team
        )
      }

      return []
    }
  }
})