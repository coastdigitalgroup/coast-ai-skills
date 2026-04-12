# Form Optimization Specification Template

Use this template to document the proposed changes for a form optimization
project.

## 1. Project Overview

- **Form Name/Location:** [e.g., Homepage Lead Magnet]
- **Current Completion Rate:** [e.g., 5.2%]
- **Target Completion Rate:** [e.g., 8.0%]
- **Primary Goal:** [e.g., Get users to download the whitepaper]

## 2. Proposed Field Changes

| Current Field | Action (Keep/Kill/Delay) | New Label/Placeholder | Validation Rule        |
| :------------ | :----------------------- | :-------------------- | :--------------------- |
| First Name    | Keep                     | First Name            | Required               |
| Last Name     | Kill                     | -                     | -                      |
| Work Email    | Keep                     | Work Email            | Required, Email Format |
| Phone Number  | Delay (Thank you page)   | -                     | -                      |
| Company Size  | Keep                     | How many employees?   | Required, Select Menu  |

## 3. Interaction Design Specs

- **Logic Type:** [Single Step / Multi-step]
- **Trigger Logic:** [e.g., Show Step 2 after Email is entered]
- **CTA Text:** [e.g., Get My Free Audit]
- **Microcopy/Trust Signal:** [e.g., "No credit card required. 100% Secure."]

## 4. Mobile Configuration

- **Email Field:** `type="email"`, `autocomplete="email"`
- **Number Fields:** `inputmode="numeric"`, `pattern="[0-9]*"`
- **Autofill Support:** Ensure `name` and `autocomplete` attributes match
  standard browser expectations.

## 5. Success State

- **Redirect URL:** [URL to Thank You Page]
- **On-Page Message:** [e.g., "Success! Check your inbox in 2 minutes."]
