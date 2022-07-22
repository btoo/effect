/**
 * Partition a stream using a predicate. The first stream will contain all
 * element evaluated to true and the second one will contain all element
 * evaluated to false. The faster stream may advance by up to buffer elements
 * further than the slower one.
 *
 * @tsplus static effect/core/stream/Stream.Aspects partition
 * @tsplus pipeable effect/core/stream/Stream partition
 */
export function partition<A>(
  p: Predicate<A>,
  buffer = 16,
  __tsplusTrace?: string
) {
  return <R, E>(self: Stream<R, E, A>): Effect<R | Scope, E, Tuple<[Stream<never, E, A>, Stream<never, E, A>]>> =>
    self.partitionEither(
      (a) => p(a) ? Effect.succeedNow(Either.left(a)) : Effect.succeedNow(Either.right(a)),
      buffer
    )
}