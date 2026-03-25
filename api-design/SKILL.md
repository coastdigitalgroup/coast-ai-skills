---
name: api-design
description: Design and review APIs with clear resource modeling, predictable naming, safe evolution, and practical error handling. Use when defining HTTP or RPC interfaces, shaping request and response contracts, reviewing endpoint consistency, or improving API usability.
---

# API Design

Design interfaces that are easy to understand and hard to misuse.

## Core Approach

- Model around resources, actions, and business concepts rather than database tables.
- Keep naming consistent across endpoints, fields, and errors.
- Prefer predictable response shapes over clever shortcuts.
- Design for evolution so new fields and behaviors can be added safely.
- Make failure modes understandable to both humans and clients.

## Working Pattern

1. Identify the primary resources and operations.
2. Define the happy-path contract first.
3. Add validation rules, pagination, filtering, and error semantics.
4. Check whether names and shapes stay consistent across related endpoints.
5. Review how the API will evolve without breaking clients.

## Guardrails

- Avoid ambiguous field names.
- Avoid mixing unrelated concerns into one endpoint.
- Avoid response shapes that vary without clear signaling.
- Avoid leaking storage details when they do not help clients.

## References

- Read [references/checklist.md](references/checklist.md) when reviewing a new or existing API.
