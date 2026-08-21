<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { tickets } from '../data/tickets'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const title = ref('')
const description = ref('')
const team = ref('team-support')

function createTicket() {

  if (
    !title.value.trim() ||
    !description.value.trim()
  ) {
    return
  }

  const newId =
    Math.max(
      ...tickets.map(ticket => ticket.id),
      0
    ) + 1

  tickets.push({
    id: newId,
    title: title.value.trim(),
    description: description.value.trim(),
    status: 'OPEN',
    client: authStore.user ?? '',
    team: team.value,
    comments: []
  })

  router.push('/tickets')
}
</script>

<template>
  <div class="create-ticket-page">

    <!-- Header -->
    <div class="page-header">

      <div>
        <div class="breadcrumb">
          Tickets / Nouveau ticket
        </div>

        <h1>Créer un ticket</h1>

        <p>
          Décrivez votre problème afin que notre équipe puisse
          vous aider rapidement.
        </p>
      </div>

    </div>

    <!-- Form -->
    <div class="form-card">

      <div class="form-header">
        <div class="form-icon">
          +
        </div>

        <div>
          <h2>Nouveau ticket</h2>
          <p>
            Renseignez les informations du ticket.
          </p>
        </div>
      </div>

      <div class="form-content">

        <!-- Title -->
        <div class="form-group">

          <label for="title">
            Titre
            <span>*</span>
          </label>

          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="Ex : Problème de connexion"
          />

          <small>
            Donnez un titre court et précis à votre problème.
          </small>

        </div>

        <!-- Description -->
        <div class="form-group">

          <label for="description">
            Description
            <span>*</span>
          </label>

          <textarea
            id="description"
            v-model="description"
            rows="6"
            placeholder="Décrivez votre problème en détail..."
          />

          <small>
            Plus votre description est précise, plus nous pourrons
            traiter votre demande rapidement.
          </small>

        </div>

        <!-- Team -->
        <div class="form-group">

          <label for="team">
            Équipe
            <span>*</span>
          </label>

          <select
            id="team"
            v-model="team"
          >
            <option value="team-support">
              Équipe Support
            </option>

            <option value="team-network">
              Équipe Réseau
            </option>
          </select>

        </div>

      </div>

      <!-- Footer -->
      <div class="form-footer">

        <button
          type="button"
          class="cancel-button"
          @click="router.push('/tickets')"
        >
          Annuler
        </button>

        <button
          type="button"
          class="primary-button"
          :disabled="
            !title.trim() ||
            !description.trim()
          "
          @click="createTicket"
        >
          <span>+</span>
          Créer le ticket
        </button>

      </div>

    </div>

  </div>
</template>

<style scoped>
.create-ticket-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px;
}

/* =========================
   Header
========================= */

.page-header {
  margin-bottom: 28px;
}

.breadcrumb {
  margin-bottom: 10px;

  font-size: 13px;
  color: #9ca3af;
}

.page-header h1 {
  margin: 0 0 8px;

  font-size: 30px;
  font-weight: 700;

  color: #111827;
}

.page-header p {
  margin: 0;

  color: #6b7280;

  font-size: 15px;
  line-height: 1.5;
}

/* =========================
   Form Card
========================= */

.form-card {
  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 16px;

  overflow: hidden;

  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

/* =========================
   Form Header
========================= */

.form-header {
  display: flex;
  align-items: center;

  gap: 14px;

  padding: 24px;

  border-bottom: 1px solid #e5e7eb;
}

.form-icon {
  width: 45px;
  height: 45px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;

  background: #111827;
  color: white;

  font-size: 24px;
  font-weight: 400;
}

.form-header h2 {
  margin: 0 0 4px;

  font-size: 18px;
  font-weight: 650;

  color: #111827;
}

.form-header p {
  margin: 0;

  font-size: 13px;

  color: #6b7280;
}

/* =========================
   Form Content
========================= */

.form-content {
  padding: 28px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;

  margin-bottom: 8px;

  font-size: 14px;
  font-weight: 600;

  color: #374151;
}

.form-group label span {
  color: #dc2626;
}

/* Inputs */

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;

  box-sizing: border-box;

  border: 1px solid #d1d5db;

  border-radius: 9px;

  padding: 11px 13px;

  background: white;

  color: #111827;

  font-family: inherit;

  font-size: 14px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input {
  height: 44px;
}

.form-group textarea {
  resize: vertical;

  min-height: 130px;

  line-height: 1.5;
}

.form-group select {
  height: 44px;

  cursor: pointer;
}

/* Focus */

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #6b7280;

  box-shadow:
    0 0 0 3px rgba(107, 114, 128, 0.1);
}

/* Placeholder */

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

/* Help text */

.form-group small {
  display: block;

  margin-top: 6px;

  color: #9ca3af;

  font-size: 12px;
}

/* =========================
   Footer
========================= */

.form-footer {
  display: flex;

  justify-content: flex-end;

  gap: 12px;

  padding: 20px 28px;

  background: #fafafa;

  border-top: 1px solid #e5e7eb;
}

/* Cancel */

.cancel-button {
  padding: 10px 18px;

  border: 1px solid #d1d5db;

  border-radius: 9px;

  background: white;

  color: #374151;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: background 0.2s ease;
}

.cancel-button:hover {
  background: #f3f4f6;
}

/* Primary */

.primary-button {
  display: flex;
  align-items: center;

  gap: 7px;

  padding: 10px 18px;

  border: none;

  border-radius: 9px;

  background: #111827;

  color: white;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    opacity 0.2s ease;
}

.primary-button:hover:not(:disabled) {
  background: #1f2937;
}

.primary-button:disabled {
  opacity: 0.45;

  cursor: not-allowed;
}

.primary-button span {
  font-size: 18px;
  line-height: 1;
}

/* =========================
   Responsive
========================= */

@media (max-width: 700px) {
  .create-ticket-page {
    padding: 20px;
  }

  .page-header h1 {
    font-size: 25px;
  }

  .form-content {
    padding: 20px;
  }

  .form-footer {
    padding: 16px 20px;
  }

  .primary-button,
  .cancel-button {
    flex: 1;

    justify-content: center;
  }
}
</style>