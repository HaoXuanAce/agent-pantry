<template>
  <header class="relative z-40 border-b border-ink bg-paper">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
      <a href="#" class="group flex items-center gap-3" aria-label="Agent Pantry home">
        <span class="grid size-9 place-items-center border-2 border-ink bg-acid shadow-md transition-transform group-hover:-translate-y-0.5">
          <span class="font-mono text-sm font-bold">AP</span>
        </span>
        <span>
          <span class="block text-sm font-black uppercase leading-none tracking-tight">Agent Pantry</span>
          <span class="mt-1 block font-mono text-xs leading-none text-steel">FIELD KIT / 01</span>
        </span>
      </a>

      <nav class="hidden items-center gap-7 font-mono text-xs font-semibold uppercase tracking-wide md:flex" aria-label="Primary navigation">
        <a href="#catalog" class="border-b border-transparent py-1 hover:border-ink">Catalog</a>
        <a href="#cli" class="border-b border-transparent py-1 hover:border-ink">CLI</a>
        <a href="#principles" class="border-b border-transparent py-1 hover:border-ink">Manifesto</a>
      </nav>

      <a
        :href="repository.url"
        target="_blank"
        rel="noreferrer"
        class="inline-flex h-10 items-center gap-2 border-2 border-ink bg-ink px-4 font-mono text-xs font-bold uppercase tracking-wide text-paper transition-colors hover:bg-acid hover:text-ink"
      >
        <Star class="size-4" aria-hidden="true" />
        <span class="hidden sm:inline">Star the pantry</span>
        <span class="sm:hidden">Star</span>
      </a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Star } from '@lucide/vue'
import { repository } from '../../config'
</script>
