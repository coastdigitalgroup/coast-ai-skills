# Security Policy

## Supported versions

Security updates are applied to the current major version only.

| Version | Supported |
| ------- | --------- |
| 0.x.x (current) | ✓ |

Always use the most recent published version of `@coastdigitalgroup/coastai-skills`.

## Reporting a vulnerability

Do not open a public issue for security vulnerabilities.

**Preferred:** Use [GitHub Security Advisories](https://github.com/coastdigitalgroup/coast-ai-skills/security/advisories/new) to report privately.

**Alternative:** Email the maintainers or send a direct message through GitHub.

Include as much detail as possible:

1. Description of the vulnerability and potential impact
2. Steps to reproduce or proof of concept
3. Affected versions (if known)
4. Suggested mitigation (if you have one)

### Response timeline

- **Acknowledgment:** within 48 hours
- **Initial assessment:** within 5 business days
- **Resolution:** coordinated with you before public disclosure
- **Credit:** you will be credited in the advisory unless you prefer otherwise

## Security best practices

When using this package:

- **Do not commit secrets** — no API keys, credentials, or tokens inside skill files
- **Review skill content** before sharing outside the organization — skill files may contain internal process context
- **Keep the package updated** — run `npm update @coastdigitalgroup/coastai-skills` periodically

### MCP server considerations

The MCP server runs as a local process on the user's machine via stdio transport. It does not make network requests, does not store data, and does not expose any ports. Skills are read from the installed npm package at runtime.

- The server has read access to the skill files bundled in the npm package
- It does not read from the user's project files or filesystem beyond what is explicitly requested
- No telemetry or analytics are collected

## Scope

This policy covers:

- The npm package `@coastdigitalgroup/coastai-skills` and its MCP server
- Skill file content and structure
- The `--install` command and config file modifications

This policy does not cover:

- Vulnerabilities in MCP client applications (Claude Code, Cursor, etc.)
- Third-party editors or tools consuming the MCP server
- Infrastructure outside this repository

## Contact

For non-vulnerability security questions, open a [GitHub Discussion](https://github.com/coastdigitalgroup/coast-ai-skills/discussions).
