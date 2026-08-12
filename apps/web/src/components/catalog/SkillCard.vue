<template>
  <button
    type="button"
    class="group relative flex min-h-96 flex-col overflow-hidden border-2 border-ink bg-paper p-0 text-left transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust"
    :aria-label="`Inspect ${skill.name}`"
    @click="emit('select', skill)"
  >
    <div class="flex w-full items-center justify-between border-b border-ink px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest">
      <span>{{ skill.index }}</span>
      <span class="flex items-center gap-2">
        <span class="size-2 rounded-full bg-acid ring-1 ring-ink"></span>
        {{ skill.maturity }} / {{ skill.evalCount }} cases
      </span>
    </div>

    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <div class="mb-8 flex items-start justify-between gap-5">
        <span class="inline-flex border border-ink bg-paper-deep px-2 py-1 font-mono text-xs font-semibold uppercase tracking-wide">
          {{ skill.phase }}
        </span>
        <ArrowUpRight class="size-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
      </div>

      <h3 class="text-3xl font-black uppercase leading-none tracking-tight">{{ skill.name }}</h3>
      <p class="mt-3 text-base font-semibold leading-snug">{{ skill.tagline }}</p>
      <p class="mt-5 text-sm leading-relaxed text-steel">{{ skill.description }}</p>

      <div class="mt-auto pt-8">
        <div class="mb-4 flex flex-wrap gap-2">
          <span v-for="tag in skill.tags.slice(0, 2)" :key="tag" class="font-mono text-xs text-steel">#{{ tag }}</span>
        </div>
        <div class="flex items-center justify-between border-t border-ink/30 pt-4 font-mono text-xs uppercase tracking-wide text-steel">
          <span>v{{ skill.version }}</span>
          <span>SKILL.md</span>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import type { Skill } from '../../types/skill'

defineProps<{
  skill: Skill
}>()

const emit = defineEmits<{
  select: [skill: Skill]
}>()
</script>
