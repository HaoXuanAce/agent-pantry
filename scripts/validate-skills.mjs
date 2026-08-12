import { access, readFile, readdir } from 'node:fs/promises'
import { isAbsolute, relative, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const catalog = JSON.parse(await readFile(resolve(root, 'catalog.json'), 'utf8'))
const packs = JSON.parse(await readFile(resolve(root, 'packs.json'), 'utf8'))
const failures = []
const requiredCatalogFields = ['id', 'index', 'name', 'tagline', 'description', 'phase', 'maturity', 'version', 'tags', 'supports', 'outputs', 'triggers', 'stopConditions', 'evalCount', 'featured']
const expectedPhases = new Set(['Explore', 'Build', 'Diagnose', 'Verify', 'Ship', 'Operate'])
const catalogIds = catalog.map((skill) => skill.id)
const catalogIdSet = new Set(catalogIds)
const directoryIds = (await readdir(resolve(root, 'skills'), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

const validateTriggerEvals = async (skillId, directory) => {
  const triggerEvalsFile = resolve(directory, 'evals/trigger-evals.json')
  try {
    await access(triggerEvalsFile)
  } catch {
    return
  }

  try {
    const triggerEvals = JSON.parse(await readFile(triggerEvalsFile, 'utf8'))
    const positives = triggerEvals.filter((item) => item.should_trigger === true).length
    const negatives = triggerEvals.filter((item) => item.should_trigger === false).length
    if (triggerEvals.length < 20 || positives < 10 || negatives < 10) {
      failures.push(`${skillId}: trigger eval pilot needs at least 10 positive and 10 negative queries`)
    }
    for (const [index, item] of triggerEvals.entries()) {
      if (typeof item.query !== 'string' || item.query.length < 30 || typeof item.should_trigger !== 'boolean') {
        failures.push(`${skillId}: trigger eval ${index + 1} must contain a realistic query and boolean label`)
      }
    }
  } catch {
    failures.push(`${skillId}: invalid evals/trigger-evals.json`)
  }
}

if (catalogIds.length !== catalogIdSet.size) failures.push('catalog.json contains duplicate skill ids')
if (new Set(catalog.map((skill) => skill.index)).size !== catalog.length) failures.push('catalog.json contains duplicate indexes')

for (const id of catalogIds) if (!directoryIds.includes(id)) failures.push(`${id}: catalog entry has no matching skill directory`)
for (const id of directoryIds) if (!catalogIdSet.has(id)) failures.push(`${id}: skill directory is missing from catalog.json`)

for (const skill of catalog) {
  for (const field of requiredCatalogFields) {
    if (skill[field] === undefined || skill[field] === '') failures.push(`${skill.id}: catalog field ${field} is missing`)
  }
  if (!expectedPhases.has(skill.phase)) failures.push(`${skill.id}: unknown phase ${skill.phase}`)
  if (skill.maturity !== 'reviewed') failures.push(`${skill.id}: maturity must be reviewed until reproducible model benchmarks exist`)

  const directory = resolve(root, 'skills', skill.id)
  const skillFile = resolve(directory, 'SKILL.md')
  const evalsFile = resolve(directory, 'evals/evals.json')
  await validateTriggerEvals(skill.id, directory)

  try {
    await access(skillFile)
    const source = await readFile(skillFile, 'utf8')
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)
    const name = frontmatter?.[1].match(/^name:\s*(\S+)/m)?.[1]
    const description = frontmatter?.[1].match(/^description:\s*(.+)/m)?.[1]
    if (!frontmatter || !name || !description) failures.push(`${skill.id}: invalid SKILL.md frontmatter`)
    if (name && name !== skill.id) failures.push(`${skill.id}: frontmatter name must match directory id`)
    if (description && description.length < 80) failures.push(`${skill.id}: description is too short to define a reliable trigger boundary`)
  } catch {
    failures.push(`${skill.id}: missing SKILL.md`)
  }

  try {
    const suite = JSON.parse(await readFile(evalsFile, 'utf8'))
    if (suite.skill_name !== skill.id) failures.push(`${skill.id}: eval suite skill_name must match catalog id`)
    if (!Array.isArray(suite.evals) || suite.evals.length < 4) {
      failures.push(`${skill.id}: expected at least 4 evaluation cases`)
      continue
    }
    if (skill.evalCount !== suite.evals.length) failures.push(`${skill.id}: catalog evalCount does not match eval suite`)
    const evalIds = new Set()
    for (const testCase of suite.evals) {
      if (!Number.isInteger(testCase.id) || evalIds.has(testCase.id)) failures.push(`${skill.id}: eval ids must be unique integers`)
      evalIds.add(testCase.id)
      if (typeof testCase.prompt !== 'string' || testCase.prompt.length < 20) failures.push(`${skill.id}: eval ${testCase.id} needs a realistic prompt`)
      if (typeof testCase.expected_output !== 'string' || testCase.expected_output.length < 30) failures.push(`${skill.id}: eval ${testCase.id} needs an expected output`)
      if (!Array.isArray(testCase.files)) failures.push(`${skill.id}: eval ${testCase.id} files must be an array`)
      if (!Array.isArray(testCase.expectations) || testCase.expectations.length < 3) failures.push(`${skill.id}: eval ${testCase.id} needs at least 3 expectations`)
      for (const file of testCase.files ?? []) {
        const inputPath = resolve(directory, file)
        const inputRelativePath = relative(directory, inputPath)
        if (inputRelativePath.startsWith('..') || isAbsolute(inputRelativePath)) {
          failures.push(`${skill.id}: eval ${testCase.id} file escapes the skill directory`)
          continue
        }
        try {
          await access(inputPath)
        } catch {
          failures.push(`${skill.id}: eval ${testCase.id} references missing file ${file}`)
        }
      }
    }
  } catch {
    failures.push(`${skill.id}: missing or invalid evals/evals.json`)
  }
}

for (const pack of packs) {
  if (!pack.id || !pack.name || !pack.description || !Array.isArray(pack.skills) || pack.skills.length < 2) failures.push(`pack ${pack.id ?? '<unknown>'}: invalid metadata`)
  for (const skillId of pack.skills ?? []) if (!catalogIdSet.has(skillId)) failures.push(`pack ${pack.id}: unknown skill ${skillId}`)
}

if (failures.length) {
  console.error(`Skill validation failed:\n- ${failures.join('\n- ')}`)
  process.exit(1)
}

console.log(`Validated ${catalog.length} skills and ${packs.length} packs.`)
