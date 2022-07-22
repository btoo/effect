/**
 * @tsplus static effect/core/io/Logger.Ops succeed
 */
export function succeed<A>(a: LazyArg<A>): Logger<unknown, A> {
  return Logger.simple(a)
}