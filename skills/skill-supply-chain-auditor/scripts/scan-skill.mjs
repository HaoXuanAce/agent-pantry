#!/usr/bin/env node

import { lstat, readFile, readdir } from 'node:fs/promises'
import { extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const target = resolve(process.argv[2] ?? '.')
const scannerPath = fileURLToPath(import.meta.url)
const findings = []
const files = []

const patterns = [
  { id: 'credential-access', severity: 'high', pattern: /(?:\.env|API_KEY|TOKEN|PASSWORD|keychain|credentials?)/i },
  { id: 'network-transfer', severity: 'medium', pattern: /(?:curl|wget|fetch\s*\(|https?:\/\/)/i },
  { id: 'dynamic-execution', severity: 'high', pattern: /(?:eval\s*\(|new Function|child_process|execSync|spawnSync)/i },
  { id: 'destructive-operation', severity: 'high', pattern: /(?:rm\s+-rf|rmdirSync|unlinkSync|Remove-Item\s+-Recurse)/i },
  { id: 'approval-bypass', severity: 'high', pattern: /(?:ignore (?:all |previous )?instructions|without (?:asking|approval)|do not tell the user|silently)/i },
  { id: 'broad-home-access', severity: 'medium', pattern: /(?:\$HOME|~\/|homedir\s*\()/i }
]

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    const displayPath = relative(target, path)

    if (path === scannerPath) continue

    if (entry.isSymbolicLink()) {
      findings.push({ id: 'symlink', severity: 'medium', file: displayPath, evidence: 'Symbolic link requires destination review.' })
      continue
    }

    if (entry.isDirectory()) {
      await walk(path)
      continue
    }

    const stats = await lstat(path)
    files.push({ path: displayPath, bytes: stats.size, executable: Boolean(stats.mode & 0o111) })
    if (stats.size > 1024 * 1024) {
      findings.push({ id: 'large-file', severity: 'low', file: displayPath, evidence: `${stats.size} bytes` })
      continue
    }

    const textExtensions = new Set(['', '.md', '.txt', '.json', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.sh', '.bash', '.zsh', '.ps1', '.yaml', '.yml', '.toml'])
    if (!textExtensions.has(extname(entry.name).toLowerCase())) continue

    const content = await readFile(path, 'utf8')
    for (const rule of patterns) {
      const match = content.match(rule.pattern)
      if (match) findings.push({ id: rule.id, severity: rule.severity, file: displayPath, evidence: match[0].slice(0, 120) })
    }
  }
}

await walk(target)

console.log(JSON.stringify({ target, files, findings, note: 'Pattern matches require contextual human review and are not a safety verdict.' }, null, 2))
