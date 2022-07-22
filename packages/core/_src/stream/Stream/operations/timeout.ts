/**
 * Ends the stream if it does not produce a value after the specified duration.
 *
 * @tsplus static effect/core/stream/Stream.Aspects timeout
 * @tsplus pipeable effect/core/stream/Stream timeout
 */
export function timeout(duration: LazyArg<Duration>, __tsplusTrace?: string) {
  return <R, E, A>(self: Stream<R, E, A>): Stream<R, E, A> =>
    Stream.succeed(duration).flatMap((duration) =>
      Stream.fromPull(
        self.toPull.map((pull) => pull.timeoutFail(Maybe.none, duration))
      )
    )
}