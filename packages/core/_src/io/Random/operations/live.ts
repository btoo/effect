import { RandomSym } from "@effect/core/io/Random/definition"

export class LiveRandom implements Random {
  readonly [RandomSym]: RandomSym = RandomSym

  readonly PRNG: RandomPCG

  constructor(readonly seed: number) {
    this.PRNG = new RandomPCG(seed)
  }

  get next(): Effect<never, never, number> {
    return Effect.succeed(this.PRNG.number())
  }

  get nextBoolean(): Effect<never, never, boolean> {
    return this.next.flatMap((n) => Effect.succeed(n > 0.5))
  }

  get nextInt(): Effect<never, never, number> {
    return Effect.succeed(this.PRNG.integer(0))
  }

  nextRange(low: number, high: number, __tsplusTrace?: string): Effect<never, never, number> {
    return this.next.flatMap((n) => Effect.succeed((high - low) * n + low))
  }

  nextIntBetween(
    low: number,
    high: number,
    __tsplusTrace?: string
  ): Effect<never, never, number> {
    return Effect.succeed(() => this.PRNG.integer(high - low) + low)
  }

  shuffle<A>(
    collection: LazyArg<Collection<A>>,
    __tsplusTrace?: string
  ): Effect<never, never, Collection<A>> {
    return shuffleWith(collection, (n) => this.nextIntBetween(0, n))
  }
}

function shuffleWith<A>(
  collection: LazyArg<Collection<A>>,
  nextIntBounded: (n: number) => Effect<never, never, number>,
  __tsplusTrace?: string
): Effect<never, never, Collection<A>> {
  return Effect.suspendSucceed(() => {
    const collection0 = collection()

    return Effect.Do()
      .bind("buffer", () =>
        Effect.succeed(() => {
          const buffer: Array<A> = []
          for (const element of collection0) {
            buffer.push(element)
          }
          return buffer
        }))
      .bindValue(
        "swap",
        ({ buffer }) =>
          (i1: number, i2: number) =>
            Effect.succeed(() => {
              const tmp = buffer[i1]!
              buffer[i1] = buffer[i2]!
              buffer[i2] = tmp
              return buffer
            })
      )
      .tap(({ buffer, swap }) => {
        const ns: Array<number> = []
        for (let i = buffer.length; i >= 2; i = i - 1) {
          ns.push(i)
        }
        return Effect.forEachDiscard(ns, (n) => nextIntBounded(n).flatMap((k) => swap(n - 1, k)))
      })
      .map(({ buffer }) => buffer)
  })
}

/**
 * @tsplus static effect/core/io/Random.Ops default
 */
export const defaultRandom = new LiveRandom((Math.random() * 4294967296) >>> 0)

/**
 * @tsplus static effect/core/io/Random.Ops live
 */
export const live = Layer.fromValue(Random.Tag, defaultRandom)