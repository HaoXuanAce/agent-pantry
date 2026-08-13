<template>
  <section id="packs" class="border-b-2 border-ink bg-paper-deep">
    <div class="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div class="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p class="font-mono text-xs font-semibold uppercase tracking-widest text-rust">精心编排的任务包</p>
          <h2 class="mt-3 text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">从任务出发，<br />而不是从菜单出发。</h2>
        </div>
        <p class="max-w-md text-sm leading-relaxed text-steel">任务包围绕一个关键目标组合专业工作流。你可以安装整套工具，也可以先逐个审阅 Skill。</p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <article v-for="(pack, packIndex) in packs" :key="pack.id" class="group border-2 border-ink bg-paper p-5 transition-all hover:-translate-y-1 hover:shadow-lg sm:p-6">
          <div class="flex items-start justify-between gap-5">
            <div>
              <span class="font-mono text-xs font-bold uppercase tracking-widest text-rust">任务包-0{{ packIndex + 1 }} / {{ pack.skills.length }} 个技能</span>
              <h3 class="mt-3 text-3xl font-black uppercase leading-none tracking-tight">{{ pack.name }}</h3>
            </div>
            <PackageOpen class="size-7 shrink-0" aria-hidden="true" />
          </div>
          <p class="mt-4 max-w-xl text-sm leading-relaxed text-steel">{{ pack.description }}</p>
          <div class="mt-6 flex flex-wrap gap-2 border-t border-ink/30 pt-5">
            <button
              v-for="skill in skillsForPack(pack)"
              :key="skill.id"
              type="button"
              class="border border-ink bg-paper-deep px-3 py-2 font-mono text-xs font-semibold transition-colors hover:bg-acid"
              @click="emit('select', skill)"
            >
              {{ skill.name }}
            </button>
          </div>
          <code class="mt-5 block overflow-x-auto border border-ink bg-ink p-3 font-mono text-xs text-acid">npx agent-pantry pack add {{ pack.id }}</code>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PackageOpen } from '@lucide/vue'
import type { Skill, SkillPack } from '../../types/skill'

const props = defineProps<{
  packs: SkillPack[]
  skills: Skill[]
}>()

const emit = defineEmits<{
  select: [skill: Skill]
}>()

const skillsForPack = (pack: SkillPack) => props.skills.filter((skill) => pack.skills.includes(skill.id))
</script>
