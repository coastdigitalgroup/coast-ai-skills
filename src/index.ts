#!/usr/bin/env node
import { install } from './install.js'
import { startServer } from './server.js'

const args = process.argv.slice(2)

if (args.includes('--install')) {
  install().catch((err: Error) => {
    console.error(err.message)
    process.exit(1)
  })
} else {
  // Default: run as MCP server (stdio transport)
  startServer().catch((err: Error) => {
    console.error(err.message)
    process.exit(1)
  })
}
