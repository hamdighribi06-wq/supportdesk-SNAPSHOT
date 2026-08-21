<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  tickets,
  type TicketStatus
} from '../data/tickets'

import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const comment = ref('')

const ticket = computed(() => {
  const id = Number(route.params.id)

  return authStore
    .getVisibleTickets()
    .find(ticket => ticket.id === id)
})

/* =========================
   PERMISSIONS
========================= */

const canComment = computed(() => {
  if (!ticket.value) return false

  if (authStore.role === 'ADMIN') {
    return true
  }

  if (authStore.role === 'CLIENT') {
    return ticket.value.client === authStore.user
  }

  if (
    authStore.role === 'AGENT' ||
    authStore.role === 'TEAM_LEAD'
  ) {
    return ticket.value.team === authStore.team
  }

  return false
})

const canAgentManage = computed(() => {
  if (!ticket.value) return false

  return (
    authStore.role === 'ADMIN' ||
    (
      authStore.role === 'AGENT' &&
      ticket.value.team === authStore.team
    )
  )
})

const canTeamLeadManage = computed(() => {
  if (!ticket.value) return false

  return (
    authStore.role === 'ADMIN' ||
    (
      authStore.role === 'TEAM_LEAD' &&
      ticket.value.team === authStore.team
    )
  )
})

/* =========================
   AVAILABLE AGENTS
========================= */

const availableAgents = computed(() => {
  if (authStore.team === 'team-support') {
    return ['agent1']
  }

  if (authStore.team === 'team-network') {
    return ['agent2']
  }

  return []
})

/* =========================
   ACTIONS
========================= */

function addComment() {
  if (
    !ticket.value ||
    !comment.value.trim() ||
    !canComment.value
  ) {
    return
  }

  ticket.value.comments.push({
    id: Date.now(),
    author: authStore.user ?? 'unknown',
    message: comment.value.trim(),
    createdAt: new Date().toLocaleString('fr-FR')
  })

  comment.value = ''
}

function takeOwnership() {
  if (
    !ticket.value ||
    !canAgentManage.value
  ) {
    return
  }

  ticket.value.assignedTo =
    authStore.user ?? undefined

  ticket.value.status = 'IN_PROGRESS'
}

function updateStatus(status: TicketStatus) {
  if (
    !ticket.value ||
    !canAgentManage.value
  ) {
    return
  }

  ticket.value.status = status
}

function escalate() {
  if (
    !ticket.value ||
    !canTeamLeadManage.value
  ) {
    return
  }

  ticket.value.status = 'ESCALATED'
}

function closeTicket() {
  if (
    !ticket.value ||
    !canTeamLeadManage.value
  ) {
    return
  }

  ticket.value.status = 'CLOSED'
}

function reassignToAgent(agent: string) {
  if (
    !ticket.value ||
    !canTeamLeadManage.value
  ) {
    return
  }

  ticket.value.assignedTo = agent
}
</script>

