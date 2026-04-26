import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool
} from '@modelcontextprotocol/sdk/types.js'
import { discoverSkills, getCategories, getSkill } from './skills.js'

function buildTools(categories: string[]): Tool[] {
  return [
    {
      name: 'list_skills',
      description:
        'List all available skills. Returns each skill name, category, and description. Use this to browse what a category contains or see the full library.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: categories,
            description: `Optional. Filter by category. Available: ${categories.join(', ')}`
          }
        }
      }
    },
    {
      name: 'search_skills',
      description:
        'Search skills by keyword or topic. Returns the most relevant skills for a given query. Call this before starting any task to find applicable skills — works across all categories regardless of domain.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'Keywords describing the task or topic, e.g. "story writing", "checkout conversion", "gardening calendar"'
          }
        },
        required: ['query']
      }
    },
    {
      name: 'get_skill',
      description:
        'Fetch the full content of a skill by name. Returns the complete SKILL.md with purpose, workflow, decision rules, constraints, and validation criteria. Use search_skills or list_skills first to find the correct name.',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The exact skill name as returned by list_skills or search_skills'
          }
        },
        required: ['name']
      }
    }
  ]
}

function scoreSkill(skill: { name: string; description: string }, query: string): number {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)
  const haystack = `${skill.name} ${skill.description}`.toLowerCase()
  return words.reduce((score, word) => score + (haystack.includes(word) ? 1 : 0), 0)
}

export async function startServer(): Promise<void> {
  const categories = await getCategories()
  const tools = buildTools(categories)

  const server = new Server(
    { name: '@coastdigitalgroup/coastai-skills', version: '0.1.0' },
    { capabilities: { tools: {} } }
  )

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }))

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params
    const params = (args ?? {}) as Record<string, string>

    if (name === 'list_skills') {
      const skills = await discoverSkills(params['category'])
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              skills.map((s) => ({ name: s.name, category: s.category, description: s.description })),
              null,
              2
            )
          }
        ]
      }
    }

    if (name === 'search_skills') {
      const query = params['query']
      if (!query) {
        return {
          content: [{ type: 'text', text: 'Missing required parameter: query' }],
          isError: true
        }
      }

      const allSkills = await discoverSkills()
      const results = allSkills
        .map((s) => ({ ...s, score: scoreSkill(s, query) }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ name: n, category, description }) => ({ name: n, category, description }))

      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No skills found matching "${query}". Try list_skills() to browse all available skills.`
            }
          ]
        }
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
      }
    }

    if (name === 'get_skill') {
      const skillName = params['name']
      if (!skillName) {
        return {
          content: [{ type: 'text', text: 'Missing required parameter: name' }],
          isError: true
        }
      }

      const skill = await getSkill(skillName)
      if (!skill) {
        return {
          content: [
            {
              type: 'text',
              text: `Skill "${skillName}" not found. Use search_skills() or list_skills() to find available skills.`
            }
          ],
          isError: true
        }
      }

      return {
        content: [{ type: 'text', text: skill.content }]
      }
    }

    throw new Error(`Unknown tool: ${name}`)
  })

  const transport = new StdioServerTransport()
  await server.connect(transport)
}
