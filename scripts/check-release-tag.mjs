import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const packageJson = JSON.parse(await readFile(resolve(root, 'packages/cli/package.json'), 'utf8'))
const tag = process.env.GITHUB_REF_NAME
const expected = `cli-v${packageJson.version}`

if (tag !== expected) {
  console.error(`Release tag ${tag ?? '<missing>'} does not match package version ${expected}.`)
  process.exit(1)
}

console.log(`Release tag matches agent-pantry ${packageJson.version}.`)
