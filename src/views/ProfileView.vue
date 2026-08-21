<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>

  <div class="page">

    <div class="page-header">
      <div>
        <h1>Mon profil</h1>
        <p>Informations de votre compte.</p>
      </div>
    </div>

    <div class="profile-card">

      <div class="profile-avatar">
        👤
      </div>

      <div class="profile-info">

        <div>
          <span>Username : </span>
          <strong>{{ authStore.user }}</strong>
        </div>
        <br>
        <div>
          <span>Email : </span>
          <strong>
            {{ authStore.email || 'Non défini' }}
          </strong>
        </div>
        <br>
        <div>
          <span>Rôle : </span>
          <strong>{{ authStore.role || 'Non défini' }}</strong>
        </div>
        <br>
        <div>
          <span>Équipe : </span>
          <strong>{{ authStore.team || 'Non définie' }}</strong>
        </div>

      </div>

    </div>

  </div>

</template>