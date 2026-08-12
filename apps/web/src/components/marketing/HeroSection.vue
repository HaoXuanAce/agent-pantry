<template>
  <section class="paper-grid relative border-b border-ink">
    <div class="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl lg:grid-cols-12">
      <div class="relative flex flex-col justify-center border-ink px-5 py-20 sm:px-8 lg:col-span-7 lg:border-r lg:px-10 lg:py-28">
        <div class="reveal mb-8 flex items-center gap-3" style="animation-delay: 80ms">
          <span class="size-2 animate-pulse rounded-full bg-rust"></span>
          <span class="font-mono text-xs font-semibold uppercase tracking-widest">Inventory open · {{ skillCount }} human-reviewed skills</span>
        </div>

        <h1 class="reveal max-w-4xl text-6xl font-black uppercase leading-[0.86] tracking-tighter sm:text-7xl lg:text-8xl xl:text-9xl" style="animation-delay: 140ms">
          Your agent<br />deserves<br /><span class="text-rust">better</span> habits.
        </h1>

        <div class="reveal mt-10 grid max-w-2xl gap-8 sm:grid-cols-[1fr_auto] sm:items-end" style="animation-delay: 220ms">
          <p class="max-w-xl text-lg leading-relaxed text-steel sm:text-xl">
            Field-tested workflows for coding agents. Inspect the method, install the folder, and get repeatable work instead of another lucky prompt.
          </p>
          <a
            href="#catalog"
            class="group inline-flex h-14 items-center justify-center gap-3 border-2 border-ink bg-acid px-6 font-mono text-sm font-bold uppercase shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            Browse skills
            <ArrowDownRight class="size-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div class="relative hidden min-h-full overflow-hidden bg-ink text-paper lg:col-span-5 lg:block">
        <div class="absolute inset-0 opacity-25 paper-grid"></div>
        <div class="hero-orbit absolute left-1/2 top-1/2 size-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full"></div>

        <div class="absolute inset-10 flex flex-col justify-between border border-paper/30 p-6">
          <div class="flex items-start justify-between font-mono text-xs uppercase tracking-widest text-paper/60">
            <span>Context quality monitor</span>
            <span>AP / LIVE</span>
          </div>

          <div class="relative mx-auto grid size-56 place-items-center rounded-full border border-paper/30 bg-ink/80 backdrop-blur-sm">
            <div class="scanline absolute inset-y-0 w-20"></div>
            <div class="text-center">
              <span class="block font-mono text-6xl font-bold text-acid">{{ skillCount }}</span>
              <span class="mt-1 block font-mono text-xs uppercase tracking-widest text-paper/60">Open workflows</span>
            </div>
          </div>

          <div class="grid grid-cols-3 border border-paper/30 bg-ink">
            <div class="border-r border-paper/30 p-3">
              <span class="block font-mono text-lg font-bold text-acid">{{ skillCount }}</span>
              <span class="font-mono text-xs uppercase text-paper/50">Skills</span>
            </div>
            <div class="border-r border-paper/30 p-3">
              <span class="block font-mono text-lg font-bold text-acid">05</span>
              <span class="font-mono text-xs uppercase text-paper/50">Agents</span>
            </div>
            <div class="p-3">
              <span class="block font-mono text-lg font-bold text-acid">MIT</span>
              <span class="font-mono text-xs uppercase text-paper/50">License</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowDownRight } from '@lucide/vue'

defineProps<{
  skillCount: number
}>()
</script>
