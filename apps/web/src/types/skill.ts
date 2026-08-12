export type SkillMaturity = 'reviewed'

export interface Skill {
  id: string
  index: string
  name: string
  tagline: string
  description: string
  phase: string
  maturity: SkillMaturity
  version: string
  tags: string[]
  supports: string[]
  outputs: string[]
  triggers: string[]
  stopConditions: string[]
  evalCount: number
  featured: boolean
}

export interface SkillPack {
  id: string
  name: string
  description: string
  skills: string[]
}
