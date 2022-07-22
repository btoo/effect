/**
 * Maps the success value of this effect to the specified constant value.
 *
 * @tsplus static effect/core/io/Effect.Aspects as
 * @tsplus pipeable effect/core/io/Effect as
 */
export function as<B>(value: LazyArg<B>, __tsplusTrace?: string) {
  return <R, E, A>(self: Effect<R, E, A>): Effect<R, E, B> => self.map(value)
}