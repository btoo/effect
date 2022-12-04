/**
 * @since 1.0.0
 */
import type { Chunk } from "@fp-ts/data/Chunk"
import * as C from "@fp-ts/data/Chunk"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as A from "@fp-ts/schema/Arbitrary"
import * as UnknownArray from "@fp-ts/schema/data/UnknownArray"
import * as D from "@fp-ts/schema/Decoder"
import type * as G from "@fp-ts/schema/Guard"
import * as I from "@fp-ts/schema/internal/common"
import type { JsonEncoder } from "@fp-ts/schema/JsonEncoder"
import * as P from "@fp-ts/schema/Provider"
import * as S from "@fp-ts/schema/Schema"
import type { UnknownDecoder } from "@fp-ts/schema/UnknownDecoder"

/**
 * @since 1.0.0
 */
export const id = Symbol.for("@fp-ts/schema/data/Chunk")

/**
 * @since 1.0.0
 */
export const guard = <A>(item: G.Guard<A>): G.Guard<Chunk<A>> =>
  I.makeGuard(
    schema(item),
    (u): u is Chunk<A> => C.isChunk(u) && pipe(u, C.every(item.is))
  )

const array = <I, A>(item: D.Decoder<I, A>): D.Decoder<ReadonlyArray<I>, Chunk<A>> =>
  pipe(D.array(item), D.compose(D.make(schema(item), (as) => D.success(C.unsafeFromArray(as)))))

/**
 * @since 1.0.0
 */
export const unknownDecoder = <A>(
  item: UnknownDecoder<A>
): UnknownDecoder<Chunk<A>> => pipe(UnknownArray.UnknownDecoder, D.compose(array(item)))

/**
 * @since 1.0.0
 */
export const jsonEncoder = <A>(self: JsonEncoder<A>): JsonEncoder<Chunk<A>> =>
  I.makeEncoder(schema(self), (chunk) => C.toReadonlyArray(chunk).map(self.encode))

/**
 * @since 1.0.0
 */
export const arbitrary = <A>(item: A.Arbitrary<A>): A.Arbitrary<Chunk<A>> =>
  A.make(schema(item), (fc) => fc.array(item.arbitrary(fc)).map(C.unsafeFromArray))

/**
 * @since 1.0.0
 */
export const Provider = P.make(id, {
  [I.GuardId]: guard,
  [I.ArbitraryId]: arbitrary,
  [I.UnknownDecoderId]: unknownDecoder,
  [I.JsonDecoderId]: unknownDecoder,
  [I.UnknownEncoderId]: jsonEncoder,
  [I.JsonEncoderId]: jsonEncoder
})

/**
 * @since 1.0.0
 */
export const schema = <A>(item: S.Schema<A>): S.Schema<Chunk<A>> =>
  S.declare(id, O.none, Provider, item)