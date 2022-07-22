import { IFail } from "@effect/core/io/Effect/definition/primitives"

/**
 * Returns an effect that models failure with the specified `Cause`.
 *
 * @tsplus static effect/core/io/Effect.Ops failCause
 */
export function failCause<E>(
  cause: LazyArg<Cause<E>>,
  __tsplusTrace?: string
): Effect<never, E, never> {
  return new IFail(cause, __tsplusTrace)
}