/**
 * Returns an effect with the optional value.
 *
 * @tsplus static effect/core/io/Effect.Ops some
 */
export function succeedSome<A>(value: LazyArg<A>, __tsplusTrace?: string): Effect<never, never, Maybe<A>> {
  return Effect.succeed(Maybe.some(value()))
}