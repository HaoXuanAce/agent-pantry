import { rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Command, Option } from 'commander'
import pc from 'picocolors'
import catalogData from '../../../catalog.json'
import packsData from '../../../packs.json'
import packageData from '../package.json'
import {
  agentNames,
  diffSkillDirectories,
  getAgentDefinition,
  installSkillDirectory,
  isAgentName,
  pathExists,
  resolveInstallDirectory,
  validateSkillDirectory,
  type AgentName,
} from './lib.js'

interface SkillMeta {
  id: string
  index: string
  name: string
  tagline: string
  description: string
  phase: string
  maturity: string
  version: string
  tags: string[]
  supports: string[]
  outputs: string[]
  triggers: string[]
  stopConditions: string[]
  evalCount: number
}

interface PackMeta {
  id: string
  name: string
  description: string
  skills: string[]
}

const catalog = catalogData as SkillMeta[]
const packs = packsData as PackMeta[]
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const bundledCatalog = resolve(packageRoot, 'catalog/skills')
const repositoryCatalog = resolve(packageRoot, '../../skills')

async function resolveCatalogDirectory(): Promise<string> {
  if (await pathExists(bundledCatalog)) return bundledCatalog
  if (await pathExists(repositoryCatalog)) return repositoryCatalog
  throw new Error('The bundled skill catalog is missing. Reinstall agent-pantry and try again.')
}

function findSkill(id: string): SkillMeta {
  const skill = catalog.find((item) => item.id === id)
  if (!skill) {
    const suggestions = catalog
      .filter((item) => `${item.id} ${item.name} ${item.tags.join(' ')}`.toLowerCase().includes(id.toLowerCase()))
      .map((item) => item.id)

    const hint = suggestions.length ? ` Did you mean: ${suggestions.join(', ')}?` : ''
    throw new Error(`Unknown skill "${id}".${hint}`)
  }
  return skill
}

function parseAgent(value: string): AgentName {
  if (!isAgentName(value)) throw new Error(`Unknown agent "${value}". Choose one of: ${agentNames.join(', ')}`)
  return value
}

function printHeader(): void {
  console.log(pc.bgGreen(pc.black(pc.bold(' AGENT PANTRY '))), pc.dim('skills that earn their context'))
  console.log('')
}

const program = new Command()
  .name('agent-pantry')
  .description('Inspect and install review-ready Agent Skills.')
  .version(packageData.version)
  .showSuggestionAfterError()
  .showHelpAfterError()

program
  .command('list')
  .description('List every skill in the pantry')
  .option('-p, --phase <phase>', 'filter by workflow phase')
  .action((options: { phase?: string }) => {
    printHeader()
    const skills = options.phase
      ? catalog.filter((skill) => skill.phase.toLowerCase() === options.phase?.toLowerCase())
      : catalog

    for (const skill of skills) {
      console.log(`${pc.green(skill.index)}  ${pc.bold(skill.id.padEnd(31))} ${pc.dim(skill.phase.padEnd(10))} ${skill.tagline}`)
    }
    console.log(`\n${pc.dim(`${skills.length} skills · run agent-pantry inspect <id> for details`)}`)
  })

program
  .command('search')
  .description('Search skills by task, tag, or output')
  .argument('<query>', 'words to search for')
  .action((query: string) => {
    const tokens = query.toLowerCase().trim().split(/\s+/)
    const matches = catalog.filter((skill) => {
      const haystack = [skill.id, skill.name, skill.tagline, skill.description, skill.phase, ...skill.tags, ...skill.outputs, ...skill.triggers]
        .join(' ')
        .toLowerCase()
      return tokens.every((token) => haystack.includes(token))
    })

    printHeader()
    if (!matches.length) {
      console.log(pc.yellow(`No skills matched "${query}".`))
      process.exitCode = 1
      return
    }

    for (const skill of matches) {
      console.log(`${pc.green(skill.index)}  ${pc.bold(skill.id)}\n       ${pc.dim(skill.tagline)}\n`)
    }
  })

