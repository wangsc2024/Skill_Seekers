---
name: chrome-devtools
description: Chrome browser developer tools for web debugging and performance
version: 1.0.0
---

# Chrome DevTools Skill

## Overview
Chrome DevTools is a set of web developer tools built directly into the Google Chrome browser. It provides comprehensive capabilities for web development, debugging, performance analysis, and optimization. Essential for frontend development, debugging JavaScript, analyzing network requests, and optimizing web performance.

## When to Use This Skill
Use this skill when working with:
- Debugging JavaScript code and errors
- Inspecting and modifying HTML/CSS
- Analyzing network requests and responses
- Performance profiling and optimization
- Memory leak detection and analysis
- Mobile device emulation
- Core Web Vitals measurement (LCP, CLS, INP)

## Quick Reference

### Opening DevTools

| Method | Action |
|--------|--------|
| `F12` | Open DevTools |
| `Ctrl+Shift+I` (Windows/Linux) | Open DevTools |
| `Cmd+Option+I` (Mac) | Open DevTools |
| `Ctrl+Shift+J` | Open Console directly |
| `Ctrl+Shift+C` | Inspect element mode |
| Right-click → Inspect | Open to Elements panel |

## Main Panels

### 1. Elements Panel

Inspect and modify the DOM and CSS in real-time.

**DOM Inspection:**
```html
<!-- Right-click element → Inspect -->
<!-- Navigate DOM tree -->
<!-- Double-click to edit -->
<div class="container">
  <h1>Edit me</h1>
</div>
```

**CSS Editing:**
- View computed styles
- Edit styles in real-time
- Add new CSS rules
- Toggle CSS properties on/off
- View box model

**Key Features:**
- `Ctrl+F` - Search DOM
- `H` - Hide selected element
- `Delete` - Remove element
- Drag & drop to reorder elements

### 2. Console Panel

Interactive JavaScript shell and log viewer.

**Console Methods:**
```javascript
// Basic logging
console.log('Info message');
console.warn('Warning message');
console.error('Error message');

// Styled output
console.log('%cStyled text', 'color: blue; font-size: 20px');

// Table format
console.table([{name: 'John', age: 30}, {name: 'Jane', age: 25}]);

// Grouping
console.group('User Details');
console.log('Name: John');
console.log('Age: 30');
console.groupEnd();

// Timing
console.time('operation');
// ... code ...
console.timeEnd('operation');

// Stack trace
console.trace('Trace message');

// Assertions
console.assert(1 === 2, 'This will show');
```

**Console Utilities:**
```javascript
// Select elements
$('selector')      // querySelector
$$('selector')     // querySelectorAll
$0                 // Last inspected element
$_                 // Last evaluated result

// Monitor functions
monitor(functionName)    // Log function calls
monitorEvents(element)   // Log all events

// Copy to clipboard
copy(object)

// Clear console
clear()
```

### 3. Sources Panel

Debug JavaScript with breakpoints and step-through debugging.

**Breakpoint Types:**
```javascript
// Line breakpoint - Click line number

// Conditional breakpoint - Right-click line number
// Condition: user.id === 5

// Logpoint - Log without pausing
// Log: "User:", user.name

// DOM breakpoint - Elements panel → Break on...
// - Subtree modifications
// - Attribute modifications
// - Node removal

// XHR breakpoint - Sources → XHR Breakpoints
// Break when URL contains: /api/users

// Event listener breakpoint - Sources → Event Listener Breakpoints
// Mouse → click
```

**Debugging Controls:**
| Key | Action |
|-----|--------|
| `F8` | Resume/Pause |
| `F10` | Step over |
| `F11` | Step into |
| `Shift+F11` | Step out |
| `Ctrl+\` | Toggle breakpoint |

**Watch Expressions:**
```javascript
// Add in Watch panel:
user.name
items.length
isAuthenticated
```

### 4. Network Panel

Analyze all network requests.

**Filter Options:**
- All, Fetch/XHR, JS, CSS, Img, Media, Font, Doc, WS, Manifest
- Filter by URL pattern
- Invert filters

**Request Details:**
- Headers (request/response)
- Payload (POST data)
- Preview (formatted response)
- Response (raw data)
- Timing (waterfall)
- Cookies

**Throttling:**
```
Presets:
- Fast 3G (562.5 kbps, 40ms RTT)
- Slow 3G (50 kbps, 400ms RTT)
- Offline

Custom: Set download, upload, latency
```

**Individual Request Throttling (Chrome 2025):**
Right-click specific request → Throttle → Select speed

**Useful Features:**
```javascript
// Copy as cURL
// Right-click request → Copy → Copy as cURL

