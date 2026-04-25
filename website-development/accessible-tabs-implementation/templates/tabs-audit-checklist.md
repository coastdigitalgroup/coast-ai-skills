# Accessible Tabs Audit Checklist

Use this checklist to verify the accessibility and technical robustness of a
tabbed interface.

## 1. Semantic Structure

- [ ] Wrapper of tab buttons has `role="tablist"`.
- [ ] `tablist` has a descriptive `aria-label` or is linked via
      `aria-labelledby`.
- [ ] Each clickable item has `role="tab"`.
- [ ] Each content block has `role="tabpanel"`.
- [ ] Each `tab` has `aria-controls` pointing to its panel's ID.
- [ ] Each `tabpanel` has `aria-labelledby` pointing to its tab's ID.

## 2. Keyboard Interoperability

- [ ] Pressing `Tab` focuses the **active** tab first.
- [ ] Inactive tabs are excluded from the `Tab` sequence (`tabindex="-1"`).
- [ ] Arrow keys (`Right`/`Left` for horizontal) move focus between tabs.
- [ ] Focus wraps around from last tab to first and vice versa.
- [ ] (If Manual) `Enter` or `Space` activates the focused tab.
- [ ] (If Automatic) Focus move automatically activates the panel.
- [ ] `Home` and `End` keys jump to the first and last tabs respectively.
- [ ] After focusing a tab, the next `Tab` press enters the panel or moves to
      the next element after the tab system (it does NOT go through inactive
      tabs).

## 3. States and Visibility

- [ ] The active tab has `aria-selected="true"`.
- [ ] Inactive tabs have `aria-selected="false"`.
- [ ] Inactive panels are hidden via the `hidden` attribute or `display: none`.
- [ ] Active panels are visible.
- [ ] The focused tab has a clear, visible focus indicator (e.g., outline).

## 4. Mobile Responsiveness

- [ ] Tabs are readable and clickable on mobile screens.
- [ ] If layout changes to vertical, `ArrowUp`/`ArrowDown` navigation is
      supported (or horizontal arrows are maintained if appropriate).
- [ ] Labels do not overflow or become truncated in an inaccessible way.

## 5. Screen Reader Experience

- [ ] Screen reader announces the `tablist` and the number of tabs (e.g., "Tab,
      1 of 3").
- [ ] Screen reader correctly identifies the selected state.
- [ ] Moving focus between tabs is announced clearly.
