<template>
  <div
    v-if="$slots.default"
    role="alert"
  >
    <slot />
  </div>
  <div
    v-else
    class="d-flex flex-column align-center justify-center py-8 px-4 text-center"
    role="alert"
  >
    <span class="text-h6 mb-2">{{ title }}</span>
    <span class="text-body2 text-medium-emphasis mb-4">{{ message }}</span>
    <div class="d-flex flex-wrap justify-center gap-2">
      <slot name="actions">
        <v-btn
          color="primary"
          variant="tonal"
          :aria-label="retryLabel"
          @click="emit('retry')"
        >
          {{ retryLabel }}
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
    retryLabel?: string
  }>(),
  {
    title: 'Algo deu errado',
    message: 'Não foi possível carregar. Tente novamente.',
    retryLabel: 'Tentar novamente'
  }
)

const emit = defineEmits<{
  retry: []
}>()
</script>