<template>
  <div class="ticket-page">

    <!-- HEADER -->
    <div class="page-top">

      <button
        class="back-button"
        @click="router.push('/tickets')"
      >
        <span>←</span>
        Retour aux tickets
      </button>

      <span class="page-context">
        SupportDesk / Ticket #{{ ticket?.id }}
      </span>

    </div>

    <!-- TICKET -->
    <div
      v-if="ticket"
      class="ticket-container"
    >

      <!-- HEADER CARD -->
      <div class="ticket-header">

        <div class="ticket-title-wrapper">

          <div class="ticket-id">
            TICKET #{{ ticket.id }}
          </div>

          <h1>
            {{ ticket.title }}
          </h1>

          <p class="ticket-subtitle">
            Détails et suivi de la demande
          </p>

        </div>

        <span
          class="status-badge"
          :class="`status-${ticket.status.toLowerCase()}`"
        >
          <span class="status-dot"></span>
          {{ ticket.status.replace('_', ' ') }}
        </span>

      </div>

      <!-- MAIN INFORMATION -->
      <div class="ticket-content">

        <!-- LEFT -->
        <div class="main-column">

          <!-- DESCRIPTION -->
          <section class="card">

            <div class="section-title">
              <div class="section-icon">
                ☰
              </div>

              <div>
                <h2>Description</h2>
                <span>Informations concernant la demande</span>
              </div>
            </div>

            <div class="description">
              {{ ticket.description }}
            </div>

          </section>

          <!-- COMMENTS -->
          <section class="card">

            <div class="section-title">

              <div class="section-icon">
                💬
              </div>

              <div>
                <h2>Commentaires</h2>

                <span>
                  {{ ticket.comments.length }}
                  commentaire{{ ticket.comments.length > 1 ? 's' : '' }}
                </span>
              </div>

            </div>

            <!-- EMPTY -->
            <div
              v-if="ticket.comments.length === 0"
              class="empty-comments"
            >
              <div class="empty-icon">
                💬
              </div>

              <strong>
                Aucun commentaire
              </strong>

              <span>
                Aucun commentaire n'a encore été ajouté à ce ticket.
              </span>
            </div>

            <!-- COMMENTS -->
            <div
              v-else
              class="comments-list"
            >

              <div
                v-for="item in ticket.comments"
                :key="item.id"
                class="comment"
              >

                <div class="comment-avatar">
                  {{ item.author.charAt(0).toUpperCase() }}
                </div>

                <div class="comment-body">

                  <div class="comment-header">

                    <strong>
                      {{ item.author }}
                    </strong>

                    <small>
                      {{ item.createdAt }}
                    </small>

                  </div>

                  <p>
                    {{ item.message }}
                  </p>

                </div>

              </div>

            </div>

            <!-- ADD COMMENT -->
            <div
              v-if="canComment"
              class="comment-form"
            >

              <textarea
                v-model="comment"
                placeholder="Écrivez votre commentaire..."
                rows="4"
              ></textarea>

              <div class="comment-form-footer">

                <span>
                  Votre commentaire sera visible par les membres concernés.
                </span>

                <button
                  class="primary-button"
                  :disabled="!comment.trim()"
                  @click="addComment"
                >
                  Ajouter
                </button>

              </div>

            </div>

          </section>

        </div>

        <!-- RIGHT SIDEBAR -->
        <aside class="sidebar">

          <!-- INFORMATION -->
          <section class="card information-card">

            <div class="section-title">

              <div class="section-icon">
                ℹ
              </div>

              <div>
                <h2>Informations</h2>
                <span>Détails du ticket</span>
              </div>

            </div>

            <div class="info-list">

              <div class="info-row">

                <span class="info-label">
                  Client
                </span>

                <strong>
                  {{ ticket.client }}
                </strong>

              </div>

              <div class="info-row">

                <span class="info-label">
                  Équipe
                </span>

                <span class="team-badge">
                  {{ ticket.team }}
                </span>

              </div>

              <div class="info-row">

                <span class="info-label">
                  Statut
                </span>

                <span
                  class="mini-status"
                  :class="`status-${ticket.status.toLowerCase()}`"
                >
                  {{ ticket.status.replace('_', ' ') }}
                </span>

              </div>

              <div class="info-row">

                <span class="info-label">
                  Assigné à
                </span>

                <strong>
                  {{ ticket.assignedTo || 'Non assigné' }}
                </strong>

              </div>

            </div>

          </section>

          <!-- AGENT ACTIONS -->
          <section
            v-if="canAgentManage"
            class="card action-card"
          >

            <div class="section-title">

              <div class="section-icon">
                ⚙
              </div>

              <div>
                <h2>Actions</h2>
                <span>Gestion du ticket</span>
              </div>

            </div>

            <div class="action-list">

              <button
                class="action-button primary-action"
                @click="takeOwnership"
              >
                <span>✓</span>
                Prendre en charge
              </button>

              <button
                class="action-button"
                @click="updateStatus('IN_PROGRESS')"
              >
                <span>▶</span>
                Mettre en cours
              </button>

              <button
                class="action-button success-action"
                @click="updateStatus('RESOLVED')"
              >
                <span>✓</span>
                Résoudre
              </button>

            </div>

          </section>

          <!-- TEAM LEAD ACTIONS -->
          <section
            v-if="canTeamLeadManage"
            class="card action-card"
          >

            <div class="section-title">

              <div class="section-icon">
                👑
              </div>

              <div>
                <h2>Team Lead</h2>
                <span>Actions avancées</span>
              </div>

            </div>

            <div class="action-list">

              <!-- REASSIGN -->
              <div
                v-if="availableAgents.length > 0"
                class="assign-section"
              >

                <span class="action-label">
                  Réassigner à
                </span>

                <button
                  v-for="agent in availableAgents"
                  :key="agent"
                  class="action-button"
                  @click="reassignToAgent(agent)"
                >
                  <span>👤</span>
                  {{ agent }}
                </button>

              </div>

              <button
                class="action-button warning-action"
                @click="escalate"
              >
                <span>↑</span>
                Escalader
              </button>

              <button
                class="action-button danger-action"
                @click="closeTicket"
              >
                <span>✓</span>
                Clôturer
              </button>

            </div>

          </section>

        </aside>

      </div>

    </div>

    <!-- NOT FOUND -->
    <div
      v-else
      class="not-found"
    >

      <div class="not-found-icon">
        !
      </div>

      <h2>
        Ticket introuvable
      </h2>

      <p>
        Ce ticket n'existe pas ou vous n'avez pas les droits
        nécessaires pour le consulter.
      </p>

      <button
        class="primary-button"
        @click="router.push('/tickets')"
      >
        Retour aux tickets
      </button>

    </div>

  </div>
