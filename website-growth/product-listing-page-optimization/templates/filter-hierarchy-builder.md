# Filter Hierarchy Builder

Use this template to define which filters should be prioritized for a specific
category.

| Priority        | Filter Type                | Display Logic             | Why?                                                          |
| :-------------- | :------------------------- | :------------------------ | :------------------------------------------------------------ |
| **P1 (Top)**    | e.g., Size / Compatibility | Expanded by default       | The #1 reason for "not-buying" is lack of fit/compatibility.  |
| **P2 (Middle)** | e.g., Price Range          | Expanded by default       | Most users have a budget constraint.                          |
| **P3 (Middle)** | e.g., Color / Style        | Collapsed or Multi-select | Visual preferences are secondary to utility (P1/P2).          |
| **P4 (Bottom)** | e.g., Brand / Material     | Collapsed                 | Secondary attributes used by power users or specific seekers. |

## Filter Type Decision Logic

- Use **Checkboxes** for attributes where users might want multiple (e.g.,
  "Blue" AND "Green").
- Use **Swatches** for visual attributes (Colors, Patterns).
- Use **Sliders** for continuous ranges (Price, Weight).
- Use **Buttons/Chips** for discrete, small sets (Size: S, M, L).
