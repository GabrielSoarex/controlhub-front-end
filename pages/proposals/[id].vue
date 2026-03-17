<template>
  <div class="pa-4">
    <UiLoadingState
      v-if="loading"
      message="Carregando proposta..."
    />
    <UiErrorState
      v-else-if="error"
      title="Algo deu errado"
      :message="errorMessage"
      retry-label="Tentar novamente"
      @retry="loadProposal"
    />
    <UiEmptyState
      v-else-if="!proposal"
      title="Proposta não encontrada"
      message="A proposta que você buscou não existe ou foi removida."
      action-label="Voltar à listagem"
      @action="goToList"
    />
    <div
      v-else
      class="detail-content"
    >
      <v-btn
        variant="text"
        color="primary"
        class="mb-4"
        @click="goToList"
      >
        <v-icon start icon="mdi-arrow-left" />
        Voltar
      </v-btn>
      <SharedProposalCard :proposal="proposal">
        <template #description>
          <div class="detail-metadata">
            <v-chip
              :color="statusColor"
              size="small"
              variant="tonal"
            >
              {{ statusLabel }}
            </v-chip>
            <span class="text-caption text-medium-emphasis">{{ formattedDate }}</span>
          </div>
          <p class="text-body1 text-medium-emphasis mb-0">
            {{ proposal.description }}
          </p>
        </template>
      </SharedProposalCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Proposal, ProposalStatus } from '../../types/proposal'

import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { navigateTo, useHead } from 'nuxt/app'
import { fetchProposalById } from '../../modules/proposals/services/proposalsService'

const route = useRoute()
const proposal = ref<Proposal | null>(null)
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('Não foi possível carregar. Tente novamente.')

const id = computed(() => {
  const p = route.params.id
  return Array.isArray(p) ? p[0] ?? '' : (p ?? '')
})

useHead({
  title: computed(() => proposal.value?.title ?? 'Detalhe da proposta')
})

const statusLabels: Record<ProposalStatus, string> = {
  active: 'Ativo',
  draft: 'Rascunho',
  closed: 'Encerrado'
}
const statusColors: Record<ProposalStatus, string> = {
  active: 'success',
  draft: 'warning',
  closed: 'grey'
}

const statusLabel = computed(() =>
  proposal.value ? (statusLabels[proposal.value.status] ?? proposal.value.status) : ''
)
const statusColor = computed(() =>
  proposal.value ? (statusColors[proposal.value.status] ?? 'grey') : 'grey'
)
const formattedDate = computed(() => {
  if (!proposal.value) return ''
  try {
    return new Date(proposal.value.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return proposal.value.createdAt
  }
})

async function loadProposal() {
  const currentId = id.value
  if (!currentId) {
    proposal.value = null
    return
  }
  loading.value = true
  error.value = false
  errorMessage.value = 'Não foi possível carregar. Tente novamente.'
  try {
    const res = await fetchProposalById(currentId)
    proposal.value = res
  } catch (e: any) {
    error.value = true
    const msg = e?.data?.message ?? e?.message
    if (msg) errorMessage.value = String(msg)
  } finally {
    loading.value = false
  }
}

function goToList() {
  navigateTo('/proposals')
}

onMounted(() => {
  loadProposal()
})

watch(id, () => {
  loadProposal()
})
</script>

<style scoped>
.detail-content {
  max-width: 960px;
}

.detail-metadata {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
</style>
