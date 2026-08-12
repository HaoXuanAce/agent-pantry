import { access, cp, mkdir, readFile, readdir, rename, rm } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { homedir } from 'node:os'
import { basename, isAbsolute, join, relative, resolve } from 'node:path'

export const agentNames = ['codex', 'claude', 'cursor', 'gemini', 'copilot'] as const

export type AgentName = (typeof agentNames)[number]

interface AgentDefinition {
  label: string
  projectPath: string
  globalPath: string
}

const agentDefinitions: Record<AgentName, AgentDefinition> = {
  codex: { label: 'Codex', projectPath: '.agents/skills', globalPath: '.codex/skills' },
  claude: { label: 'Claude Code', projectPath: '.claude/skills', globalPath: '.claude/skills' },
  cursor: { label: 'Cursor', projectPath: '.cursor/skills', globalPath: '.cursor/skills' },
  gemini: { label: 'Gemini CLI', projectPath: '.gemini/skills', globalPath: '.gemini/skills' },
  copilot: { label: 'GitHub Copilot', projectPath: '.github/skills', globalPath: '.copilot/skills' },
}

export function isAgentName(value: string): value is AgentName {
  return agentNames.includes(value as AgentName)
}

export function getAgentDefinition(agent: AgentName): AgentDefinition {
  return agentDefinitions[agent]
}

export function resolveInstallDirectory(options: {
  agent: AgentName
  global: boolean
  cwd?: string
}): string {
  const definition = getAgentDefinition(options.agent)
  const base = options.global ? homedir() : (options.cwd ?? process.cwd())
  return resolve(base, options.global ? definition.globalPath : definition.projectPath)
}

export async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export async function validateSkillDirectory(skillDirectory: string): Promise<string[]> {
  const issues: string[] = []
  const skillName = basename(skillDirectory)
  const skillFile = join(skillDirectory, 'SKILL.md')
  const evalsFile = join(skillDirectory, 'evals/evals.json')

  if (!(await pathExists(skillFile))) {
    return ['Missing SKILL.md']
  }

  const content = await readFile(skillFile, 'utf8')
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)

  if (!frontmatter) {
    issues.push('SKILL.md is missing YAML frontmatter')
  } else {
    const name = frontmatter[1]?.match(/^name:\s*(\S+)/m)?.[1]
    if (!name) issues.push('Frontmatter is missing name')
    if (name && name !== skillName) issues.push('Frontmatter name does not match the skill directory')
    if (!/^description:\s*.+/m.test(frontmatter[1] ?? '')) issues.push('Frontmatter is missing description')
  }

  if (!(await pathExists(evalsFile))) {
    issues.push('Missing evals/evals.json')
  } else {
    try {
      const suite = JSON.parse(await readFile(evalsFile, 'utf8')) as {
        skill_name?: string
        evals?: Array<{ id?: number; prompt?: string; expected_output?: string; files?: unknown[]; expectations?: unknown[] }>
      }
      if (suite.skill_name !== skillName) issues.push('Evaluation skill_name does not match the skill directory')
      if (!Array.isArray(suite.evals) || suite.evals.length < 4) issues.push('Evaluation suite must contain at least 4 cases')
      for (const testCase of suite.evals ?? []) {
        if (!Number.isInteger(testCase.id) || !testCase.prompt || !testCase.expected_output) issues.push('Every evaluation needs an integer id, prompt, and expected_output')
        if (!Array.isArray(testCase.files) || !Array.isArray(testCase.expectations) || testCase.expectations.length < 3) issues.push('Every evaluation needs files and at least 3 expectations')
        for (const file of testCase.files ?? []) {
          if (typeof file !== 'string') {
            issues.push('Evaluation file paths must be strings')
            continue
          }
          const inputPath = resolve(skillDirectory, file)
          const inputRelativePath = relative(skillDirectory, inputPath)
          if (inputRelativePath.startsWith('..') || isAbsolute(inputRelativePath) || !(await pathExists(inputPath))) issues.push(`Evaluation references invalid or missing file ${file}`)
        }
      }
    } catch {
      issues.push('evals/evals.json is not valid JSON')
    }
  }

  return issues
}

export interface FileDifference {
  path: string
  status: 'added' | 'removed' | 'changed'
}

async function hashDirectory(directory: string): Promise<Map<string, string>> {
  const hashes = new Map<string, string>()

  async function walk(current: string): Promise<void> {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const path = join(current, entry.name)
      if (entry.isDirectory()) {
        await walk(path)
      } else if (entry.isFile()) {
        const relativePath = path.slice(directory.length + 1)
        const hash = createHash('sha256').update(await readFile(path)).digest('hex')
        hashes.set(relativePath, hash)
      }
    }
  }

  if (await pathExists(directory)) await walk(directory)
  return hashes
}

export async function diffSkillDirectories(source: string, target: string): Promise<FileDifference[]> {
  const [sourceHashes, targetHashes] = await Promise.all([hashDirectory(source), hashDirectory(target)])
  const paths = [...new Set([...sourceHashes.keys(), ...targetHashes.keys()])].sort()

  const differences: FileDifference[] = []
  for (const path of paths) {
    if (!targetHashes.has(path)) differences.push({ path, status: 'added' })
    else if (!sourceHashes.has(path)) differences.push({ path, status: 'removed' })
    else if (sourceHashes.get(path) !== targetHashes.get(path)) differences.push({ path, status: 'changed' })
  }
  return differences
}

export async function installSkillDirectory(source: string, target: string, replace: boolean): Promise<void> {
  const issues = await validateSkillDirectory(source)
  if (issues.length) throw new Error(`Skill validation failed:\n- ${issues.join('\n- ')}`)

  const targetRoot = resolve(target, '..')
  const nonce = `${process.pid}-${Date.now()}`
  const staging = `${target}.staging-${nonce}`
  const backup = `${target}.backup-${nonce}`
  const targetExists = await pathExists(target)

  if (targetExists && !replace) throw new Error(`${target} already exists. Use --force to replace it.`)

  await mkdir(targetRoot, { recursive: true })
  await cp(source, staging, { recursive: true })

  try {
    if (targetExists) await rename(target, backup)
    await rename(staging, target)
    if (targetExists) await rm(backup, { recursive: true, force: true })
  } catch (error) {
    await rm(staging, { recursive: true, force: true })
    if (targetExists && (await pathExists(backup)) && !(await pathExists(target))) await rename(backup, target)
    throw error
  }
}
