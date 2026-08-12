import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const [owner, repositoryName = 'agent-pantry'] = process.argv.slice(2)

if (!owner || !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(owner)) {
  console.error('Usage: pnpm repo:configure <github-owner> [repository-name]')
  console.error('Example: pnpm repo:configure haoxuan-ai agent-pantry')
  process.exit(1)
}

if (!/^[A-Za-z0-9._-]{1,100}$/.test(repositoryName)) {
  console.error('Repository name may only contain letters, numbers, dots, underscores, and hyphens.')
  process.exit(1)
}

const files = [
  'README.md',
  'README.en.md',
  'examples/README.md',
  'apps/web/index.html',
  'apps/web/src/config.ts',
  'apps/web/vite.config.ts',
  'packages/cli/README.md',
  'packages/cli/package.json',
  '.github/ISSUE_TEMPLATE/config.yml',
]

const repositoryConfig = await readFile(resolve(root, 'apps/web/src/config.ts'), 'utf8')
const currentOwner = repositoryConfig.match(/owner: '([^']+)'/)?.[1]
const currentRepositoryName = repositoryConfig.match(/name: '([^']+)'/)?.[1]

if (!currentOwner || !currentRepositoryName) {
  throw new Error('Could not read the current repository owner and name from apps/web/src/config.ts.')
}

for (const file of files) {
  const path = resolve(root, file)
  const source = await readFile(path, 'utf8')
  const configured = source
    .replaceAll(`${currentOwner}.github.io/${currentRepositoryName}`, `${owner}.github.io/${repositoryName}`)
    .replaceAll(`${currentOwner}/${currentRepositoryName}`, `${owner}/${repositoryName}`)

  let finalSource = configured
  if (file === 'apps/web/src/config.ts') {
    finalSource = finalSource
      .replace(/owner: '[^']+'/, `owner: '${owner}'`)
      .replace(/name: '[^']+'/, `name: '${repositoryName}'`)
  }
  if (file === 'apps/web/vite.config.ts') {
    finalSource = finalSource.replace(/base: process\.env\.GITHUB_ACTIONS \? '\/[^']+\/'/, `base: process.env.GITHUB_ACTIONS ? '/${repositoryName}/'`)
  }

  if (finalSource !== source) await writeFile(path, finalSource)
}

console.log(`Configured repository links for https://github.com/${owner}/${repositoryName}`)
console.log(`Expected Pages URL: https://${owner}.github.io/${repositoryName}/`)
