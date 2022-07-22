/**
 * The stream that dies with an exception described by `msg`.
 *
 * @tsplus static effect/core/stream/Stream.Ops dieMessage
 */
export function dieMessage(
  message: LazyArg<string>,
  __tsplusTrace?: string
): Stream<never, never, never> {
  return Stream.fromEffect(Effect.dieMessage(message))
}