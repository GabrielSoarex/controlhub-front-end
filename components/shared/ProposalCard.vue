<template>
  <v-card
    class="pa-4"
    :class="{ 'cursor-pointer': !!$attrs.onClick }"
    v-bind="$attrs"
    @click="handleClick"
  >
    <v-card-title class="text-wrap px-0 pt-0">
      <slot name="title">
        {{ proposal.title }}
      </slot>
    </v-card-title>
    <v-card-subtitle class="px-0 d-flex align-center gap-2 flex-wrap">
      <v-chip
        :color="statusColor"
        size="small"
        variant="tonal"
      >
        {{ statusLabel }}
      </v-chip>
      <span class="text-caption text-medium-emphasis">{{ formattedDate }}</span>
    </v-card-subtitle>
    <v-card-text class="px-0">
      <slot name="description">
        <span class="text-body2 text-medium-emphasis line-clamp-2">{{ proposal.description }}</span>
      </slot>
    </v-card-text>
    <v-card-actions
      v-if="$slots.actions"
      class="px-0 pb-0 pt-2"
    >
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Proposal, ProposalStatus } from '../../types/proposal'

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  proposal: Proposal
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function getStatusLabel (status: ProposalStatus): string {
  const labels: Record<ProposalStatus, string> = {
    active: 'Ativo',
    draft: 'Rascunho',
    closed: 'Encerrado'
  }
  return labels[status] ?? status
}

function getStatusColor (status: ProposalStatus): string {
  const colors: Record<ProposalStatus, string> = {
    active: 'success',
    draft: 'warning',
    closed: 'grey'
  }
  return colors[status] ?? 'grey'
}

const formattedDate = computed(() => {
  try {
    const d = new Date(props.proposal.createdAt)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch {
    return props.proposal.createdAt
  }
})

const statusLabel = computed(() => getStatusLabel(props.proposal.status))
const statusColor = computed(() => getStatusColor(props.proposal.status))

function handleClick (event: MouseEvent) {
  emit('click', event)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
