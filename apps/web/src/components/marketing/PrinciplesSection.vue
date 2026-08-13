<template>
  <section id="principles" class="paper-grid border-b-2 border-ink">
    <div class="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p class="font-mono text-xs font-semibold uppercase tracking-widest text-rust">Agent Pantry 准则</p>
          <h2 class="mt-5 text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl">少一点提示词，<br />多一点方法论。</h2>
          <p class="mt-6 max-w-md leading-relaxed text-steel">
            好的 Skill 不是让智能体听起来更聪明，而是重塑工作顺序，让错误更难发生。
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
    title: '证据先于信心',
    description: '每项结论都应指向文件、命令、差异或实际观察；智能体必须说明哪些是事实，哪些是推断。',
  },
  {
    title: '停止条件也是功能',
    description: '每个工作流都要说明何时暂停、询问或拒绝。没有边界的自主，只是在更快地制造不确定性。',
  },
  {
    title: '输出必须有约定',
    description: 'Skill 要明确什么才算完成，让结果可以审阅、比较，也能被下一位协作者继续使用。',
  },
  {
    title: '保持足够小，才能审阅',
    description: '拒绝神秘的打包内容。几分钟内读完全部说明，保留你信任的部分，其余部分随时复刻修改。',
  },
]
</script>
