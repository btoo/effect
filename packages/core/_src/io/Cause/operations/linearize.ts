import { Die, Fail, Interrupt, Stackless } from "@effect/core/io/Cause/definition"

/**
 * Linearizes this cause to a set of parallel causes where each parallel cause
 * contains a linear sequence of failures.
 *
 * @tsplus getter effect/core/io/Cause linearize
 */
export function linearize<E>(self: Cause<E>): HashSet<Cause<E>> {
  return self.fold(
    () => HashSet.empty<Cause<E>>(),
    (e, trace) => HashSet.empty<Cause<E>>().add(new Fail(e, trace)),
    (d, trace) => HashSet.empty<Cause<E>>().add(new Die(d, trace)),
    (fiberId, trace) => HashSet.empty<Cause<E>>().add(new Interrupt(fiberId, trace)),
    (left, right) => left.flatMap((l) => right.map((r) => l + r)),
    (left, right) => left.union(right),
    (cause, stackless) => cause.map((c) => new Stackless(c, stackless))
  )
}