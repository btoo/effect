/**
 * Grabs a complete, linearized trace for the cause.
 *
 * Note: This linearization may be misleading in the presence of parallel
 * errors.
 *
 * @tsplus getter effect/core/io/Cause trace
 */
export function trace<E>(self: Cause<E>): Trace {
  return self.traces.reduce(Trace.none, (a, b) => a + b)
}