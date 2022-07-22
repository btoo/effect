import { Both, Cause, Die, Interrupt, Stackless, Then } from "@effect/core/io/Cause/definition"

/**
 * Transforms each error value in this cause to a new cause with the specified
 * function and then flattens the nested causes into a single cause.
 *
 * @tsplus static effect/core/io/Cause.Aspects flatMap
 * @tsplus pipeable effect/core/io/Cause flatMap
 */
export function flatMap<E, E1>(f: (e: E) => Cause<E1>) {
  return (self: Cause<E>): Cause<E1> =>
    self.fold(
      Cause.empty,
      (e, trace) => f(e).traced(trace),
      (d, trace) => new Die(d, trace),
      (fiberId, trace) => new Interrupt(fiberId, trace),
      (left, right) => new Then(left, right),
      (left, right) => new Both(left, right),
      (cause, stackless) => new Stackless(cause, stackless)
    )
}