# Security Policy

## Supported Versions

We aim to support the latest published version of CoastAi Skills. Security updates are applied to the current major version only.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

**Please ensure you are using the most recent version** of this repository.

Older releases may not receive security fixes.

## Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT** open a public issue. Security issues should be reported privately to protect users.

### How to Report

**Preferred method**: Use [GitHub Security Advisories](https://github.com/coastdigitalgroup/coast-ai-skills/security/advisories/new) to privately report vulnerabilities

**Alternative methods**:

- Email the maintainers at [security contact - see repository]
- Direct message maintainers through GitHub

### What to Include

Please provide as much detail as possible to help us reproduce and assess impact:

1. **Description of the vulnerability** and potential impact
2. **Steps to reproduce** or proof-of-concept
3. **Affected versions** (if known)
4. **Potential attack scenarios**
5. **Suggested mitigation** (if you have ideas)

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt within **48 hours**
2. **Assessment**: We will investigate and provide an initial assessment within **5 business days**
3. **Updates**: We will keep you informed of the fix status throughout the process
4. **Resolution**: We will work on a fix and coordinate disclosure timing with you
5. **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)

## Responsible Disclosure

We appreciate responsible disclosure and will work with you to:

- Understand the scope and severity of the issue
- Develop and test a fix
- Coordinate public disclosure timing
- Credit your contribution (if desired)

**Please allow us reasonable time to address the issue before public disclosure.**

## Security Best Practices

When using CoastAi Skills:

1. **Keep the repository private** if it contains proprietary Skill instructions or sensitive system prompts
2. **Review access permissions** regularly for collaborators
3. **Avoid committing secrets** — no API keys, passwords, or credentials inside Skill files
4. **Review Skill content** before sharing outside the organization — Skill files may contain internal persona and process context

## Scope

This security policy covers:

- The Skills repository structure and Skill files
- Repository access and permissions
- Skill instruction content and embedded persona data

This policy does **NOT** cover:

- Vulnerabilities in Google Gemini or the Skills platform (report to Google)
- Third-party tools or integrations consuming these Skill files
- Underlying infrastructure outside this repository

## Contact

For security-related questions that aren't vulnerabilities:

- Open a [GitHub Discussion](https://github.com/coastdigitalgroup/coast-ai-skills/discussions)
- Tag maintainers in relevant issues

Thank you for helping keep this Skill library and our community safe!

