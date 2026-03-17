<template>
  <div class="pa-4">
    <h1 class="text-h4 mb-4">Propostas</h1>

    <SharedProposalFilters
      v-model:status="filterStatus"
      v-model:search="filterSearch"
      class="mb-6"
    />

    <UiLoadingState v-if="loading" message="Carregando..." />
    <UiErrorState
      v-else-if="error"
      title="Algo deu errado"
      :message="errorMessage"
      retry-label="Tentar novamente"
      @retry="loadProposals"
    />
    <UiEmptyState
      v-else-if="proposals.length === 0"
      title="Nada por aqui"
      message="Não há propostas para exibir."
    />
    <v-row v-else>
      <v-col
        v-for="p in proposals"
        :key="p.id"
        cols="12"
        sm="6"
        md="4"
        class="mb-4"
      >
        <SharedProposalCard :proposal="p" @click="onCardClick(p)" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import type { Proposal, ProposalStatus } from "../../types/proposal";
import { fetchProposals } from "../../modules/proposals/services/proposalsService";
import { navigateTo, useHead } from "nuxt/app";
import { onMounted, ref, watch } from "vue";

const proposals = ref<Proposal[]>([]);
const loading = ref(false);
const error = ref(false);
const errorMessage = ref("Não foi possível carregar. Tente novamente.");
const filterStatus = ref<ProposalStatus | "">("");
const filterSearch = ref("");

useHead({ title: "Propostas" });

async function loadProposals() {
  loading.value = true;
  error.value = false;
  errorMessage.value = "Não foi possível carregar. Tente novamente.";
  try {
    const res = await fetchProposals({
      status: filterStatus.value || undefined,
      q: filterSearch.value || undefined,
    });
    proposals.value = res;
  } catch (e: any) {
    error.value = true;
    const msg = e?.data?.message || e?.message;
    if (msg) errorMessage.value = String(msg);
  } finally {
    loading.value = false;
  }
}

function onCardClick(proposal: Proposal) {
  navigateTo(`/proposals/${proposal.id}`);
}

onMounted(() => {
  loadProposals();
});

watch([filterStatus, filterSearch], () => {
  loadProposals();
});
</script>