program
  .command('inspect')
  .description('Show a skill workflow summary and compatibility')
  .argument('<skill>', 'skill id')
  .action((id: string) => {
    const skill = findSkill(id)
    printHeader()
    console.log(`${pc.green(skill.index)}  ${pc.bold(skill.name)}  ${pc.dim(`v${skill.version}`)}`)
    console.log(pc.dim('─'.repeat(72)))
    console.log(`${skill.tagline}\n\n${skill.description}`)
    console.log(`\n${pc.bold('Maturity')}\n  ${skill.maturity} · ${skill.evalCount} authored evaluation scenarios`)
    console.log(`\n${pc.bold('Outputs')}\n${skill.outputs.map((item) => `  ${pc.green('✓')} ${item}`).join('\n')}`)
    console.log(`\n${pc.bold('Triggers')}\n${skill.triggers.map((item) => `  • ${item}`).join('\n')}`)
    console.log(`\n${pc.bold('Stop conditions')}\n${skill.stopConditions.map((item) => `  • ${item}`).join('\n')}`)
    console.log(`\n${pc.bold('Runs on')}\n  ${skill.supports.join(' · ')}`)
    console.log(`\n${pc.bold('Install')}\n  ${pc.green(`npx agent-pantry add ${skill.id} --agent codex`)}`)
  })

program
  .command('add')
  .description('Install a skill into an agent project or global directory')
  .argument('<skill>', 'skill id')
  .addOption(new Option('-a, --agent <agent>', 'target coding agent').choices([...agentNames]).default('codex'))
  .option('-g, --global', 'install for the current user instead of this project', false)
  .option('-f, --force', 'replace an existing skill directory', false)
  .option('--dry-run', 'show the target and file changes without writing', false)
  .action(async (id: string, options: { agent: string; global: boolean; force: boolean; dryRun: boolean }) => {
    const skill = findSkill(id)
    const agent = parseAgent(options.agent)
    const sourceRoot = await resolveCatalogDirectory()
    const source = join(sourceRoot, skill.id)
    const targetRoot = resolveInstallDirectory({ agent, global: options.global })
    const target = join(targetRoot, skill.id)

    printHeader()
    const issues = await validateSkillDirectory(source)
    if (issues.length) throw new Error(`Skill validation failed:\n- ${issues.join('\n- ')}`)

    const differences = await diffSkillDirectories(source, target)
    if (options.dryRun) {
      const targetExists = await pathExists(target)
      const action = targetExists ? (options.force ? 'replace' : 'blocked (use --force to replace)') : 'install'
      console.log(`${pc.bold('Target')}  ${target}`)
      console.log(`${pc.bold('Action')}  ${action}`)
      console.log(`${pc.bold('Files')}   ${differences.length ? '' : 'already current'}`)
      for (const difference of differences) console.log(`  ${difference.status.padEnd(7)} ${difference.path}`)
      console.log(`\n${pc.dim('Dry run only. No files were written.')}`)
      return
    }

    await installSkillDirectory(source, target, options.force)

    console.log(`${pc.green('✓')} Found ${pc.bold(skill.id)} ${pc.dim(`v${skill.version}`)}`)
    console.log(`${pc.green('✓')} Checked SKILL.md and evaluation cases`)
    console.log(`${pc.green('✓')} Installed for ${getAgentDefinition(agent).label}`)
    console.log(`\n${pc.bold(target)}\n`)
    console.log(pc.dim(`Ask your agent to use the ${skill.id} skill when the matching task appears.`))
  })

program
  .command('diff')
  .description('Compare a pantry skill with its installed copy')
  .argument('<skill>', 'skill id')
  .addOption(new Option('-a, --agent <agent>', 'target coding agent').choices([...agentNames]).default('codex'))
  .option('-g, --global', 'check the user-level install', false)
  .action(async (id: string, options: { agent: string; global: boolean }) => {
    const skill = findSkill(id)
    const agent = parseAgent(options.agent)
    const source = join(await resolveCatalogDirectory(), skill.id)
    const target = join(resolveInstallDirectory({ agent, global: options.global }), skill.id)
    if (!(await pathExists(target))) throw new Error(`${skill.id} is not installed at ${target}.`)

    printHeader()
    const differences = await diffSkillDirectories(source, target)
    if (!differences.length) {
      console.log(`${pc.green('✓')} ${skill.id} matches pantry v${skill.version}`)
      return
    }
    for (const difference of differences) console.log(`${difference.status.padEnd(7)} ${difference.path}`)
    console.log(`\n${pc.dim(`${differences.length} file differences. Review before using add --force.`)}`)
  })

