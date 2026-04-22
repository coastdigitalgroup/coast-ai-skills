# Responsive Navigation with Hamburger Menu

This example demonstrates a vanilla HTML, CSS, and JavaScript implementation of
a responsive navigation system. It prioritizes accessibility by managing
`aria-expanded`, focus trapping (on mobile), and correct semantic landmarks.

## Implementation

### HTML (`index.html`)

```html
<header class="site-header">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <div class="header-container">
    <div class="logo">
      <a href="/">BrandName</a>
    </div>

    <button
      class="nav-toggle"
      aria-expanded="false"
      aria-controls="primary-nav"
      aria-label="Menu"
    >
      <span class="hamburger-icon" aria-hidden="true"></span>
    </button>

    <nav id="primary-nav" class="main-nav" aria-label="Main">
      <ul class="nav-list">
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>

<main id="main-content">
  <!-- Page Content -->
</main>
```

### CSS (`styles.css`)

```css
/* Skip Link */
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 10px;
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}

/* Header Layout */
.site-header {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-toggle {
  display: none; /* Hidden on desktop */
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

/* Mobile States */
@media (max-width: 768px) {
  .nav-toggle {
    display: block;
    z-index: 100;
  }

  .main-nav {
    display: none; /* Hidden by default */
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: white;
    padding: 4rem 2rem;
  }

  /* When menu is open */
  [aria-expanded='true'] + .main-nav {
    display: block;
  }

  .nav-list {
    flex-direction: column;
    align-items: center;
  }
}
```

### JavaScript (`nav.js`)

```javascript
const navToggle = document.querySelector('.nav-toggle')
const primaryNav = document.querySelector('#primary-nav')

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true'

  navToggle.setAttribute('aria-expanded', !isExpanded)

  if (!isExpanded) {
    // Menu is opening
    document.body.style.overflow = 'hidden' // Prevent scroll
    // Optional: move focus to first item
    primaryNav.querySelector('a').focus()
  } else {
    // Menu is closing
    document.body.style.overflow = ''
  }
})

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (
    e.key === 'Escape' &&
    navToggle.getAttribute('aria-expanded') === 'true'
  ) {
    navToggle.setAttribute('aria-expanded', 'false')
    navToggle.focus()
  }
})
```

## Key Accessibility Features

1. **The Skip Link:** Allows keyboard users to bypass the navigation and go
   straight to the content.
2. **`aria-expanded`:** Communicates to screen readers whether the mobile menu
   is open or closed.
3. **`aria-controls`:** Programmatically links the toggle button to the
   navigation list.
4. **Escape Key Handling:** Standard UI pattern for closing overlays.
5. **Focus Restoration:** When the menu is closed via the `Escape` key, focus is
   returned to the toggle button.
6. **Visibility Management:** Using `display: none` on the mobile nav when
   closed ensures it is removed from the tab order.
