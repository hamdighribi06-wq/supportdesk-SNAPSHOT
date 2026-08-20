import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { keycloak } from './services/keycloak'
import { useAuthStore } from './stores/auth'

import './assets/main.css'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()

async function startApp() {
  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    })

    console.log('Keycloak authenticated:', authenticated)

    if (authenticated) {
      authStore.init()

      console.log('Utilisateur :', authStore.user)
      console.log('Rôle :', authStore.role)
      console.log('Équipe :', authStore.team)

      await router.replace('/tickets')
    }

    app.mount('#app')

  } catch (error) {
    console.error('Erreur initialisation Keycloak:', error)
  }
}

startApp()