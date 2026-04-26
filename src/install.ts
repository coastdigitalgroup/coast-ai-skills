import { access, mkdir, readFile, writeFile } from 'fs/promises'
import { homedir } from 'os'
import { dirname, join } from 'path'

const CLAUDE_MD_BLOCK = `
## Skills

Before starting any task, call \`search_skills()\` with keywords describing
the goal. If a relevant skill exists, load it with \`get_skill()\` before
proceeding. Call \`list_skills()\` to browse all available skills by category.
`

const MCP_ENTRY = {
  command: 'npx',
  args: ['-y', '@coastdigitalgroup/coastai-skills']
}

interface ConfigTarget {
  label: string
  path: string
  // Whether to create the file if it doesn't exist yet
  createIfMissing: boolean
}

function getTargets(): ConfigTarget[] {
  const home = homedir()
  const cwd = process.cwd()
  const appData = process.env['APPDATA'] ?? join(home, 'AppData', 'Roaming')

  return [
    {
      label: 'Claude Code',
      path: join(cwd, '.mcp.json'),
      createIfMissing: true
    },
    {
      label: 'Claude Desktop (macOS)',
      path: join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json'),
      createIfMissing: false
    },
    {
      label: 'Claude Desktop (Windows)',
      path: join(appData, 'Claude', 'claude_desktop_config.json'),
      createIfMissing: false
    },
    {
      label: 'Cursor',
      path: join(cwd, '.cursor', 'mcp.json'),
      createIfMissing: false
    },
    {
      label: 'Windsurf',
      path: join(home, '.codeium', 'windsurf', 'mcp_config.json'),
      createIfMissing: false
    }
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

  console.log(`  ✓  CLAUDE.md — skills instruction written\n`)
}

export async function install(): Promise<void> {
  console.log('@coastdigitalgroup/coastai-skills — installer\n')

  const cwd = process.cwd()
  const targets = getTargets()
  let installed = 0

  for (const target of targets) {
    const exists = await fileExists(target.path)

    if (!exists && !target.createIfMissing) continue

    const config = await readJson(target.path)

    if (!config['mcpServers'] || typeof config['mcpServers'] !== 'object') {
      config['mcpServers'] = {}
    }

    ;(config['mcpServers'] as Record<string, unknown>)['coast-ai-skills'] = MCP_ENTRY

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
      `  "coast-ai-skills": ${JSON.stringify(MCP_ENTRY, null, 4).replace(/\n/g, '\n  ')}\n`
    )
  } else {
    const word = installed === 1 ? 'target' : 'targets'
    console.log(`Installed to ${installed} ${word}. Restart your editor to activate.\n`)
  }

  console.log('Usage: agents can now call list_skills() and get_skill(name) via MCP.')
}
