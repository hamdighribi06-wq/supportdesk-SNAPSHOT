import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  url: 'http://localhost:8089',
  realm: 'supportdesk',
  clientId: 'supportdesk-frontend'
})

export async function initKeycloak() {
  const authenticated = await keycloak.init({
    onLoad: 'check-sso',
    checkLoginIframe: false
  })

  if (authenticated) {
    console.log('Utilisateur connecté')
    console.log('Token :', keycloak.token)
  }

  // Token bientôt expiré
  keycloak.onTokenExpired = async () => {
    console.log('Token expiré, rafraîchissement...')

    try {
      const refreshed = await keycloak.updateToken(30)

      if (refreshed) {
        console.log('Token rafraîchi')
        console.log('Nouveau token :', keycloak.token)
      }
    } catch (error) {
      console.error('Impossible de rafraîchir le token', error)

      await keycloak.logout({
        redirectUri: window.location.origin
      })
    }
  }

  return authenticated
}