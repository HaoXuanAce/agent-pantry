<template>
  <div v-if="skills.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    <SkillCard
      v-for="skill in skills"
      :key="skill.id"
      :skill="skill"
      @select="emit('select', $event)"
    />
  </div>
  <div v-else class="grid min-h-80 place-items-center border-2 border-dashed border-ink/40 bg-paper-deep px-6 text-center">
    <div>
      <SearchX class="mx-auto size-10 text-steel" aria-hidden="true" />
      <h3 class="mt-5 text-2xl font-black uppercase">Nothing in this drawer</h3>
      <p class="mt-2 text-sm text-steel">Try a broader job, agent, or search term.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchX } from '@lucide/vue'
import type { Skill } from '../../types/skill'
import SkillCard from './SkillCard.vue'

defineProps<{
  skills: Skill[]
}>()

const emit = defineEmits<{
  select: [skill: Skill]
}>()
</script>
