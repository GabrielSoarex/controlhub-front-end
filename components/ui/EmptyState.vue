<template>
  <div
    v-if="$slots.default"
    role="status"
  >
    <slot />
  </div>
  <div
    v-else
    class="d-flex flex-column align-center justify-center py-8 px-4 text-center"
    role="status"
  >
    <slot name="icon">
      <v-icon
        icon="mdi-inbox-outline"
        size="64"
        color="grey"
        class="mb-4"
      />
    </slot>
    <span class="text-h6 mb-2">{{ title }}</span>
    <span class="text-body2 text-medium-emphasis mb-4">{{ message }}</span>
    <div
      v-if="actionLabel || $slots.actions"
      class="d-flex flex-wrap justify-center gap-2"
    >
      <slot name="actions">
        <v-btn
          v-if="actionLabel"
          color="primary"
          variant="tonal"
          :aria-label="actionLabel"
          @click="emit('action')"
        >
          {{ actionLabel }}
        </v-btn>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
    actionLabel?: string
  }>(),
  {
    title: 'Nada por aqui',
    message: 'Não há itens para exibir.',
    actionLabel: undefined
  }
)

const emit = defineEmits<{
  action: []
}>()
</script>
