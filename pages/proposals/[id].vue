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
    <div v-else>
      <v-btn
        variant="text"
        color="primary"
        class="mb-4"
        @click="goToList"
      >
        <v-icon start icon="mdi-arrow-left" />
        Voltar
      </v-btn>
      <v-card class="pa-4">
        <v-card-title class="text-h5 text-wrap">
          {{ proposal.title }}
        </v-card-title>
        <v-card-subtitle class="d-flex align-center gap-2 flex-wrap mt-2">
          <v-chip
            :color="statusColor"
            size="small"
            variant="tonal"
          >
            {{ statusLabel }}
          </v-chip>
          <span class="text-caption text-medium-emphasis">{{ formattedDate }}</span>
        </v-card-subtitle>
        <v-card-text class="mt-4">
          <p class="text-body1 text-medium-emphasis">
            {{ proposal.description }}
          </p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Proposal, ProposalStatus } from '~/types/proposal'
import { fetchProposalById } from '~/modules/proposals/services/proposalsService'
import { computed, onMounted, ref, watch } from 'vue'

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
