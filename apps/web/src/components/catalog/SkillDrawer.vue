<template>
  <Transition name="drawer">
    <div v-if="skill" class="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm" role="presentation" @click.self="emit('close')">
      <aside
        ref="drawerPanel"
        class="drawer-panel absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col overflow-y-auto border-l-2 border-ink bg-paper shadow-2xl"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${skill.id}-title`"
      >
        <div class="sticky top-0 z-10 flex items-center justify-between border-b-2 border-ink bg-acid px-5 py-4 sm:px-7">
          <span class="font-mono text-xs font-bold uppercase tracking-widest">Specimen {{ skill.index }}</span>
          <button
            ref="closeButton"
            type="button"
            class="grid size-10 place-items-center border-2 border-ink bg-paper transition-colors hover:bg-ink hover:text-paper"
            aria-label="Close skill details"
            @click="emit('close')"
          >
            <X class="size-5" aria-hidden="true" />
          </button>
        </div>

        <div class="p-5 sm:p-8">
          <div class="flex flex-wrap items-center gap-3 font-mono text-xs font-semibold uppercase tracking-wide">
            <span class="border border-ink bg-paper-deep px-2 py-1">{{ skill.phase }}</span>
            <span class="flex items-center gap-2"><span class="size-2 rounded-full bg-acid ring-1 ring-ink"></span>{{ skill.maturity }}</span>
            <span class="text-steel">v{{ skill.version }}</span>
          </div>

          <h2 :id="`${skill.id}-title`" class="mt-8 text-5xl font-black uppercase leading-none tracking-tighter sm:text-6xl">
            {{ skill.name }}
          </h2>
          <p class="mt-5 text-xl font-semibold leading-snug">{{ skill.tagline }}</p>
          <p class="mt-5 max-w-xl leading-relaxed text-steel">{{ skill.description }}</p>

          <div class="mt-10 grid grid-cols-2 border-2 border-ink sm:grid-cols-3">
            <div class="border-b border-r border-ink p-4 sm:border-b-0">
              <span class="font-mono text-xs uppercase text-steel">Maturity</span>
              <strong class="mt-2 block font-mono text-sm uppercase">{{ skill.maturity }}</strong>
            </div>
            <div class="border-b border-ink p-4 sm:border-b-0 sm:border-r">
              <span class="font-mono text-xs uppercase text-steel">Eval scenarios</span>
              <strong class="mt-1 block text-3xl font-black">{{ skill.evalCount }}</strong>
            </div>
            <div class="col-span-2 p-4 sm:col-span-1">
              <span class="font-mono text-xs uppercase text-steel">Claim</span>
              <strong class="mt-2 block font-mono text-sm">Human reviewed</strong>
            </div>
          </div>

          <p class="mt-3 border-l-2 border-rust pl-3 font-mono text-xs leading-relaxed text-steel">
            “Reviewed” means the instructions and authored eval scenarios passed repository checks. It is not a model benchmark score.
          </p>

          <section class="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 class="font-mono text-xs font-bold uppercase tracking-widest text-steel">Use it when</h3>
              <ul class="mt-4 space-y-3">
                <li v-for="trigger in skill.triggers" :key="trigger" class="flex gap-3 text-sm leading-relaxed">
                  <ArrowRight class="mt-0.5 size-4 shrink-0 text-rust" aria-hidden="true" />
                  <span>{{ trigger }}</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-mono text-xs font-bold uppercase tracking-widest text-steel">Stop and ask</h3>
              <ul class="mt-4 space-y-3">
                <li v-for="condition in skill.stopConditions" :key="condition" class="flex gap-3 text-sm leading-relaxed">
                  <OctagonAlert class="mt-0.5 size-4 shrink-0 text-rust" aria-hidden="true" />
                  <span>{{ condition }}</span>
                </li>
              </ul>
            </div>
          </section>

          <section class="mt-10">
            <h3 class="font-mono text-xs font-bold uppercase tracking-widest text-steel">Expected output</h3>
            <ol class="mt-4 divide-y divide-ink border-y border-ink">
              <li v-for="(output, index) in skill.outputs" :key="output" class="flex items-center gap-4 py-4">
                <span class="font-mono text-xs text-rust">0{{ index + 1 }}</span>
                <span class="font-bold">{{ output }}</span>
              </li>
            </ol>
          </section>

          <section class="mt-10">
            <h3 class="font-mono text-xs font-bold uppercase tracking-widest text-steel">Runs where you work</h3>
            <div class="mt-4 flex flex-wrap gap-2">
              <span v-for="item in skill.supports" :key="item" class="border border-ink px-3 py-2 font-mono text-xs font-semibold">
                {{ item }}
              </span>
            </div>
          </section>

          <section class="mt-10 border-2 border-ink bg-ink text-paper">
            <div class="flex items-center justify-between border-b border-paper/30 px-4 py-3">
              <span class="font-mono text-xs uppercase tracking-widest text-paper/60">Install locally</span>
              <button type="button" class="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-acid" @click="copyInstallCommand">
                <Check v-if="copyState === 'copied'" class="size-4" aria-hidden="true" />
                <Copy v-else class="size-4" aria-hidden="true" />
                {{ copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Copy failed' : 'Copy' }}
              </button>
            </div>
            <code class="block overflow-x-auto p-4 font-mono text-sm text-acid">npx skills add {{ repository.owner }}/{{ repository.name }} --skill {{ skill.id }}</code>
          </section>

          <a
            :href="`${repository.url}/tree/main/skills/${skill.id}`"
            target="_blank"
            rel="noreferrer"
            class="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 border-2 border-ink bg-paper font-mono text-xs font-bold uppercase tracking-wide transition-colors hover:bg-rust hover:text-white"
          >
            Read the complete field notes
            <ExternalLink class="size-4" aria-hidden="true" />
          </a>
        </div>
      </aside>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { ArrowRight, Check, Copy, ExternalLink, OctagonAlert, X } from '@lucide/vue'
import { repository } from '../../config'
import type { Skill } from '../../types/skill'

const props = defineProps<{
  skill: Skill | null
}>()

const emit = defineEmits<{
  close: []
}>()

const copyState = shallowRef<'idle' | 'copied' | 'failed'>('idle')
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')
const drawerPanel = useTemplateRef<HTMLElement>('drawerPanel')
let copyTimer: number | undefined
let previousFocus: HTMLElement | null = null

const copyInstallCommand = async () => {
  if (!props.skill) return

  try {
    await navigator.clipboard.writeText(`npx skills add ${repository.owner}/${repository.name} --skill ${props.skill.id}`)
    copyState.value = 'copied'
  } catch {
    copyState.value = 'failed'
  }
  window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => {
    copyState.value = 'idle'
  }, 1800)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.skill) emit('close')
  if (event.key !== 'Tab' || !props.skill || !drawerPanel.value) return

  const focusable = [...drawerPanel.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
  const first = focusable[0]
  const last = focusable.at(-1)
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => props.skill,
  async (skill) => {
    document.body.style.overflow = skill ? 'hidden' : ''
    copyState.value = 'idle'

    if (skill) {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
      await nextTick()
      closeButton.value?.focus()
    } else {
      previousFocus?.focus()
      previousFocus = null
    }
  },
)

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.clearTimeout(copyTimer)
  document.body.style.overflow = ''
})
</script>