// Block requests
// Right-click → Block request URL

// Replay XHR
// Right-click XHR → Replay XHR
```

### 5. Performance Panel

Profile runtime performance and Core Web Vitals.

**Recording:**
1. Click Record (or `Ctrl+E`)
2. Interact with page
3. Stop recording
4. Analyze results

**Key Metrics:**
- **FPS** - Frames per second (target: 60)
- **CPU** - JavaScript execution time
- **NET** - Network activity
- **HEAP** - Memory usage

**Core Web Vitals (Live Metrics):**
```
LCP (Largest Contentful Paint): < 2.5s
CLS (Cumulative Layout Shift): < 0.1
INP (Interaction to Next Paint): < 200ms
```

**CPU Throttling Calibration (Chrome 134+):**
- Auto-generates device-specific throttling
- "Low-tier mobile" preset
- "Mid-tier mobile" preset

**Flame Chart Analysis:**
- Yellow = JavaScript
- Purple = Rendering
- Green = Painting
- Gray = System

### 6. Memory Panel

Detect memory leaks and analyze heap usage.

**Snapshot Types:**
1. **Heap Snapshot** - Current memory state
2. **Allocation Timeline** - Memory over time
3. **Allocation Sampling** - Low-overhead profiling

**Finding Memory Leaks:**
```javascript
// 1. Take initial snapshot
// 2. Perform suspected leaking action
// 3. Take second snapshot
// 4. Compare snapshots
// 5. Look for growing object counts
```

**Views:**
- Summary - Objects by constructor
- Comparison - Diff between snapshots
- Containment - Object hierarchy
- Statistics - Memory breakdown

### 7. Application Panel

Inspect storage and service workers.

**Storage:**
- Local Storage
- Session Storage
- IndexedDB
- Cookies
- Cache Storage

**Clearing Storage:**
```
Application → Storage → Clear site data
- Unregister service workers
- Clear storage
- Clear cache
```

**Service Workers:**
- View registered workers
- Update on reload
- Bypass for network
- Push/Sync events

### 8. Lighthouse Panel

Automated auditing for performance, accessibility, SEO.

**Categories:**
- Performance
- Accessibility
- Best Practices
- SEO
- Progressive Web App

**Running Audit:**
1. Select categories
2. Choose device (Mobile/Desktop)
3. Generate report
4. Review recommendations

## AI-Assisted Debugging (2025)

**Gemini Integration:**
- Analyze console errors
- Get code suggestions
- Understand performance issues
- Style recommendations

**Chrome DevTools MCP:**
```javascript
// Allows AI coding agents to:
// - Control Chrome browser
// - Access DevTools data
// - Analyze performance traces
// - Cross-reference with source code
```

## Common Workflows

### Debug JavaScript Error

1. Open Console - See error with stack trace
2. Click file:line - Jump to Sources
3. Set breakpoint - Click line number
4. Refresh page - Execution pauses
5. Inspect variables - Scope panel
6. Step through code - F10/F11

### Analyze Slow Page Load

1. Open Network panel
2. Clear and refresh with `Ctrl+Shift+R`
3. Look at waterfall chart
4. Identify blocking resources
5. Check large files
6. Use throttling to simulate slow connections

### Find Memory Leak

1. Open Memory panel
2. Take heap snapshot
3. Perform action multiple times
4. Take another snapshot
5. Compare snapshots
6. Look for growing arrays/objects

### Mobile Testing

1. Toggle device toolbar (`Ctrl+Shift+M`)
2. Select device preset or custom size
3. Throttle CPU and network
4. Test touch events
5. Check responsive breakpoints

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command menu |
| `Ctrl+P` | Open file |
| `Ctrl+G` | Go to line |
| `Ctrl+F` | Search in panel |
| `Ctrl+Shift+F` | Search all files |
| `Esc` | Toggle console drawer |
| `Ctrl+[` / `Ctrl+]` | Switch panels |

## Best Practices

1. **Use Source Maps** - Debug original source, not minified
2. **Set Conditional Breakpoints** - Avoid pausing unnecessarily
3. **Use Network Throttling** - Test real-world conditions
4. **Profile Before Optimizing** - Find actual bottlenecks
5. **Save Recordings** - Export for sharing/comparison
6. **Use Workspaces** - Edit files directly from DevTools

## Reference Documentation
- Official Docs: https://developer.chrome.com/docs/devtools/
- What's New: https://developer.chrome.com/docs/devtools/news/
- Performance Guide: https://developer.chrome.com/docs/devtools/performance
