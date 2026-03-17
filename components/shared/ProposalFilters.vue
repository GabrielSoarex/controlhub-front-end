<template>
  <div class="d-flex flex-wrap align-center gap-4">
    <slot name="prepend" />
    <v-select
      :model-value="status"
      :items="statusItems"
      item-title="label"
      item-value="value"
      label="Status"
      density="comfortable"
      hide-details
      class="flex-grow-0"
      style="min-width: 160px"
      @update:model-value="emit('update:status', $event)"
    />
    <v-text-field
      :model-value="search"
      label="Buscar propostas"
      placeholder="Buscar propostas"
      density="comfortable"
      hide-details
      clearable
      class="flex-grow-1"
      style="min-width: 200px"
      @update:model-value="emit('update:search', $event ?? '')"
    />
    <slot name="append" />
  </div>
</template>

<script setup lang="ts">
import type { ProposalStatus } from '../../types/proposal'

withDefaults(
  defineProps<{
    status?: ProposalStatus | ''
    search?: string
  }>(),
  {
    status: '',
    search: ''
  }
)

const emit = defineEmits<{
  'update:status': [value: ProposalStatus | '']
  'update:search': [value: string]
}>()

const statusItems = [
  { label: 'Todos', value: '' },
  { label: 'Ativo', value: 'active' as ProposalStatus },
  { label: 'Rascunho', value: 'draft' as ProposalStatus },
  { label: 'Encerrado', value: 'closed' as ProposalStatus }
]
</script>
