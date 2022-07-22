/**
 * Returns an effect that dies with the specified `unknown`. This method can
 * be used for terminating a fiber because a defect has been detected in the
 * code.
 *
 * @tsplus static effect/core/io/Effect.Ops dieNow
 */
export function dieNow(defect: unknown, __tsplusTrace?: string): Effect<never, never, never> {
  return Effect.failCause(Cause.die(defect, Trace.none))
}