</template>

<style scoped>
/* ==============================
   PAGE
============================== */

.ticket-page {
  min-height: 100vh;
  padding: 32px 40px 60px;
  background: #f5f7fb;
  color: #172033;
  box-sizing: border-box;
}

/* ==============================
   TOP
============================== */

.page-top {
  max-width: 1200px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  border: none;
  background: transparent;
  color: #526070;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
}

.back-button:hover {
  color: #2563eb;
}

.back-button span {
  font-size: 20px;
}

.page-context {
  color: #8a94a6;
  font-size: 13px;
}

/* ==============================
   CONTAINER
============================== */

.ticket-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* ==============================
   HEADER
============================== */

.ticket-header {
  background: white;
  border: 1px solid #e7ebf2;
  border-radius: 18px;
  padding: 30px 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 22px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
}

.ticket-id {
  display: inline-block;
  margin-bottom: 9px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #2563eb;
}

.ticket-header h1 {
  margin: 0;
  font-size: 28px;
  line-height: 1.25;
  color: #172033;
}

.ticket-subtitle {
  margin: 8px 0 0;
  color: #8a94a6;
  font-size: 14px;
}

/* ==============================
   STATUS
============================== */

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 15px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  background: #eef2ff;
  color: #4f46e5;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

/* ==============================
   LAYOUT
============================== */

.ticket-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 350px;
  gap: 22px;
  align-items: start;
}

.main-column,
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ==============================
   CARD
============================== */

.card {
  background: white;
  border: 1px solid #e7ebf2;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.035);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid #edf0f5;
  margin-bottom: 20px;
}

.section-title h2 {
  margin: 0;
  font-size: 16px;
  color: #172033;
}

.section-title span {
  display: block;
  margin-top: 3px;
  color: #98a1b2;
  font-size: 12px;
}

.section-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

/* ==============================
   DESCRIPTION
============================== */

.description {
  color: #566174;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-line;
}

/* ==============================
   INFO
============================== */

.info-list {
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 14px 0;
  border-bottom: 1px solid #edf0f5;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  color: #8a94a6;
  font-size: 13px;
}

.info-row strong {
  color: #293448;
  font-size: 13px;
  text-align: right;
}

.team-badge {
  padding: 5px 9px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #475569;
  font-size: 11px;
  font-weight: 700;
}

