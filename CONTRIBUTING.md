# Contributing to Coast AI Skills

Thanks for helping build the library of reusable AI skills! This repository contains modules and tools to be used across the Coast AI ecosystem.

## How to Contribute

1. **New Skills**: We welcome any new skills that broaden the capabilities of Coast AI agents.
2. **Bug Fixes**: Open an issue if you find a bug in an existing skill.
3. **Enhancements**: Propose improvements to existing skills via feature requests or PRs.

## File Organization

Skills are categorized by their function:
- `webdesign/`: Style and layout related skills.
- `data/`: Data extraction and processing.
- `integrations/`: Third-party service connectors.

Example structure for a new skill:
```
webdesign/
├── my-new-skill/
│   ├── SKILL.md      # Documentation and instructions
│   ├── scripts/      # Any helper scripts
│   └── examples/     # Code examples
```

## Pull Request Process

1. **Branch from `main`**.
2. **Document your skill**: Every skill must have a `SKILL.md` explaining how to use it.
3. **Include examples**: Show how the skill functions.
4. **Open a PR** describing the new skill or enhancement.

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/phcdevworks/coast-ai-skills.git
   cd coast-ai-skills
   ```
2. Open in VS Code using the workspace file:
   ```bash
   code coast-ai-skills.code-workspace
   ```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
