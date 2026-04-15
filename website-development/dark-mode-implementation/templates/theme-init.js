/**
 * Critical Theme Initialization
 * Place this script inside the <head> of your HTML, BEFORE any CSS or body content.
 * It must be a blocking script to prevent the Flash of Unstyled Theme (FOUC).
 */
;(function () {
  const STORAGE_KEY = 'theme' // Adjust this to match your app's convention
  const savedTheme = localStorage.getItem(STORAGE_KEY)
  const systemPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light')

  // Apply the theme to the root element
  document.documentElement.setAttribute('data-theme', theme)

  // Sync the browser's UI (scrollbars, form controls)
  document.documentElement.style.colorScheme = theme
})()
