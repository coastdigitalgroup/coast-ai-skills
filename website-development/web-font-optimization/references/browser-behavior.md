# Browser Behavior & Font Loading

Understanding how browsers handle fonts is key to effective optimization.

## FOIT vs. FOUT

| Term     | Full Name               | Description                                                       | Browser Default Behavior                                     |
| :------- | :---------------------- | :---------------------------------------------------------------- | :----------------------------------------------------------- |
| **FOIT** | Flash of Invisible Text | Text is hidden until the custom font finishes loading.            | Chrome/Firefox/Safari wait up to 3s before showing fallback. |
| **FOUT** | Flash of Unstyled Text  | Fallback font is shown immediately, then swapped for custom font. | Occurs when using `font-display: swap`.                      |

## font-display Values

- `auto`: Browser default (usually FOIT).
- `block`: Give the font a short block period (3s) and an infinite swap period.
  (Use for icons).
- `swap`: Give the font a zero block period and an infinite swap period.
  (Recommended for body text).
- `fallback`: Give the font a very small block period (100ms) and a short swap
  period (3s).
- `optional`: Give the font a very small block period (100ms) and zero swap
  period. If it's not cached, the browser won't use it for the current page
  load.

## Font Formats

- **WOFF2 (Web Open Font Format 2.0):** The industry standard. Offers ~30%
  better compression than WOFF. Supported by 97%+ of browsers.
- **WOFF:** Legacy standard. Use only if IE11 support is strictly required.
- **TTF/OTF:** Raw formats. Not optimized for the web; should be converted to
  WOFF2.

## Resource Prioritization

- **Preload:** High priority. Use for the font needed for the first paint.
- **Async CSS:** Loading the `@font-face` declarations in a non-blocking way can
  help, but preloading the font file itself is usually more effective.
- **Crossorigin:** Mandatory for fonts. Even if the font is on the same origin,
  the spec requires that fonts are fetched using anonymous mode CORS.
