<template>
  <footer class="bg-paper-deep">
    <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
      <div class="flex flex-col justify-between gap-8 border-b border-ink pb-10 md:flex-row md:items-end">
        <div>
          <div class="flex items-center gap-3">
            <span class="grid size-10 place-items-center border-2 border-ink bg-acid font-mono text-sm font-bold shadow-md">AP</span>
            <span class="text-xl font-black uppercase">Agent Pantry</span>
          </div>
          <p class="mt-4 max-w-lg text-sm leading-relaxed text-steel">Open workflows for agents that do real work. Fork freely, inspect everything, contribute evidence.</p>
        </div>

        <div class="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs font-semibold uppercase tracking-wide">
          <a :href="repository.url" target="_blank" rel="noreferrer" class="hover:text-rust">GitHub</a>
          <a :href="`${repository.url}/blob/main/CONTRIBUTING.md`" target="_blank" rel="noreferrer" class="hover:text-rust">Contribute</a>
          <a :href="`${repository.url}/blob/main/LICENSE`" target="_blank" rel="noreferrer" class="hover:text-rust">MIT License</a>
        </div>
      </div>

      <div class="flex flex-col justify-between gap-3 pt-5 font-mono text-xs uppercase tracking-wide text-steel sm:flex-row">
        <span>Built in public · No telemetry</span>
        <span>Skills should earn their context.</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { repository } from '../../config'
</script>
