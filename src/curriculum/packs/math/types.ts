/**
 * Re-export shared math DSL types.
 *
 * `ArithmeticSpec` + `EquationOp` are defined in `src/types/game.ts` so the
 * `math_snake` engine can hold them on `MathSnakeProblem.specs` without the
 * types module depending on curriculum. This file keeps the import-path
 * colocated with the math packs for readability.
 */

export type { ArithmeticSpec, EquationOp } from '../../../types/game';
