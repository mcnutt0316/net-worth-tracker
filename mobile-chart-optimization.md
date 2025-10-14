# Mobile Chart Optimization - Learning Guide

## Problem Statement
The NetWorthChart component (`src/components/trends/NetWorthChart.tsx`) has Y-axis values that take up too much screen space on mobile devices, especially with 6-digit values.

**Current Issue**: Line 50 has `width={100}` which takes 25%+ of mobile screens (375px wide)

## Solution Plan

### Solution 1: Responsive YAxis Width ✅
Make the Y-axis narrower on mobile devices.

**Target**:
- Mobile (<768px): 50px width
- Desktop (≥768px): 100px width

### Solution 2: Abbreviated Number Formatter ✅
Format large numbers as "K" (thousands) or "M" (millions) instead of full digits.

**Examples**:
- `$35,116` → `$35K`
- `$1,250,000` → `$1.25M`
- `$750` → `$750`

**Important**: Keep full precision in the Tooltip (line 49) for accuracy on hover!

---

## Implementation Guide

### Part 1: Abbreviated Number Formatter (Start Here - Easier!)

**File**: `src/components/trends/NetWorthChart.tsx`

**Task**: Create a helper function to format currency with abbreviations.

```typescript
const formatCurrency = (value: number) => {
  // Your implementation here
}
```

**Logic to implement**:
1. If `value >= 1,000,000`: divide by 1,000,000 and add "M"
2. If `value >= 1,000`: divide by 1,000 and add "K"
3. Otherwise: show full number
4. Handle negative numbers (debts!)
5. Add "$" symbol
6. Round to 1 decimal place (`.toFixed(1)`)
7. Remove unnecessary ".0" (e.g., "$35.0K" → "$35K")

**Where to use it**:
- Replace `tickFormatter` on line 50
- DO NOT change line 49's tooltip formatter (keep full precision)

**Test cases**:
- `formatCurrency(35116)` → `"$35K"`
- `formatCurrency(1250000)` → `"$1.25M"`
- `formatCurrency(750)` → `"$750"`
- `formatCurrency(-50000)` → `"-$50K"`

---

### Part 2: Responsive Width with useState/useEffect

**Concepts Needed**:
- `useState` - to track window width
- `useEffect` - to run code on component mount
- Event listeners - to detect window resize
- Cleanup functions - to remove listeners

**Implementation Steps**:

1. **Import hooks** (if not already imported):
   ```typescript
   import { useState, useEffect } from "react"
   ```

2. **Add state for window width**:
   ```typescript
   const [windowWidth, setWindowWidth] = useState(1024) // Start with desktop
   ```

3. **Add useEffect to track window size**:
   ```typescript
   useEffect(() => {
     // Set initial width
     setWindowWidth(window.innerWidth)

     // Create resize handler
     const handleResize = () => setWindowWidth(window.innerWidth)

     // Add event listener
     window.addEventListener('resize', handleResize)

     // Cleanup function (runs when component unmounts)
     return () => window.removeEventListener('resize', handleResize)
   }, []) // Empty dependency array = run once on mount
   ```

4. **Use conditional width on YAxis** (line 50):
   ```typescript
   width={windowWidth < 768 ? 50 : 100}
   ```

---

## SSR/Hydration Deep Dive

### The Problem
- **Server** (Next.js): No `window` object exists (Node.js environment)
- **Client** (Browser): `window` exists
- **Hydration**: React compares server HTML vs client HTML - they must match!

### Why Start with `1024`?
- Server renders with `1024` → Assumes desktop → Generates valid HTML
- Browser mounts → `useEffect` runs → Updates to real `window.innerWidth`
- No hydration error! (Server and initial client render match)

### Alternative: Start with `768` (Mobile-First)
**Pros**: Less flash on mobile devices (most users)
**Cons**: Desktop users see a brief flash

**Question to explore**: Which approach is better for your user base?

---

## Testing Checklist

After implementation, test:

- [ ] Desktop view (>768px) shows 100px width
- [ ] Mobile view (<768px) shows 50px width
- [ ] Resizing browser updates width in real-time
- [ ] Numbers ≥1M show as "M" (e.g., "$1.2M")
- [ ] Numbers ≥1K show as "K" (e.g., "$35K")
- [ ] Numbers <1K show full value (e.g., "$750")
- [ ] Negative numbers work (e.g., "-$50K")
- [ ] Tooltip still shows full precision (e.g., "$35,116.00")
- [ ] No hydration warnings in console
- [ ] No "window is not defined" errors

---

## Advanced Challenges (Optional)

### Challenge 1: Performance Optimization
**Problem**: Resize listener fires many times per second during window resize.

**Solution**: Implement debouncing or throttling.
- **Debounce**: Wait until user stops resizing for X milliseconds
- **Throttle**: Only update every X milliseconds while resizing

**Libraries**: `lodash.debounce` or write your own!

### Challenge 2: CSS Custom Properties
**Concept**: Use CSS media queries to set a CSS variable, read it in JavaScript.

```css
:root {
  --chart-y-width: 100px;
}

@media (max-width: 768px) {
  --chart-y-width: 50px;
}
```

Then in JS: `getComputedStyle(document.documentElement).getPropertyValue('--chart-y-width')`

### Challenge 3: Why 768px?
Research Tailwind's breakpoint system:
- `sm`: 640px
- `md`: 768px ← We use this
- `lg`: 1024px

Why use `md` instead of `sm` or `lg`?

---

## Resources

### React Hooks
- [useState docs](https://react.dev/reference/react/useState)
- [useEffect docs](https://react.dev/reference/react/useEffect)

### SSR/Hydration
- [Next.js SSR overview](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering)
- [React Hydration explained](https://react.dev/reference/react-dom/client/hydrateRoot)

### Alternative: react-responsive
- [react-responsive](https://www.npmjs.com/package/react-responsive)
- Pros: Handles SSR automatically
- Cons: 40KB package for simple use case
- **Verdict**: Overkill for this project, but good to know exists!

---

## Progress Tracker

- [ ] **Part 1**: Create `formatCurrency()` helper function
- [ ] **Part 1**: Apply formatter to YAxis `tickFormatter`
- [ ] **Part 1**: Test abbreviated numbers (K, M)
- [ ] **Part 2**: Add `useState` for window width
- [ ] **Part 2**: Add `useEffect` with resize listener
- [ ] **Part 2**: Add cleanup function
- [ ] **Part 2**: Apply conditional width to YAxis
- [ ] **Testing**: Verify all test cases pass
- [ ] **Testing**: Check console for errors/warnings

---

## Current File State

**File**: `src/components/trends/NetWorthChart.tsx`

**Lines to modify**:
- Line 3-4: Add `useState, useEffect` imports
- After line 19: Add window width state + useEffect
- Line 50: Update YAxis with `tickFormatter={formatCurrency}` and `width={windowWidth < 768 ? 50 : 100}`

**DO NOT modify**:
- Line 49: Keep tooltip formatter with full precision

---

## Questions & Notes

Add your questions, discoveries, and notes here as you work:

-

---

## Completion

When done, update `CLAUDE.md` with:
```markdown
## Completed Features
- **Mobile-Optimized Chart** (Oct 14, 2025): Responsive Y-axis width and abbreviated number formatting ✅
  - Implemented responsive width (50px mobile, 100px desktop)
  - Created custom currency formatter with K/M abbreviations
  - Maintained full precision in tooltips
  - File: `src/components/trends/NetWorthChart.tsx`
```
