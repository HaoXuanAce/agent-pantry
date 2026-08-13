<template>
  <section class="border-b border-ink bg-acid" aria-label="项目概览">
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
  { label: '技能目录', value: `${props.skillCount} 个已审阅技能` },
  { label: '文件格式', value: '开放的 SKILL.md' },
  { label: '安装方式', value: '一条命令' },
  { label: '评测声明', value: '拒绝虚假评分' },
])
</script>
