<script setup lang="ts">
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
}
</script>

<template>
  <div class="app-layout">

    <header class="navbar">

      <div class="logo">
        🔐 SupportDesk
      </div>

      <nav>
        <RouterLink
          v-if="authStore.role === 'admin'"
          to="/dashboard"
        >
          Dashboard
        </RouterLink>
        <RouterLink v-if="authStore.role" to="/tickets">
          Tickets
        </RouterLink>

        <RouterLink v-if="authStore.role" to="/profile">
          Profil
        </RouterLink>

        <RouterLink
          v-if="authStore.role === 'client'"
          to="/tickets/create"
        >
          Nouveau ticket
        </RouterLink>
      </nav>

      <button
        class="logout-button"
        @click="logout"
      >
        Déconnexion
      </button>

    </header>

    <main class="page-container">
      <RouterView />
    </main>

  </div>
</template>