import { constTrue } from "@tsplus/stdlib/data/Function"

/**
 * A sink that folds its input chunks with the provided function and initial
 * state. `f` must preserve chunking-invariance.
 *
 * @tsplus static effect/core/stream/Sink.Ops foldLeftChunks
 */
export function foldLeftChunks<In, S>(
  z: LazyArg<S>,
  f: (s: S, input: Chunk<In>) => S,
  __tsplusTrace?: string
): Sink<never, never, In, never, S> {
  return Sink.foldChunks(z, constTrue, f).dropLeftover
}