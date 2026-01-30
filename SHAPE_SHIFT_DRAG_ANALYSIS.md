# Shape Shift Drag — Architectural Analysis

## Problem
User cannot drag pieces; no ghost appears and no console errors (MacBook, Edge).

## Data & Event Flow (Current)

### 1. Initialization
- `pieces` state: `useState<PieceState[]>([])` → **first render has `pieces = []`**.
- Reset effect `[problem.uid, problem.pieces]` runs after first paint → `setPieces(problem.pieces.map(...))` → second render has tray.
- **Risk**: If effect is delayed or deps are wrong, tray can be empty when user tries to click.

### 2. Start drag
- **Path A (React)**: User clicks piece → `onMouseDown` / `onPointerDown` / `onTouchStart` on div → handler calls `startDrag(pieceId, clientX, clientY)` → `setDragState({ pieceId, startX, startY, currentX, currentY })`.
- **Path B (Fallback)**: Document capture `mousedown` (useEffect, deps `[]`) → `e.target.closest('[data-shape-piece]')` → `getAttribute('data-piece-id')` → `startDragRef.current(pieceId, e.clientX, e.clientY)` → same `setDragState`.
- **Critical**: Drag only starts if `setDragState` is actually called. If no handler runs (e.g. event never reaches div, or document listener doesn’t match), `dragState.pieceId` stays `null` and ghost never renders.

### 3. Ghost render
- `draggingPiece = dragState.pieceId ? pieces.find(p => p.id === dragState.pieceId) : null`.
- Ghost JSX: `{draggingPiece && <div style={{ left: dragState.currentX, top: dragState.currentY }} ... />}`.
- **Requires**: (1) `dragState.pieceId !== null`, (2) `pieces` contains a piece with that id, (3) React has committed the state update that set `dragState.pieceId`.

### 4. Move / end
- Window effect `[dragState.pieceId]`: when `dragState.pieceId` is set, adds `pointermove`/`pointerup` and `mousemove`/`mouseup` (and touch) on `window`.
- **Timing**: Effect runs *after* the commit that set `dragState.pieceId`. So there is one frame where drag is “on” but window listeners are not yet attached. Move/up before that frame would be missed (rare but possible).
- Move/up handlers update `dragStateRef` and `setDragState` so ghost position and drop logic use latest coords.

## Failure Hypotheses

| Hypothesis | Why it would cause “no ghost” | How to verify / fix |
|-----------|-------------------------------|----------------------|
| **H1: Tray empty on first paint** | No `[data-shape-piece]` in DOM → document listener never finds target → `startDrag` never called. | Initialize `pieces` from `problem.pieces` in `useState` so tray exists on first paint. |
| **H2: React handlers never run** | e.g. Edge or parent eating mouse/pointer events; only document capture can start drag. | Ensure document capture path calls `setDragState` directly (or via ref) and is the single source of truth for “drag started”. |
| **H3: setState not triggering re-render** | e.g. same object reference, or state update swallowed. | Use a ref for drag data and call a dedicated `setState` (e.g. setDragState) with a new object so React always re-renders. |
| **H4: dragState.pieceId set but pieces.find fails** | e.g. `piece.id` vs `dragState.pieceId` mismatch (type or value). | Derive ghost from the same ref that drives “drag active”; avoid depending on `pieces` for ghost visibility. |
| **H5: Ghost rendered but invisible** | z-index, overflow, or positioning (e.g. fixed vs viewport). | Ghost already `fixed`, `z-[100]`; verify no parent `overflow: hidden` or transform that creates a new stacking context and clips it. |

## Recommended Architecture (Minimal critical path)

1. **Single source of truth for “dragging”**  
   One ref (e.g. `dragRef`) holds `{ pieceId: string | null, startX, startY, currentX, currentY }`. All native listeners (document mousedown, window mousemove/mouseup) read/write only this ref.

2. **Force re-render from native listeners**  
   When ref is updated (start, move, end), call a stable setState (e.g. `setDragState({ ...dragRef.current })`) so React always re-renders and the ghost (and board/tray) reflect the ref.

3. **Initialize pieces synchronously**  
   `useState(() => problem.pieces.map(p => ({ ...p })))` so the tray exists on first paint and `[data-shape-piece]` is present when the user first clicks.

4. **Document capture only for start**  
   One `mousedown` (and optionally `pointerdown`/`touchstart`) on `document` in capture phase. If `e.target.closest('[data-shape-piece]')` and `data-piece-id` exist, set `dragRef` and call the setState to force update. No reliance on React’s synthetic events for starting the drag.

5. **Window listeners for move/end**  
   When `dragRef.pieceId !== null`, attach move/up (and touch) to `window` (or document). On move: update `dragRef.currentX/Y`, then setState(ref). On up: run drop logic, clear `dragRef.pieceId`, setState(ref). Attach in an effect that depends on “is dragging” (e.g. a boolean or pieceId from state that is set only from the ref).

This keeps the entire “did the user start a drag?” and “where is the pointer?” path in native DOM + one ref + one setState, with no dependency on React’s event system or effect timing for the first frame of the drag.
