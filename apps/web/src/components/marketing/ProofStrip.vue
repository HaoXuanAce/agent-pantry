<template>
  <section class="border-b border-ink bg-acid" aria-label="Project facts">
    <div class="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-ink border-x border-ink md:grid-cols-4 md:divide-y-0">
      <div v-for="fact in facts" :key="fact.label" class="px-5 py-5 sm:px-8">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest">{{ fact.label }}</p>
        <p class="mt-2 text-lg font-black uppercase">{{ fact.value }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  skillCount: number
}>()

const facts = computed(() => [
  { label: 'Inventory', value: `${props.skillCount} reviewed skills` },
  { label: 'Format', value: 'Open SKILL.md' },
  { label: 'Install', value: 'One command' },
  { label: 'Claims', value: 'No fake scores' },
])
</script>
