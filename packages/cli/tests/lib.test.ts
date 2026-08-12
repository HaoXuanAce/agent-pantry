import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { diffSkillDirectories, installSkillDirectory, isAgentName, resolveInstallDirectory, validateSkillDirectory } from '../src/lib'

async function createSkillFixture(directory: string, name = 'sample'): Promise<void> {
  await mkdir(join(directory, 'evals'), { recursive: true })
  await writeFile(join(directory, 'SKILL.md'), `---\nname: ${name}\ndescription: A sufficiently descriptive sample skill used to exercise the validation and installation behavior.\n---\n\n# Sample\n`)
  await writeFile(join(directory, 'evals/evals.json'), JSON.stringify({
    skill_name: name,
    evals: Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      prompt: 'Run a realistic sample task with enough detail.',
      expected_output: 'A realistic and reviewable result for the sample task.',
      files: [],
      expectations: ['one', 'two', 'three'],
    })),
  }))
}

describe('agent target resolution', () => {
  it('recognizes supported agent ids', () => {
    expect(isAgentName('codex')).toBe(true)
    expect(isAgentName('unknown')).toBe(false)
  })

  it('resolves a project-local Codex path', () => {
    expect(resolveInstallDirectory({ agent: 'codex', global: false, cwd: '/tmp/project' })).toBe('/tmp/project/.agents/skills')
  })

  it('uses the Codex user skill directory for global installs', () => {
    expect(resolveInstallDirectory({ agent: 'codex', global: true })).toMatch(/\.codex\/skills$/)
  })
})

describe('skill validation', () => {
  it('accepts a complete skill fixture', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agent-pantry-'))
    const fixture = join(root, 'sample')
    await createSkillFixture(fixture)

    await expect(validateSkillDirectory(fixture)).resolves.toEqual([])
  })

  it('reports missing required files', async () => {
    const fixture = await mkdtemp(join(tmpdir(), 'agent-pantry-'))
    await expect(validateSkillDirectory(fixture)).resolves.toEqual(['Missing SKILL.md'])
  })
})

describe('safe installation', () => {
  it('installs a validated skill and detects a later file change', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agent-pantry-'))
    const source = join(root, 'source', 'sample')
    const target = join(root, 'target', 'sample')
    await createSkillFixture(source)

    await installSkillDirectory(source, target, false)
    await expect(readFile(join(target, 'SKILL.md'), 'utf8')).resolves.toContain('name: sample')
    await writeFile(join(target, 'SKILL.md'), 'locally changed')
    await expect(diffSkillDirectories(source, target)).resolves.toEqual([
      { path: 'SKILL.md', status: 'changed' },
    ])
  })

  it('validates source before replacing an existing install', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agent-pantry-'))
    const source = join(root, 'source', 'sample')
    const target = join(root, 'target', 'sample')
    await mkdir(source, { recursive: true })
    await mkdir(target, { recursive: true })
    await writeFile(join(target, 'KEEP.txt'), 'preserve me')

    await expect(installSkillDirectory(source, target, true)).rejects.toThrow('Skill validation failed')
    await expect(readFile(join(target, 'KEEP.txt'), 'utf8')).resolves.toBe('preserve me')
  })

  it('replaces the exact skill directory and removes stale files when forced', async () => {
    const root = await mkdtemp(join(tmpdir(), 'agent-pantry-'))
    const source = join(root, 'source', 'sample')
    const target = join(root, 'target', 'sample')
    await createSkillFixture(source)
    await mkdir(target, { recursive: true })
    await writeFile(join(target, 'STALE.txt'), 'old file')

    await installSkillDirectory(source, target, true)

    await expect(readFile(join(target, 'SKILL.md'), 'utf8')).resolves.toContain('name: sample')
    await expect(diffSkillDirectories(source, target)).resolves.toEqual([])
  })
})
