import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const skillName = 'vibe-to-verified'
const skillFile = await readFile(resolve(root, 'skills', skillName, 'SKILL.md'), 'utf8')
const description = skillFile.match(/^description:\s*(.+)$/m)?.[1]

if (!description) throw new Error(`Could not read ${skillName} description.`)

const evals = JSON.parse(await readFile(resolve(root, 'skills', skillName, 'evals/trigger-evals.json'), 'utf8'))
const templatePath = process.env.SKILL_EVAL_REVIEW_TEMPLATE ?? resolve(root, 'scripts/templates/eval-review.html')

const template = await readFile(templatePath, 'utf8')
const html = template
  .replaceAll('__SKILL_NAME_PLACEHOLDER__', skillName)
  .replace('__SKILL_DESCRIPTION_PLACEHOLDER__', description.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'))
  .replace('__EVAL_DATA_PLACEHOLDER__', JSON.stringify(evals).replaceAll('<', '\\u003c'))

const outputDirectory = resolve(root, '.eval-review')
const outputPath = resolve(outputDirectory, `${skillName}.html`)
await mkdir(outputDirectory, { recursive: true })
await writeFile(outputPath, html)
console.log(`Generated ${outputPath}`)
