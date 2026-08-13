<template>
  <div class="mb-8 border-2 border-ink bg-paper-deep">
    <div class="grid lg:grid-cols-[1fr_auto]">
      <label class="flex h-14 items-center gap-3 border-b border-ink px-4 lg:border-b-0 lg:border-r">
        <Search class="size-5 shrink-0 text-steel" aria-hidden="true" />
        <span class="sr-only">搜索技能</span>
        <input
          ref="searchInput"
          v-model="query"
          type="search"
          placeholder="按任务、输出、触发条件或停止条件搜索……"
          class="h-full w-full bg-transparent text-sm font-medium outline-none placeholder:text-steel/70"
        />
        <kbd class="hidden border border-ink/30 bg-paper px-2 py-1 font-mono text-xs text-steel sm:block">⌘ K</kbd>
      </label>

      <div class="flex divide-x divide-ink overflow-x-auto">
        <label class="relative flex h-14 min-w-44 items-center gap-2 px-4">
          <span class="font-mono text-xs font-semibold uppercase text-steel">阶段</span>
          <select v-model="phase" class="h-full flex-1 appearance-none bg-transparent pr-6 text-sm font-bold outline-none">
            <option v-for="item in phases" :key="item" :value="item">{{ item }}</option>
          </select>
          <ChevronDown class="pointer-events-none absolute right-3 size-4" aria-hidden="true" />
        </label>
        <label class="relative flex h-14 min-w-52 items-center gap-2 px-4">
          <span class="font-mono text-xs font-semibold uppercase text-steel">排序</span>
          <select v-model="sort" class="h-full flex-1 appearance-none bg-transparent pr-6 text-sm font-bold outline-none">
            <option>推荐排序</option>
            <option>名称排序</option>
          </select>
          <ChevronDown class="pointer-events-none absolute right-3 size-4" aria-hidden="true" />
        </label>
      </div>
    </div>
    <div class="flex items-center justify-between border-t border-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-steel">
      <span>已收录 {{ resultCount }} 个技能样本</span>
      <span>人工审阅 · 结构化评测 · 不宣称模型评分</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { ChevronDown, Search } from '@lucide/vue'

const query = defineModel<string>('query', { required: true })
const phase = defineModel<string>('phase', { required: true })
const sort = defineModel<string>('sort', { required: true })

defineProps<{
  phases: string[]
  resultCount: number
}>()

const searchInput = useTemplateRef<HTMLInputElement>('searchInput')

const focusSearch = (event: KeyboardEvent) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchInput.value?.focus()
  }
}

onMounted(() => window.addEventListener('keydown', focusSearch))
onBeforeUnmount(() => window.removeEventListener('keydown', focusSearch))
</script>
