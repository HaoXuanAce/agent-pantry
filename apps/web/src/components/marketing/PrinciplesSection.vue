<template>
  <section id="principles" class="paper-grid border-b-2 border-ink">
    <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p class="font-mono text-xs font-semibold uppercase tracking-widest text-rust">The pantry rules</p>
          <h2 class="mt-5 text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl">Less prompt.<br />More method.</h2>
          <p class="mt-6 max-w-md leading-relaxed text-steel">
            A good skill does not make an agent sound smarter. It changes the sequence of work so mistakes become harder to make.
          </p>
        </div>

        <ol class="border-t-2 border-ink">
          <li v-for="(principle, index) in principles" :key="principle.title" class="group grid gap-4 border-b-2 border-ink py-7 sm:grid-cols-[4rem_1fr]">
            <span class="font-mono text-sm font-bold text-rust">0{{ index + 1 }}</span>
            <div>
              <h3 class="text-2xl font-black uppercase tracking-tight transition-transform group-hover:translate-x-2">{{ principle.title }}</h3>
              <p class="mt-2 max-w-xl text-sm leading-relaxed text-steel">{{ principle.description }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const principles = [
  {
    title: 'Evidence before confidence',
    description: 'Claims point to files, commands, diffs, or observed behavior. The agent states what it knows and what it inferred.',
  },
  {
    title: 'Stop conditions are features',
    description: 'Every workflow says when to pause, ask, or refuse. Autonomy without a boundary is just fast uncertainty.',
  },
  {
    title: 'Outputs have a contract',
    description: 'A skill defines what done looks like so results are reviewable, comparable, and useful to the next person.',
  },
  {
    title: 'Small enough to inspect',
    description: 'No mystery bundles. Read the complete instructions in minutes, keep the parts you trust, and fork the rest.',
  },
]
</script>

