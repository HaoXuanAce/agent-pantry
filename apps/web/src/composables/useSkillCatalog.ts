import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import catalogData from '../../../../catalog.json'
import packsData from '../../../../packs.json'
import type { Skill, SkillPack } from '../types/skill'

const skills = catalogData as Skill[]
const packs = packsData as SkillPack[]

export function useSkillCatalog() {
  const query = shallowRef('')
  const phase = shallowRef('All phases')
  const sort = shallowRef('Recommended')
  const selectedSkill = shallowRef<Skill | null>(null)

  const phases = computed(() => ['All phases', ...new Set(skills.map((skill) => skill.phase))])

  const visibleSkills = computed(() => {
    const normalizedQuery = query.value.trim().toLowerCase()
    const matches = skills.filter((skill) => {
      const matchesPhase = phase.value === 'All phases' || skill.phase === phase.value
      const searchableText = [
        skill.name,
        skill.tagline,
        skill.description,
        skill.phase,
        ...skill.tags,
        ...skill.outputs,
        ...skill.triggers,
        ...skill.stopConditions,
      ]
        .join(' ')
        .toLowerCase()

      return matchesPhase && (!normalizedQuery || searchableText.includes(normalizedQuery))
    })

    return [...matches].sort((first, second) => {
      if (sort.value === 'A–Z') return first.name.localeCompare(second.name)
      if (first.featured !== second.featured) return Number(second.featured) - Number(first.featured)
      return first.index.localeCompare(second.index)
    })
  })

  const syncSelectionFromUrl = () => {
    const skillId = new URL(window.location.href).searchParams.get('skill')
    selectedSkill.value = skills.find((skill) => skill.id === skillId) ?? null
  }

  const selectSkill = (skill: Skill) => {
    selectedSkill.value = skill
    const url = new URL(window.location.href)
    url.searchParams.set('skill', skill.id)
    window.history.pushState({}, '', url)
  }

  const closeSkill = () => {
    selectedSkill.value = null
    const url = new URL(window.location.href)
    url.searchParams.delete('skill')
    window.history.pushState({}, '', url)
  }

  onMounted(() => {
    syncSelectionFromUrl()
    window.addEventListener('popstate', syncSelectionFromUrl)
  })
  onBeforeUnmount(() => window.removeEventListener('popstate', syncSelectionFromUrl))

  return {
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
  }
}
