<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const visibleTickets = computed(() => {
  return authStore.getVisibleTickets()
})

const getStatusClass = (status: string) => {
  switch (status.toUpperCase()) {
    case 'OPEN':
      return 'status-open'

    case 'IN_PROGRESS':
      return 'status-progress'

    case 'RESOLVED':
      return 'status-resolved'

    case 'CLOSED':
      return 'status-closed'

    default:
      return 'status-default'
  }
}
</script>

<template>
  <div class="tickets-page">

    <!-- Header -->
    <div class="tickets-header">

      <div>
        <h1>Mes tickets</h1>

        <p>
          Consultez et suivez les tickets qui vous sont accessibles.
        </p>
      </div>

      <div class="ticket-count">
        <span>{{ visibleTickets.length }}</span>
        ticket{{ visibleTickets.length > 1 ? 's' : '' }}
      </div>

    </div>

    <!-- Tickets -->
    <div
      v-if="visibleTickets.length > 0"
      class="tickets-grid"
    >

      <div
        v-for="ticket in visibleTickets"
        :key="ticket.id"
        class="ticket-card"
      >

        <!-- Card header -->
        <div class="ticket-card-header">

          <div class="ticket-id">
            #{{ ticket.id }}
          </div>

          <span
            class="ticket-status"
            :class="getStatusClass(ticket.status)"
          >
            {{ ticket.status }}
          </span>

        </div>

        <!-- Title -->
        <h2>
          {{ ticket.title }}
        </h2>

        <!-- Description -->
        <p class="ticket-description">
          {{ ticket.description }}
        </p>

        <!-- Information -->
        <div class="ticket-details">

          <div class="detail-item">
            <span class="detail-label">
              Client
            </span>

            <span class="detail-value">
              {{ ticket.client }}
            </span>
          </div>

          <div class="detail-item">
            <span class="detail-label">
              Équipe
            </span>

            <span class="detail-value">
              {{ ticket.team }}
            </span>
          </div>

        </div>

        <!-- Action -->
        <RouterLink
          :to="`/tickets/${ticket.id}`"
          class="details-button"
        >
          Voir les détails
          <span>→</span>
        </RouterLink>

      </div>

    </div>

    <!-- Empty state -->
    <div
      v-else
      class="empty-state"
    >
      <div class="empty-icon">
        🎫
      </div>

      <h2>Aucun ticket</h2>

      <p>
        Aucun ticket n'est actuellement accessible avec vos droits.
      </p>
    </div>

  </div>
</template>

<style scoped>
.tickets-page {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */

.tickets-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.tickets-header h1 {
  margin: 0 0 8px;
  font-size: 30px;
  font-weight: 700;
}

.tickets-header p {
  margin: 0;
  color: #6b7280;
  font-size: 15px;
}

.ticket-count {
  background: #f3f4f6;
  border-radius: 10px;
  padding: 10px 16px;
  color: #6b7280;
  font-size: 14px;
}

.ticket-count span {
  font-weight: 700;
  color: #111827;
}

/* Grid */

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 22px;
}

/* Card */

.ticket-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 22px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  display: flex;
  flex-direction: column;
}

.ticket-card:hover {
  transform: translateY(-3px);
  border-color: #cbd5e1;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

/* Card header */

.ticket-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ticket-id {
  color: #6b7280;
  font-size: 14px;
  font-weight: 600;
}

/* Status */

.ticket-status {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.status-open {
  background: #dcfce7;
  color: #166534;
}

.status-progress {
  background: #fef3c7;
  color: #92400e;
}

.status-resolved {
  background: #dbeafe;
  color: #1e40af;
}

.status-closed {
  background: #f3f4f6;
  color: #374151;
}

.status-default {
  background: #f3f4f6;
  color: #374151;
}

/* Title */

.ticket-card h2 {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 650;
  color: #111827;
}

/* Description */

.ticket-description {
  margin: 0 0 20px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Details */

.ticket-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #9ca3af;
}

.detail-value {
  font-size: 13px;
  font-weight: 600;
  color: #374151;

  overflow: hidden;
  text-overflow: ellipsis;
}

/* Button */

.details-button {
  margin-top: auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  text-decoration: none;

  background: #111827;
  color: white;

  padding: 10px 14px;
  border-radius: 9px;

  font-size: 14px;
  font-weight: 600;

  transition: background 0.2s ease;
}

.details-button:hover {
  background: #1f2937;
}

.details-button span {
  font-size: 18px;
}

/* Empty state */

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border: 1px dashed #d1d5db;
  border-radius: 14px;
}

.empty-icon {
  font-size: 42px;
  margin-bottom: 16px;
}

.empty-state h2 {
  margin: 0 0 8px;
  font-size: 20px;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
}

/* Responsive */

@media (max-width: 700px) {

  .tickets-page {
    padding: 20px;
  }

  .tickets-header {
    align-items: flex-start;
    gap: 15px;
  }

  .tickets-header h1 {
    font-size: 25px;
  }

  .tickets-grid {
    grid-template-columns: 1fr;
  }
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.actions button,
.comment-form button {
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: #111827;
  color: white;
  cursor: pointer;
}

.actions button:hover,
.comment-form button:hover {
  background: #1f2937;
}

.comment {
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.comment small {
  display: block;
  color: #9ca3af;
  margin-top: 4px;
}

.comment p {
  margin-bottom: 0;
}

.comment-form {
  margin-top: 20px;
}

.comment-form textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 10px;
  padding: 12px;
  box-sizing: border-box;
}
</style>