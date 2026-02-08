# Shape Dash – Collision / Jump Analysis

## Coordinate system (view)

- **Canvas:** 560×360. Ground line `GROUND_Y = 280` (y increases downward).
- **Player:** drawn at `(PLAYER_X, py)` = (120, py), size 44×44. So `playerTop = py`, `playerBottom = py + 44`. Standing: `py = 236`, bottom = 280.
- **Obstacles:** left at `obs.x - scroll`, width 24, height h (24 spike / 40 block). `obsTop = GROUND_Y - h`, `obsBottom = GROUND_Y` (280).

## Physics (one frame, dt ≈ 0.016s)

- Jump: `pvy = JUMP_VELOCITY` (-550), then `pvy += GRAVITY * dt` (1500×0.016 ≈ 24), `py += pvy * dt`.
- First frame after jump: `py` changes by about -550×0.016 ≈ **-8.8 px** (rise ~9 px).

## Collision condition (AABB with 4px inset)

We collide when:

- `playerBottom > obsTop + 4` and `playerTop + 4 < obsBottom`
- For a spike (h=24): `obsTop = 256`, so we **clear** when `playerBottom <= 260` ⇒ `py <= 216` ⇒ we must rise at least **20 px** to clear.

## Root cause: same-frame death

1. Player is on ground (`py = 236`) with obstacle overlapping (or about to).
2. Player presses jump. In the **same frame** we set `pvy = -550`, integrate once, get `py ≈ 227.6` (rise ~8 px).
3. Collision runs with this new `py`. We need `py <= 216` to clear a spike, but we're at 227.6 ⇒ **still overlapping** ⇒ crash on the first frame of the jump.

So the jump is “too short” in the sense that **one frame of rise (~9 px) is never enough to leave the obstacle box (need 20 px)**. We die before the jump can develop.

## Fix: no collision while moving up

Only treat overlap as a crash when the player is **not** moving upward:

- If `pvy < 0`: do **not** register collision (grace while ascending).
- If `pvy >= 0`: use current AABB collision as before.

Effect: the player can’t die on the way up; they only die when falling or on ground. They get multiple frames to rise and clear the obstacle, then land past it. No change to jump height or spacing needed for this; it fixes the same-frame death.

## Constants (for reference)

- GRAVITY = 1500, JUMP_VELOCITY = -550 ⇒ peak height ≈ 100 px, air time ≈ 0.73 s.
- Clear spike: need `py <= 216` (rise ≥ 20 px). We reach 136 at peak, so jump height is sufficient once same-frame death is removed.
