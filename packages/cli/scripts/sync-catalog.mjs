import { cp, mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repositoryRoot = resolve(packageRoot, '../..')
const target = resolve(packageRoot, 'catalog/skills')

await rm(target, { recursive: true, force: true })
await mkdir(dirname(target), { recursive: true })
await cp(resolve(repositoryRoot, 'skills'), target, { recursive: true })

console.log(`Synced skills into ${target}`)

