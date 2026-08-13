<template>
  <div class="grain min-h-screen overflow-hidden bg-paper text-ink">
    <SiteHeader />
    <main>
      <HeroSection :skill-count="skills.length" />
      <ProofStrip :skill-count="skills.length" />
      <SkillPacks :packs="packs" :skills="skills" @select="selectSkill" />
      <section id="catalog" class="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div class="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p class="mb-3 font-mono text-xs font-semibold uppercase tracking-widest text-steel">
              开放目录 / {{ skills.length }} 个可审阅工作流
            </p>
            <h2 class="max-w-3xl text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl lg:text-6xl">
              每一份上下文，<br />都值得被认真对待。
            </h2>
          </div>
          <p class="max-w-md border-l-2 border-ink pl-4 text-sm leading-relaxed text-steel">
            不收录抓取拼凑的清单，也不提供一句话提示词。每个条目都包含完整工作流、停止条件、
            输出约定，以及四个可审阅的评测场景。
          </p>
        </div>

        <CatalogToolbar
          v-model:query="query"
          v-model:phase="phase"
          v-model:sort="sort"
          :phases="phases"
          :result-count="visibleSkills.length"
        />

        <SkillGrid :skills="visibleSkills" @select="selectSkill" />
      </section>
      <CliSection />
      <PrinciplesSection />
    </main>
    <SiteFooter />

    <SkillDrawer :skill="selectedSkill" @close="closeSkill" />
  </div>
</template>

<script setup lang="ts">
import CatalogToolbar from './components/catalog/CatalogToolbar.vue'
import SkillDrawer from './components/catalog/SkillDrawer.vue'
import SkillGrid from './components/catalog/SkillGrid.vue'
import CliSection from './components/marketing/CliSection.vue'
import HeroSection from './components/marketing/HeroSection.vue'
import PrinciplesSection from './components/marketing/PrinciplesSection.vue'
import ProofStrip from './components/marketing/ProofStrip.vue'
import SkillPacks from './components/marketing/SkillPacks.vue'
import SiteFooter from './components/site/SiteFooter.vue'
import SiteHeader from './components/site/SiteHeader.vue'
import { useSkillCatalog } from './composables/useSkillCatalog'

const {
  skills,
  packs,
  query,
  phase,
  sort,
  phases,
  visibleSkills,
  selectedSkill,
  selectSkill,
  closeSkill,
} = useSkillCatalog()
</script>
