/**
 * Zips this effect and that effect in parallel.
 *
 * @tsplus static effect/core/io/Effect.Aspects zipPar
 * @tsplus pipeable effect/core/io/Effect zipPar
 */
export function zipPar<R2, E2, A2>(
  that: LazyArg<Effect<R2, E2, A2>>,
  __tsplusTrace?: string
) {
  return <R, E, A>(self: Effect<R, E, A>): Effect<R | R2, E | E2, Tuple<[A, A2]>> =>
    self.zipWithPar(that, (a, b) => Tuple(a, b))
}