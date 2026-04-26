import { access, mkdir, readFile, writeFile } from 'fs/promises'
import { homedir } from 'os'
import { dirname, join } from 'path'

const PACKAGE_NAME = '@coastdigitalgroup/coastai-skills'
const SERVER_NAME = 'coast-ai-skills'

const STANDARD_ENTRY = {
  command: 'npx',
  args: ['-y', PACKAGE_NAME]
}

const CLAUDE_MD_BLOCK = `
## Skills

Before starting any task, call \`search_skills()\` with keywords describing
the goal. If a relevant skill exists, load it with \`get_skill()\` before
proceeding. Call \`list_skills()\` to browse all available skills by category.
`

const CODEX_MCP_SECTION = `[mcp_servers.${SERVER_NAME}]
command = "npx"
args = ["-y", "${PACKAGE_NAME}"]
`

// Different tools use different config shapes.
// 'object' → { "server-name": { command, args } }   (Claude, Cursor, Windsurf, Zed)
// 'array'  → [{ name: "server-name", command, args }] (Continue)
type EntryFormat = 'object' | 'array'

interface ConfigTarget {
  label: string
  path: string
  createIfMissing: boolean
  configKey: string
  entryFormat: EntryFormat
}

function getTargets(): ConfigTarget[] {
  const home = homedir()
  const cwd = process.cwd()
  const appData = process.env['APPDATA'] ?? join(home, 'AppData', 'Roaming')

  return [
    // ── Anthropic ──────────────────────────────────────────────────────────
    {
      label: 'Claude Code',
      path: join(cwd, '.mcp.json'),
      configKey: 'mcpServers',
      entryFormat: 'object',
      createIfMissing: true
    },
    {
      label: 'Claude Desktop (macOS)',
      path: join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
      configKey: 'mcpServers',
      entryFormat: 'object',
      createIfMissing: false
    },
    {
      label: 'Claude Desktop (Windows)',
      path: join(appData, 'Claude', 'claude_desktop_config.json'),
      configKey: 'mcpServers',
      entryFormat: 'object',
      createIfMissing: false
    },
    // ── Cursor ─────────────────────────────────────────────────────────────
    {
      label: 'Cursor (project)',
      path: join(cwd, '.cursor', 'mcp.json'),
      configKey: 'mcpServers',
      entryFormat: 'object',
      createIfMissing: false
    },
    {
      label: 'Cursor (global)',
      path: join(home, '.cursor', 'mcp.json'),
      configKey: 'mcpServers',
      entryFormat: 'object',
      createIfMissing: false
    },
    // ── Windsurf (Codeium) ─────────────────────────────────────────────────
    {
      label: 'Windsurf',
      path: join(home, '.codeium', 'windsurf', 'mcp_config.json'),
      configKey: 'mcpServers',
      entryFormat: 'object',
      createIfMissing: false
    },
    // ── Zed ────────────────────────────────────────────────────────────────
    // Zed uses 'context_servers' instead of 'mcpServers'
    {
      label: 'Zed (macOS)',
      path: join(home, 'Library', 'Application Support', 'Zed', 'settings.json'),
      configKey: 'context_servers',
      entryFormat: 'object',
      createIfMissing: false
    },
    {
      label: 'Zed (Linux)',
      path: join(home, '.config', 'zed', 'settings.json'),
      configKey: 'context_servers',
      entryFormat: 'object',
      createIfMissing: false
    },
    // ── Continue ───────────────────────────────────────────────────────────
    // Continue uses an array under mcpServers, not an object
    {
      label: 'Continue',
      path: join(home, '.continue', 'config.json'),
      configKey: 'mcpServers',
      entryFormat: 'array',
      createIfMissing: false
    }
    // ── Not yet supported ──────────────────────────────────────────────────
    // Goose (Block)     — uses YAML config, requires yaml parser
    // Cline             — stored inside VS Code settings.json, complex to patch
    // GitHub Copilot    — no MCP support yet
    // OpenAI tools      — no MCP support yet
  ]
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJson(filePath: string): Promise<Record<string, unknown>> {
  try {
    return JSON.parse(await readFile(filePath, 'utf-8')) as Record<string, unknown>
  } catch {
    return {}
  }
}

async function writeJson(filePath: string, data: unknown): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
}

