/**
 * Creates a stream from an Collection collection of values.
 *
 * @tsplus static effect/core/stream/Stream.Ops fromCollection
 */
export function fromCollection<A>(
  as: LazyArg<Collection<A>>,
  __tsplusTrace?: string
): Stream<never, never, A> {
  return Stream.fromChunk(Chunk.from(as()))
}