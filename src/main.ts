import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { keycloak } from './services/keycloak'

import App from './App.vue'
import router from './router'

import { initKeycloak } from './services/keycloak'
import { useAuthStore } from './stores/auth'

import './assets/main.css'

async function startApp() {
  try {
    await initKeycloak()

    const app = createApp(App)

    const pinia = createPinia()

    app.use(pinia)
    app.use(router)

    const authStore = useAuthStore()

    authStore.updateAuth()

    app.mount('#app')

    if (authStore.isAuthenticated) {
      await router.replace('/tickets')
    }

  } catch (error) {
    console.error(
      'Erreur initialisation Keycloak:',
      error
    )
  }
  const authChannel =
  new BroadcastChannel('supportdesk-auth')

  authChannel.onmessage = async (event) => {

    if (event.data?.type === 'LOGOUT') {

      if (keycloak.authenticated) {
        await keycloak.logout({
          redirectUri: window.location.origin
        })
      }
    }
  }
  setInterval(async () => {

    if (!keycloak.authenticated) {
      return
    }

    try {
      await authStore.refreshToken()
    } catch (error) {
      console.error(error)
    }

    }, 30000)
}

startApp()