function upsertTomlSection(content: string, section: string, replacement: string): string {
  const lines = content.split(/\r?\n/)
  const start = lines.findIndex((line) => line.trim() === section)

  if (start === -1) {
    const prefix = content.trimEnd()
    return `${prefix}${prefix ? '\n\n' : ''}${replacement}`
  }

  let end = start + 1
  while (end < lines.length && !lines[end].trimStart().startsWith('[')) {
    end++
  }

  const nextContent = [
    ...lines.slice(0, start),
    ...replacement.trimEnd().split('\n'),
    ...lines.slice(end)
  ].join('\n')

  return nextContent.endsWith('\n') ? nextContent : `${nextContent}\n`
}

async function writeCodexConfig(): Promise<boolean> {
  const codexConfigPath = join(homedir(), '.codex', 'config.toml')
  const codexHomeExists = await fileExists(dirname(codexConfigPath))
  const codexConfigExists = await fileExists(codexConfigPath)

  if (!codexHomeExists && !codexConfigExists) return false

  const current = codexConfigExists ? await readFile(codexConfigPath, 'utf-8') : ''
  const next = upsertTomlSection(
    current,
    `[mcp_servers.${SERVER_NAME}]`,
    CODEX_MCP_SECTION
  )

  await mkdir(dirname(codexConfigPath), { recursive: true })
  await writeFile(codexConfigPath, next, 'utf-8')
  console.log('  ✓  Codex')
  console.log(`     ${codexConfigPath}\n`)
  return true
}

function applyEntry(config: Record<string, unknown>, target: ConfigTarget): void {
  if (target.entryFormat === 'object') {
    if (
      !config[target.configKey] ||
      typeof config[target.configKey] !== 'object' ||
      Array.isArray(config[target.configKey])
    ) {
      config[target.configKey] = {}
    }
    ;(config[target.configKey] as Record<string, unknown>)[SERVER_NAME] = STANDARD_ENTRY
  } else {
    // array format — e.g. Continue's mcpServers
    if (!Array.isArray(config[target.configKey])) {
      config[target.configKey] = []
    }
    const arr = config[target.configKey] as Array<Record<string, unknown>>
    const idx = arr.findIndex((e) => e['name'] === SERVER_NAME)
    const entry = { name: SERVER_NAME, ...STANDARD_ENTRY }
    if (idx >= 0) {
      arr[idx] = entry
    } else {
      arr.push(entry)
    }
  }
}

async function writeClaudeMd(cwd: string): Promise<void> {
  const claudeMdPath = join(cwd, 'CLAUDE.md')
  const exists = await fileExists(claudeMdPath)

  if (exists) {
    const current = await readFile(claudeMdPath, 'utf-8')
    if (current.includes('search_skills')) {
      console.log('  ✓  CLAUDE.md (skills block already present)\n')
      return
    }
    await writeFile(claudeMdPath, current.trimEnd() + '\n' + CLAUDE_MD_BLOCK, 'utf-8')
  } else {
    await writeFile(claudeMdPath, CLAUDE_MD_BLOCK.trimStart(), 'utf-8')
  }

  console.log('  ✓  CLAUDE.md — skills instruction written\n')
}

export async function install(): Promise<void> {
  console.log('@coastdigitalgroup/coastai-skills — installer\n')

  const cwd = process.cwd()
  const targets = getTargets()
  let installed = 0

  if (await writeCodexConfig()) {
    installed++
  }

  for (const target of targets) {
    const exists = await fileExists(target.path)
    if (!exists && !target.createIfMissing) continue

    const config = await readJson(target.path)
    applyEntry(config, target)

    try {
      await writeJson(target.path, config)
      console.log(`  ✓  ${target.label}`)
      console.log(`     ${target.path}\n`)
      installed++
    } catch (err) {
      console.error(`  ✗  ${target.label} — ${(err as Error).message}\n`)
    }
  }

  await writeClaudeMd(cwd)

  if (installed === 0) {
    console.log('  No existing editor configs detected.')
    console.log('  Created .mcp.json for Claude Code in the current directory.\n')
    console.log('  To add to other editors manually, insert this into their MCP config:\n')
    console.log(
      `  "coast-ai-skills": ${JSON.stringify(STANDARD_ENTRY, null, 4).replace(/\n/g, '\n  ')}\n`
    )
  } else {
    const word = installed === 1 ? 'target' : 'targets'
    console.log(`Installed to ${installed} ${word}. Restart your editor to activate.\n`)
  }

  console.log(
    'Agents can now call search_skills(), list_skills(), and get_skill() via MCP.'
  )
}
