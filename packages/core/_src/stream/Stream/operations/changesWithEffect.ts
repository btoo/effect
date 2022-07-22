import { concreteStream, StreamInternal } from "@effect/core/stream/Stream/operations/_internal/StreamInternal"

/**
 * Returns a new stream that only emits elements that are not equal to the
 * previous element emitted, using the specified effectual function to
 * determine whether two elements are equal.
 *
 * @tsplus static effect/core/stream/Stream.Aspects changesWithEffect
 * @tsplus pipeable effect/core/stream/Stream changesWithEffect
 */
export function changesWithEffect<A, R2, E2>(
  f: (x: A, y: A) => Effect<R2, E2, boolean>,
  __tsplusTrace?: string
) {
  return <R, E>(self: Stream<R, E, A>): Stream<R | R2, E | E2, A> => {
    concreteStream(self)
    return new StreamInternal(self.channel >> writer<R, E, A, R2, E2>(Maybe.none, f))
  }
}

function writer<R, E, A, R2, E2>(
  last: Maybe<A>,
  f: (x: A, y: A) => Effect<R2, E2, boolean>
): Channel<R | R2, E | E2, Chunk<A>, unknown, E | E2, Chunk<A>, void> {
  return Channel.readWithCause(
    (chunk: Chunk<A>) =>
      Channel.fromEffect(
        chunk.reduceEffect(
          Tuple(last, Chunk.empty<A>()),
          ({ tuple: [option, as] }, a) =>
            option.fold(
              Effect.succeedNow(Tuple(Maybe.some(a), as.append(a))),
              (value) => f(value, a).map((b) => b ? Tuple(Maybe.some(a), as) : Tuple(Maybe.some(a), as.append(a)))
            )
        )
      ).flatMap(
        ({ tuple: [newLast, newChunk] }) => Channel.write(newChunk) > writer<R, E, A, R2, E2>(newLast, f)
      ),
    (cause) => Channel.failCause(cause),
    () => Channel.unit
  )
}