/* ==============================
   MINI STATUS
============================== */

.mini-status {
  padding: 5px 9px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

/* ==============================
   ACTIONS
============================== */

.action-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.action-button {
  width: 100%;
  border: 1px solid #e2e7ef;
  background: white;
  color: #344054;
  padding: 11px 13px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 9px;
  text-align: left;
  transition: all 0.2s ease;
}

.action-button:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
  transform: translateY(-1px);
}

.action-button span {
  width: 22px;
  text-align: center;
}

.primary-action {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.primary-action:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.success-action {
  color: #15803d;
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.warning-action {
  color: #b45309;
  background: #fffbeb;
  border-color: #fde68a;
}

.danger-action {
  color: #dc2626;
  background: #fef2f2;
  border-color: #fecaca;
}

.assign-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 5px;
}

.action-label {
  color: #8a94a6;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ==============================
   COMMENTS
============================== */

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 17px;
}

.comment {
  display: flex;
  gap: 12px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 11px;
  border: 1px solid #edf0f5;
}

.comment-avatar {
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
}

.comment-body {
  min-width: 0;
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.comment-header strong {
  color: #293448;
  font-size: 13px;
}

.comment-header small {
  color: #98a1b2;
  font-size: 11px;
}

.comment-body p {
  margin: 7px 0 0;
  color: #566174;
  font-size: 13px;
  line-height: 1.6;
}

/* ==============================
   EMPTY COMMENTS
============================== */

.empty-comments {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #8a94a6;
}

.empty-icon {
  width: 50px;
  height: 50px;
  margin-bottom: 12px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.empty-comments strong {
  color: #475569;
  font-size: 14px;
}

.empty-comments span {
  margin-top: 5px;
  font-size: 12px;
}

/* ==============================
   COMMENT FORM
============================== */

.comment-form {
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid #edf0f5;
}

.comment-form textarea {
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  border: 1px solid #dfe5ed;
  border-radius: 10px;
  padding: 13px;
  color: #293448;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  transition: 0.2s;
}

.comment-form textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.comment-form-footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.comment-form-footer span {
  color: #98a1b2;
  font-size: 11px;
}

.primary-button {
  border: none;
  border-radius: 9px;
  padding: 10px 17px;
  background: #2563eb;
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.primary-button:hover {
  background: #1d4ed8;
}

.primary-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* ==============================
   STATUS COLORS
============================== */

.status-open {
  background: #eff6ff;
  color: #2563eb;
}

.status-in_progress {
  background: #fff7ed;
  color: #c2410c;
}

.status-resolved {
  background: #f0fdf4;
  color: #15803d;
}

.status-escalated {
  background: #fff7ed;
  color: #b45309;
}

.status-closed {
  background: #f1f5f9;
  color: #64748b;
}

/* ==============================
   NOT FOUND
============================== */

.not-found {
  max-width: 550px;
  margin: 100px auto;
  padding: 50px 30px;
  background: white;
  border: 1px solid #e7ebf2;
  border-radius: 18px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
}

.not-found-icon {
  width: 55px;
  height: 55px;
  margin: 0 auto 18px;
  border-radius: 50%;
  background: #fef2f2;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

.not-found h2 {
  margin: 0;
  color: #172033;
}

.not-found p {
  margin: 10px 0 25px;
  color: #8a94a6;
  font-size: 14px;
  line-height: 1.6;
}

/* ==============================
   RESPONSIVE
============================== */

@media (max-width: 900px) {

  .ticket-page {
    padding: 22px 18px 40px;
  }

  .ticket-content {
    grid-template-columns: 1fr;
  }

  .ticket-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .sidebar {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 650px) {

  .page-top {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .ticket-header {
    padding: 23px;
  }

  .ticket-header h1 {
    font-size: 23px;
  }

  .card {
    padding: 20px;
  }

  .sidebar {
    display: flex;
  }

  .comment-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 3px;
  }

  .comment-form-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .comment-form-footer .primary-button {
    width: 100%;
  }
}
</style>