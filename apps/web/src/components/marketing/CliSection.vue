<template>
  <section id="cli" class="border-y-2 border-ink bg-ink text-paper">
    <div class="mx-auto grid max-w-7xl lg:grid-cols-12">
      <div class="border-paper/25 px-5 py-16 sm:px-8 lg:col-span-5 lg:border-r lg:px-10 lg:py-24">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-acid">最短路径</p>
        <h2 class="mt-5 text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl">一条命令，<br />为智能体装好技能。</h2>
        <p class="mt-6 max-w-lg leading-relaxed text-paper/60">
          使用开放的 Skills CLI 直接从 GitHub 安装。本仓库也提供透明、专用的命令行工具，支持试运行、差异查看、移除和精选任务包。
        </p>

        <div class="mt-10 flex flex-wrap gap-2">
          <span v-for="agentName in agents" :key="agentName" class="border border-paper/30 px-3 py-2 font-mono text-xs text-paper/70">
            {{ agentName }}
          </span>
        </div>
      </div>

      <div class="flex items-center px-5 py-16 sm:px-8 lg:col-span-7 lg:px-10 lg:py-24">
        <div class="w-full border border-paper/30 bg-black shadow-xl">
          <div class="flex h-11 items-center justify-between border-b border-paper/20 px-4">
            <div class="flex gap-2" aria-hidden="true">
              <span class="size-2.5 rounded-full bg-rust"></span>
              <span class="size-2.5 rounded-full bg-paper/30"></span>
              <span class="size-2.5 rounded-full bg-acid"></span>
            </div>
            <span class="font-mono text-xs uppercase tracking-widest text-paper/40">pantry — zsh</span>
          </div>

          <div class="space-y-5 p-5 font-mono text-sm sm:p-7">
            <div>
              <span class="mr-3 text-acid">$</span>
              <span>npx skills add {{ repository.owner }}/{{ repository.name }} --skill bug-triage</span>
            </div>
            <div class="space-y-2 border-l border-paper/20 pl-5 text-paper/55">
              <p><span class="text-acid">#</span> 源自 GitHub · 纯 SKILL.md 目录</p>
              <p><span class="text-acid">#</span> 无需 Agent Pantry 账号或 API 密钥</p>
              <p><span class="text-acid">#</span> 安装前可审阅每一个文件</p>
            </div>
            <div class="flex items-center justify-between gap-4 border-t border-paper/20 pt-5">
              <code class="overflow-hidden text-ellipsis whitespace-nowrap text-acid">npx skills add {{ repository.owner }}/{{ repository.name }}</code>
              <button type="button" class="inline-flex shrink-0 items-center gap-2 border border-paper/30 px-3 py-2 text-xs font-bold uppercase hover:border-acid hover:text-acid" @click="copyCommand">
                <Check v-if="copyState === 'copied'" class="size-4" aria-hidden="true" />
                <Copy v-else class="size-4" aria-hidden="true" />
                {{ copyState === 'copied' ? '已复制' : copyState === 'failed' ? '复制失败' : '复制' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, shallowRef } from 'vue'
import { Check, Copy } from '@lucide/vue'
import { repository } from '../../config'

const agents = ['Codex', 'Claude Code', 'Cursor', 'Gemini CLI', 'Copilot']
const copyState = shallowRef<'idle' | 'copied' | 'failed'>('idle')
let copyTimer: number | undefined

const copyCommand = async () => {
  try {
    await navigator.clipboard.writeText(`npx skills add ${repository.owner}/${repository.name}`)
    copyState.value = 'copied'
  } catch {
    copyState.value = 'failed'
  }
  window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => {
    copyState.value = 'idle'
  }, 1800)
}

onBeforeUnmount(() => window.clearTimeout(copyTimer))
</script>
