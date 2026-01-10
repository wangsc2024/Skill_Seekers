---
name: vue-devtools
description: Browser extension for debugging Vue.js applications
version: 1.0.0
---

# Vue DevTools Skill

## Overview
Vue DevTools is a browser extension for debugging Vue.js applications. It provides powerful inspection and debugging capabilities for Vue components, state management (Vuex/Pinia), routing, and performance monitoring. Current version is 7.7.7 (supports Vue 3).

## When to Use This Skill
Use this skill when working with:
- Debugging Vue.js applications
- Inspecting component hierarchy and props
- Monitoring and editing component state
- Debugging Vuex/Pinia state management
- Analyzing Vue Router navigation
- Performance profiling Vue components
- Time-travel debugging

## Quick Reference

### Installation

**Chrome Extension:**
1. Visit Chrome Web Store
2. Search "Vue.js devtools"
3. Install extension (v7 for Vue 3, v6 for Vue 2)

**Firefox Extension:**
1. Visit Firefox Add-ons
2. Search "Vue.js devtools"
3. Install add-on

**Standalone App (Electron):**
```bash
npm install -g @vue/devtools
vue-devtools
```

**Vite Plugin:**
```typescript
// vite.config.ts
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
  ],
})
```

### Version Compatibility
| Vue Version | DevTools Version |
|-------------|------------------|
| Vue 3.x     | v7.x (latest)    |
| Vue 2.x     | v6.x (legacy)    |

## Key Features

### 1. Component Inspector

The Components tab displays all Vue components in your application:

**Left Panel:**
- Component tree hierarchy
- Search/filter components
- Component highlighting on hover

**Right Panel:**
- Props (with types and values)
- Data (reactive state)
- Computed properties
- Vuex/Pinia bindings
- Emitted events
- Setup variables (Composition API)

**Usage:**
1. Open DevTools (F12)
2. Navigate to "Vue" tab
3. Click on any component to inspect
4. Hover over component to highlight in page

### 2. State Editing

Edit component state directly in DevTools:

```javascript
// Enable editing in Settings first
// Then modify:
data: {
  count: 5,        // Change numbers
  name: "Updated", // Change strings
  isActive: true,  // Toggle booleans
  items: [1, 2, 3] // Modify arrays
}
```

**Steps:**
1. Go to Settings tab
2. Enable "Edit component data"
3. Select component in tree
4. Click on values to edit

### 3. Vuex/Pinia State Management

**Vuex Debugging:**
- View entire store state
- Track mutations history
- Time-travel to previous states
- Commit mutations manually

**Pinia Debugging:**
- Inspect all stores
- View state, getters, actions
- Track state changes
- Edit state directly

```javascript
// Example mutation tracking
mutations: [
  { type: 'INCREMENT', payload: 1, time: '10:30:45' },
  { type: 'SET_USER', payload: { id: 1 }, time: '10:30:46' },
]
```

### 4. Time Travel Debugging

Navigate through state history:

1. Open Vuex/Pinia tab
2. View mutation/action history
3. Click "Time Travel" on any entry
4. App reverts to that state
5. Useful for debugging state bugs

**Labels in timeline:**
- **M** - Mutation occurred
- **E** - Event was fired
- **R** - Route changed

### 5. Vue Router Inspection

**Routes Tab:**
- View all registered routes
- See route metadata and params
- Track navigation history

**History View:**
```javascript
// Navigation history example
[
  { path: '/', name: 'Home', params: {} },
  { path: '/users', name: 'Users', query: { page: 1 } },
  { path: '/users/123', name: 'UserDetail', params: { id: 123 } },
]
```

### 6. Events Tab

Track custom events between components:

```vue
<script setup>
const emit = defineEmits(['submit', 'cancel'])

// These will appear in Events tab
emit('submit', { data: formData })
emit('cancel')
</script>
```

**Event tracking shows:**
- Event name
- Payload data
- Source component
- Target component
- Timestamp

### 7. Performance Monitoring

**Performance Tab Features:**
- Frames per second (FPS)
- Component render times
- Lifecycle timing

**Metrics tracked:**
- Create time
- Mount time
- Update time
- Destroy time

**Usage:**
1. Go to Performance tab
2. Click "Start" to begin recording
3. Interact with your app
4. Click "Stop" to analyze
5. Components sorted by render time

### 8. Timeline View

Visual timeline of all Vue activity:

- Component lifecycle events
- State mutations
- Route changes
- Custom events
- Performance markers

## Common Workflows

### Debugging Component Props

```vue
<!-- Parent.vue -->
<Child :user="userData" :isAdmin="true" />

<!-- In DevTools -->
<!-- 1. Select Child component -->
<!-- 2. View props panel: -->
<!--    user: { name: "John", id: 1 } -->
<!--    isAdmin: true -->
```

### Finding State Bugs

1. Open Components tab
2. Find component with incorrect state
3. Check `data` and `computed` values
4. Enable editing to test fixes
5. Check Vuex/Pinia if using stores

### Performance Investigation

1. Open Performance tab
2. Record during slow interaction
3. Sort components by render time
4. Identify slow components
5. Check for unnecessary re-renders

## Troubleshooting

### DevTools Not Showing

**Problem:** Vue tab doesn't appear

**Solutions:**
1. Check Vue is running (not production minified build)
2. Refresh the page
3. Check extension is enabled for the site
4. For Vue 2, use DevTools v6

### Production Build

DevTools is disabled by default in production. To enable:

```javascript
// main.js (Vue 3)
app.config.devtools = true

// main.js (Vue 2)
Vue.config.devtools = true
```

**Note:** Only enable for debugging, not in production!

### Component Not Updating

1. Check if data is reactive
2. Verify props are being passed
3. Check computed dependencies
4. Look for mutation without reactivity

## Best Practices

1. **Use DevTools during development** - Always have it open
2. **Name your components** - Makes tree easier to navigate
3. **Use Pinia/Vuex for complex state** - Better debugging
4. **Profile before optimizing** - Find real bottlenecks
5. **Disable in production** - Security and performance

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+F` | Search components |
| `Esc` | Close panel |
| Arrow keys | Navigate tree |
| `Enter` | Expand/collapse |

## Reference Documentation
- Official Docs: https://devtools.vuejs.org/
- GitHub (v7): https://github.com/vuejs/devtools
- GitHub (v6): https://github.com/vuejs/devtools-v6
- Chrome Extension: https://chromewebstore.google.com/detail/vuejs-devtools
