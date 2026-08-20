<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { tickets } from '../data/tickets'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()

const ticket = computed(() => {

  const id = Number(route.params.id)

  return authStore.getVisibleTickets()
    .find(ticket => ticket.id === id)
})
</script>

<template>

  <div class="page">

    <button
      class="back-button"
      @click="router.push('/tickets')"
    >
      ← Retour aux tickets
    </button>

    <div
      v-if="ticket"
      class="ticket-detail"
    >

      <div class="detail-header">

        <div>
          <span class="ticket-id">
            Ticket #{{ ticket.id }}
          </span>

          <h1>{{ ticket.title }}</h1>
        </div>

        <span class="ticket-status">
          {{ ticket.status }}
        </span>

      </div>

      <div class="detail-section">

        <h3>Description</h3>

        <p>
          {{ ticket.description }}
        </p>

      </div>

      <div class="detail-grid">

        <div>
          <span>Client</span>
          <strong>{{ ticket.client }}</strong>
        </div>

        <div>
          <span>Équipe</span>
          <strong>{{ ticket.team }}</strong>
        </div>

        <div>
          <span>Statut</span>
          <strong>{{ ticket.status }}</strong>
        </div>

        <div>
          <span>Assigné à</span>
          <strong>
            {{ ticket.assignedTo || 'Non assigné' }}
          </strong>
        </div>

      </div>

      <div class="detail-section">

        <h3>Commentaires</h3>

        <p class="empty-message">
          Aucun commentaire.
        </p>

      </div>

    </div>

    <div v-else class="not-found">
      <h2>Ticket introuvable</h2>
      <p>
        Ce ticket n'existe pas ou vous n'avez pas les droits pour le consulter.
      </p>
    </div>

  </div>

</template>