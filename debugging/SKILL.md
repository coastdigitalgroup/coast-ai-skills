---
name: debugging
description: Diagnose bugs and unstable behavior through systematic reproduction, evidence gathering, narrowing, and verification. Use when investigating regressions, runtime errors, flaky behavior, unexpected outputs, or hard-to-explain failures in software systems.
---

# Debugging

Debug by reducing uncertainty, not by guessing.

## Core Approach

- Reproduce the issue before changing code.
- Gather observable evidence from logs, inputs, outputs, and environment details.
- Narrow the failure surface one assumption at a time.
- Fix the root cause when practical, not just the symptom.
- Verify both the failing case and nearby behavior after the fix.

## Working Pattern

1. State the expected behavior and the actual behavior.
2. Find the smallest reliable reproduction.
3. Identify likely layers involved: input, state, network, persistence, rendering, timing, or configuration.
4. Add targeted instrumentation only where it reduces uncertainty.
5. Form a hypothesis, test it, and discard it quickly if the evidence does not fit.
6. Validate the fix against the original reproduction.

## Guardrails

- Do not skip reproduction unless the issue is already fully understood.
- Do not make multiple speculative changes at once.
- Do not trust stale assumptions about environment or data shape.
- Prefer measurable evidence over intuition.

## Output Expectations

- Explain the suspected cause clearly.
- Show the steps used to confirm it.
- Keep the eventual fix as small as the problem allows.
