<template>
  <div class="mb-8 border-2 border-ink bg-paper-deep">
    <div class="grid lg:grid-cols-[1fr_auto]">
      <label class="flex h-14 items-center gap-3 border-b border-ink px-4 lg:border-b-0 lg:border-r">
        <Search class="size-5 shrink-0 text-steel" aria-hidden="true" />
        <span class="sr-only">Search skills</span>
        <input
          ref="searchInput"
          v-model="query"
          type="search"
          placeholder="Search by job, output, trigger, or stop condition..."
          class="h-full w-full bg-transparent text-sm font-medium outline-none placeholder:text-steel/70"
        />
        <kbd class="hidden border border-ink/30 bg-paper px-2 py-1 font-mono text-xs text-steel sm:block">⌘ K</kbd>
      </label>

      <div class="flex divide-x divide-ink overflow-x-auto">
        <label class="relative flex h-14 min-w-44 items-center gap-2 px-4">
          <span class="font-mono text-xs font-semibold uppercase text-steel">Phase</span>
          <select v-model="phase" class="h-full flex-1 appearance-none bg-transparent pr-6 text-sm font-bold outline-none">
            <option v-for="item in phases" :key="item" :value="item">{{ item }}</option>
          </select>
          <ChevronDown class="pointer-events-none absolute right-3 size-4" aria-hidden="true" />
        </label>
        <label class="relative flex h-14 min-w-52 items-center gap-2 px-4">
          <span class="font-mono text-xs font-semibold uppercase text-steel">Order</span>
          <select v-model="sort" class="h-full flex-1 appearance-none bg-transparent pr-6 text-sm font-bold outline-none">
            <option>Recommended</option>
            <option>A–Z</option>
          </select>
          <ChevronDown class="pointer-events-none absolute right-3 size-4" aria-hidden="true" />
        </label>
      </div>
    </div>
    <div class="flex items-center justify-between border-t border-ink px-4 py-2 font-mono text-xs uppercase tracking-wide text-steel">
      <span>{{ resultCount }} specimens on file</span>
      <span>Human reviewed · structured evals · no model score claimed</span>
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
