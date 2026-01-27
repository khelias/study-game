# Game Views Standardization Plan

## Analysis Summary

After reviewing all game views, here are the key inconsistencies:

### Critical Issues
1. **Layout Shifts**: Elements appearing/disappearing cause layout jumps
2. **Inconsistent Containers**: Different padding, margins, max-widths
3. **State Management**: Mix of patterns (setTimeout(0), useEffect, derived state)
4. **Button Styles**: Inconsistent borders, sizes, hover states
5. **Feedback Display**: Some cause layout shifts, inconsistent styling
6. **RoboPathView**: Still has old stars system (should be removed)
7. **BalanceScaleView**: Uses anti-pattern (derived state in render)

### What Works Well (MathSnakeView Reference)
- Uses `clamp()` for responsive sizing
- Consistent max-width constraints
- Structured layout with clear sections
- Smooth animations without layout shifts
- Proper state management with useEffect

## Standardization Rules

### 1. Container Structure
```tsx
<div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6">
  {/* Game content */}
</div>
```

### 2. Fixed Layout Areas (No Popping)
- Always reserve space for feedback/hints (use opacity, not display)
- Use fixed heights where possible
- Don't conditionally render elements that affect layout

### 3. State Reset Pattern
```tsx
useEffect(() => {
  // Reset all state
  setDisabled([]);
  setHasAnswered(false);
}, [problem.uid]);
```

### 4. Button Standardization
- Primary buttons: `rounded-xl sm:rounded-2xl border-2`
- Consistent hover: `hover:scale-105 active:scale-95`
- Disabled: `opacity-50 cursor-not-allowed`

### 5. Feedback Display
- Always render container, show/hide with opacity
- Consistent styling and positioning
- Don't cause layout shifts

### 6. Entry Animations
- Use: `animate-in fade-in duration-300` consistently
- Or remove if not needed

## Implementation Order

### Phase 1: Critical Fixes (Do First)
1. ✅ Fix BalanceScaleView derived state
2. Remove stars from RoboPathView
3. Fix layout shifts in MemoryGameView (cards disappearing)
4. Fix layout shifts in PatternTrainView (feedback box)
5. Fix layout shifts in TimeGameView (feedback text)

### Phase 2: Structure Standardization
6. Standardize container structure
7. Standardize spacing/padding
8. Standardize state reset patterns

### Phase 3: Visual Consistency
9. Standardize button styles
10. Standardize feedback display
11. Standardize animations