program
  .command('remove')
  .description('Remove an installed skill from one agent path')
  .argument('<skill>', 'skill id')
  .addOption(new Option('-a, --agent <agent>', 'target coding agent').choices([...agentNames]).default('codex'))
  .option('-g, --global', 'remove the user-level install', false)
  .option('-y, --yes', 'confirm removal of the exact skill directory', false)
  .action(async (id: string, options: { agent: string; global: boolean; yes: boolean }) => {
    const skill = findSkill(id)
    const agent = parseAgent(options.agent)
    const target = join(resolveInstallDirectory({ agent, global: options.global }), skill.id)
    if (!(await pathExists(target))) throw new Error(`${skill.id} is not installed at ${target}.`)

    printHeader()
    if (!options.yes) {
      console.log(`${pc.yellow('Confirmation required:')} agent-pantry remove ${skill.id} --agent ${agent}${options.global ? ' --global' : ''} --yes`)
      console.log(pc.dim(`Would remove only ${target}`))
      return
    }
    await rm(target, { recursive: true })
    console.log(`${pc.green('✓')} Removed ${target}`)
  })

const packCommand = program.command('pack').description('Inspect or install curated skill packs')

packCommand
  .command('list')
  .description('List curated packs')
  .action(() => {
    printHeader()
    for (const pack of packs) console.log(`${pc.bold(pack.id)} ${pc.dim(`(${pack.skills.length})`)}\n  ${pack.description}\n`)
  })

packCommand
  .command('add')
  .description('Install every skill in a curated pack')
  .argument('<pack>', 'pack id')
  .addOption(new Option('-a, --agent <agent>', 'target coding agent').choices([...agentNames]).default('codex'))
  .option('-g, --global', 'install for the current user', false)
  .option('-f, --force', 'replace existing skill directories', false)
  .option('--dry-run', 'show targets without writing', false)
  .action(async (packId: string, options: { agent: string; global: boolean; force: boolean; dryRun: boolean }) => {
    const pack = packs.find((item) => item.id === packId)
    if (!pack) throw new Error(`Unknown pack "${packId}". Choose one of: ${packs.map((item) => item.id).join(', ')}`)
    const agent = parseAgent(options.agent)
    const sourceRoot = await resolveCatalogDirectory()
    const targetRoot = resolveInstallDirectory({ agent, global: options.global })

    printHeader()
    console.log(`${pc.bold(pack.name)} — ${pack.description}\n`)
    for (const skillId of pack.skills) {
      const source = join(sourceRoot, skillId)
      const target = join(targetRoot, skillId)
      const issues = await validateSkillDirectory(source)
      if (issues.length) throw new Error(`${skillId} failed validation:\n- ${issues.join('\n- ')}`)
      if ((await pathExists(target)) && !options.force && !options.dryRun) throw new Error(`${target} already exists. Use --force to replace the complete pack.`)
    }
    for (const skillId of pack.skills) {
      const source = join(sourceRoot, skillId)
      const target = join(targetRoot, skillId)
      const exists = await pathExists(target)
      if (options.dryRun) {
        const action = exists ? (options.force ? 'replace' : 'blocked') : 'install'
        console.log(`${action} ${skillId} → ${target}`)
        continue
      }
      await installSkillDirectory(source, target, options.force)
      console.log(`${pc.green('✓')} ${skillId}`)
    }
    if (options.dryRun) console.log(`\n${pc.dim('Dry run only. No files were written.')}`)
  })

program
  .command('verify')
  .description('Run structural checks against one skill or the full catalog')
  .argument('[skill]', 'optional skill id')
  .action(async (id?: string) => {
    const sourceRoot = await resolveCatalogDirectory()
    const skills = id ? [findSkill(id)] : catalog
    let failures = 0

    printHeader()
    for (const skill of skills) {
      const issues = await validateSkillDirectory(join(sourceRoot, skill.id))
      if (issues.length) {
        failures += 1
        console.log(`${pc.red('×')} ${pc.bold(skill.id)}\n  ${issues.join('\n  ')}`)
      } else {
        console.log(`${pc.green('✓')} ${skill.id}`)
      }
    }

    console.log(`\n${skills.length - failures}/${skills.length} skills passed structural verification.`)
    if (failures) process.exitCode = 1
  })

program
  .command('doctor')
  .description('Show supported agents and their project install paths')
  .action(() => {
    printHeader()
    console.log(`${pc.green('✓')} Node ${process.version}`)
    console.log(`${pc.green('✓')} ${catalog.length} skills available\n`)
    for (const agent of agentNames) {
      const definition = getAgentDefinition(agent)
      console.log(`${pc.bold(definition.label.padEnd(15))} ${pc.dim(definition.projectPath)}`)
    }
  })

program.parseAsync().catch((error: unknown) => {
  console.error(`\n${pc.red(pc.bold('Error'))} ${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
