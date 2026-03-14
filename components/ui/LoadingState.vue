<template>
  <div
    v-if="$slots.default"
    role="status"
    aria-live="polite"
    :aria-label="message"
  >
    <slot />
  </div>
  <div
    v-else
    class="d-flex flex-column align-center justify-center py-8"
    role="status"
    aria-live="polite"
    :aria-label="message"
  >
    <v-progress-circular
      indeterminate
      color="primary"
      size="48"
      width="3"
      class="mb-4"
    />
    <span class="text-body1 text-medium-emphasis">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: 'Carregando...'
  }
)
</script>
