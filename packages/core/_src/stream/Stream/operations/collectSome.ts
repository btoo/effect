/**
 * Filters any 'None' values.
 *
 * @tsplus getter effect/core/stream/Stream collectSome
 */
export function collectSome<R, E, A>(
  self: Stream<R, E, Maybe<A>>,
  __tsplusTrace?: string
): Stream<R, E, A> {
  return self.collect((option) => option.isSome() ? Maybe.some(option.value) : Maybe.none)
}