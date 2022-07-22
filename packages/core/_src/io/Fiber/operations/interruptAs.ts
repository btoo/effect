import { realFiber } from "@effect/core/io/Fiber/definition"

/**
 * A fiber that is already interrupted.
 *
 * @tsplus static effect/core/io/Fiber.Ops interruptAs
 */
export function interruptAs(fiberId: FiberId): Fiber<never, never> {
  return Fiber.done(Exit.interrupt(fiberId))
}

/**
 * Interrupts the fiber as if interrupted from the specified fiber. If the
 * fiber has already exited, the returned effect will resume immediately.
 * Otherwise, the effect will resume when the fiber exits.
 *
 * @tsplus static effect/core/io/Fiber.Aspects interruptAs
 * @tsplus static effect/core/io/RuntimeFiber.Aspects interruptAs
 * @tsplus pipeable effect/core/io/Fiber interruptAs
 * @tsplus pipeable effect/core/io/RuntimeFiber interruptAs
 */
export function interruptAsNow(fiberId: FiberId, __tsplusTrace?: string) {
  return <E, A>(self: Fiber<E, A>): Effect<never, never, Exit<E, A>> => {
    realFiber(self)
    return self._interruptAs(fiberId)
  }
}