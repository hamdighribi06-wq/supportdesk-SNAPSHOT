<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const tickets = computed(() => {
  return authStore.getVisibleTickets()
})

const totalTickets = computed(() => {
  return tickets.value.length
})

const openTickets = computed(() => {
  return tickets.value.filter(
    ticket => ticket.status === 'OPEN'
  ).length
})

const inProgressTickets = computed(() => {
  return tickets.value.filter(
    ticket => ticket.status === 'IN_PROGRESS'
  ).length
})

const closedTickets = computed(() => {
  return tickets.value.filter(
    ticket => ticket.status === 'CLOSED'
  ).length
})
</script>

<template>

  <div class="dashboard-page">

    <!-- Header -->

    <div class="dashboard-header">

      <div>
        <h1>Tableau de bord</h1>

        <p>
          Vue globale de l'activité SupportDesk.
        </p>
      </div>

      <div class="admin-badge">
        ADMIN
      </div>

    </div>

    <!-- Statistics -->

    <div class="stats-grid">

      <div class="stat-card">

        <div class="stat-icon">
          🎫
        </div>

        <div>
          <p>Total des tickets</p>
          <strong>{{ totalTickets }}</strong>
        </div>

      </div>

      <div class="stat-card">

        <div class="stat-icon">
          🟢
        </div>

        <div>
          <p>Tickets ouverts</p>
          <strong>{{ openTickets }}</strong>
        </div>

      </div>

      <div class="stat-card">

        <div class="stat-icon">
          🟠
        </div>

        <div>
          <p>En cours</p>
          <strong>{{ inProgressTickets }}</strong>
        </div>

      </div>

      <div class="stat-card">

        <div class="stat-icon">
          ⚪
        </div>

        <div>
          <p>Tickets fermés</p>
          <strong>{{ closedTickets }}</strong>
        </div>

      </div>

    </div>

    <!-- Recent tickets -->

    <div class="dashboard-section">

      <div class="section-header">

        <div>
          <h2>Tickets récents</h2>

          <p>
            Vue globale des tickets
          </p>
        </div>

        <RouterLink
          to="/tickets"
          class="view-all"
        >
          Voir tous les tickets →
        </RouterLink>

      </div>

      <div class="recent-tickets">

        <div
          v-for="ticket in tickets.slice(0, 5)"
          :key="ticket.id"
          class="recent-ticket"
        >

          <div>
            <strong>
              #{{ ticket.id }} - {{ ticket.title }}
            </strong>

            <span>
              {{ ticket.client }}
            </span>
          </div>

          <span class="status">
            {{ ticket.status }}
          </span>

        </div>

      </div>

    </div>

  </div>

</template>

<style scoped>

.dashboard-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
}

/* Header */

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 32px;
}

.dashboard-header h1 {
  margin: 0 0 8px;

  font-size: 30px;
  font-weight: 700;

  color: #111827;
}

.dashboard-header p {
  margin: 0;

  color: #6b7280;
}

.admin-badge {
  padding: 7px 13px;

  border-radius: 999px;

  background: #ede9fe;
  color: #6d28d9;

  font-size: 12px;
  font-weight: 700;
}

/* Statistics */

.stats-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 20px;

  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;

  gap: 16px;

  padding: 22px;

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 14px;
}

.stat-icon {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f3f4f6;

  border-radius: 10px;

  font-size: 22px;
}

.stat-card p {
  margin: 0 0 5px;

  color: #6b7280;

  font-size: 13px;
}

.stat-card strong {
  font-size: 25px;

  color: #111827;
}

/* Section */

.dashboard-section {
  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 14px;

  overflow: hidden;
}

.section-header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  padding: 22px;

  border-bottom: 1px solid #e5e7eb;
}

.section-header h2 {
  margin: 0 0 5px;

  font-size: 18px;
}

.section-header p {
  margin: 0;

  color: #6b7280;

  font-size: 13px;
}

.view-all {
  color: #374151;

  text-decoration: none;

  font-size: 14px;

  font-weight: 600;
}

.view-all:hover {
  text-decoration: underline;
}

/* Recent tickets */

.recent-ticket {
  display: flex;

  justify-content: space-between;
  align-items: center;

  padding: 18px 22px;

  border-bottom: 1px solid #f3f4f6;
}

.recent-ticket:last-child {
  border-bottom: none;
}

.recent-ticket strong {
  display: block;

  margin-bottom: 5px;

  font-size: 14px;
}

.recent-ticket span {
  color: #6b7280;

  font-size: 13px;
}

.recent-ticket .status {
  padding: 5px 10px;

  border-radius: 999px;

  background: #f3f4f6;

  font-size: 12px;

  font-weight: 600;

  color: #374151;
}

/* Responsive */

@media (max-width: 900px) {

  .stats-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }
}

@media (max-width: 600px) {

  .dashboard-page {
    padding: 20px;
  }

  .dashboard-header {
    align-items: flex-start;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    align-items: flex-start;

    gap: 15px;

    flex-direction: column;
  }

}

</style>