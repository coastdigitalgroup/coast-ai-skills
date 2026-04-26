import { readdir, readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

export interface Skill {
  name: string
  description: string
  category: string
  content: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// In dist/, __dirname is <root>/dist — skills live one level up
export const SKILLS_ROOT = join(__dirname, '..')

const EXCLUDED_DIRS = new Set([
  'src', 'dist', 'node_modules', 'bin', '.git', '.github', '.cursor'
])

function parseFrontmatter(content: string): { name: string; description: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { name: '', description: '' }

  const yaml = match[1]

  const nameMatch = yaml.match(/^name:\s*(.+)$/m)
  const blockDescMatch = yaml.match(/^description:\s*\n((?:[ \t]+.+\n?)+)/m)
  const inlineDescMatch = yaml.match(/^description:\s*(.+)$/m)

  const name = nameMatch ? nameMatch[1].trim() : ''

  let description = ''
  if (blockDescMatch) {
    description = blockDescMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' ')
  } else if (inlineDescMatch) {
    description = inlineDescMatch[1].trim()
  }

  return { name, description }
}

export async function getCategories(): Promise<string[]> {
  try {
    const entries = await readdir(SKILLS_ROOT, { withFileTypes: true })
    return entries
      .filter((e) => e.isDirectory() && !EXCLUDED_DIRS.has(e.name) && !e.name.startsWith('.'))
      .map((e) => e.name)
      .sort()
  } catch {
    return []
  }
}

export async function discoverSkills(filterCategory?: string): Promise<Skill[]> {
  const skills: Skill[] = []

  let categories: string[]
  try {
    const entries = await readdir(SKILLS_ROOT, { withFileTypes: true })
    categories = entries
      .filter((e) => e.isDirectory() && !EXCLUDED_DIRS.has(e.name) && !e.name.startsWith('.'))
      .map((e) => e.name)
  } catch {
    return skills
  }

  if (filterCategory) {
    categories = categories.filter((c) => c === filterCategory)
  }

  for (const category of categories) {
    let skillDirs: string[]
    try {
      const entries = await readdir(join(SKILLS_ROOT, category), { withFileTypes: true })
      skillDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name)
    } catch {
      continue
    }

    for (const skillDir of skillDirs) {
      const skillPath = join(SKILLS_ROOT, category, skillDir, 'SKILL.md')
      try {
        const content = await readFile(skillPath, 'utf-8')
        const { name, description } = parseFrontmatter(content)
        if (name) {
          skills.push({ name, description, category, content })
        }
      } catch {
        // No SKILL.md — skip
      }
    }
  }

  return skills
}

export async function getSkill(skillName: string): Promise<Skill | null> {
  const skills = await discoverSkills()
  return skills.find((s) => s.name === skillName) ?? null
}
