import Keycloak from 'keycloak-js'

export const keycloak = new Keycloak({
  url: 'http://localhost:8089',
  realm: 'supportdesk',
  clientId: 'supportdesk-frontend'
})

export async function initKeycloak() {
  const authenticated = await keycloak.init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    pkceMethod: 'S256'
  })

  if (authenticated) {
    console.log('Keycloak authenticated')
  }

  keycloak.onTokenExpired = async () => {
    try {
      await keycloak.updateToken(30)
      console.log('Token refreshed')
    } catch (error) {
      console.error('Token refresh failed', error)

      await keycloak.logout({
        redirectUri: window.location.origin
      })
    }
  }

  const authChannel = new BroadcastChannel(
    'supportdesk-auth'
  )

  return authenticated
}