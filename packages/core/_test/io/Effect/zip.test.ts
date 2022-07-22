describe.concurrent("Effect", () => {
  describe.concurrent("zipFlatten", () => {
    it("is compositional", async () => {
      const program = Effect.succeed(1) + Effect.unit + Effect.succeed("test") + Effect.succeed(true)

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == Tuple(1, undefined, "test", true))
    })
  })

  describe.concurrent("zipPar", () => {
    it("does not swallow exit() causes of loser", async () => {
      const program = Effect.interrupt.zipPar(Effect.interrupt)

      const result = await program.unsafeRunPromiseExit()

      assert.isTrue(
        result.causeMaybe.map((cause) => cause.interruptors.size > 0)
          == Maybe.some(true)
      )
    })

    it("does not report failure when interrupting loser after it succeeded", async () => {
      const program = Effect.interrupt
        .zipPar(Effect.succeed(1))
        .sandbox
        .either
        .map((either) => either.mapLeft((cause) => cause.isInterrupted))

      const result = await program.unsafeRunPromise()

      assert.isTrue(result == Either.left(true))
    })

    it("passes regression 1", async () => {
      const program = Effect.succeed(1)
        .zipPar(Effect.succeed(2))
        .flatMap((tuple) => Effect.succeed(tuple.get(0) + tuple.get(1)))
        .map((n) => n === 3)

      const result = await program.unsafeRunPromise()

      assert.isTrue(result)
    })

    it("paralellizes simple success values", async () => {
      function countdown(n: number): Effect.UIO<number> {
        return n === 0
          ? Effect.succeed(0)
          : Effect.succeed(1)
            .zipPar(Effect.succeed(2))
            .flatMap((tuple) => countdown(n - 1).map((y) => tuple.get(0) + tuple.get(1) + y))
      }

      const result = await countdown(50).unsafeRunPromise()

      assert.strictEqual(result, 150)
    })

    it("does not kill fiber when forked on parent scope", () =>
      Do(($) => {
        const latch1 = $(Deferred.make<never, void>())
        const latch2 = $(Deferred.make<never, void>())
        const latch3 = $(Deferred.make<never, void>())
        const ref = $(Ref.make(false))
        const left = Effect.uninterruptibleMask(({ restore }) =>
          latch2.succeed(undefined)
            .zipRight(restore(latch1.await() > Effect.succeed("foo")))
            .onInterrupt(() => ref.set(true))
        )
        const right = latch3.succeed(undefined).as(42)
        $((latch2.await() > latch3.await() > latch1.succeed(undefined)).fork)
        const result = $(left.fork.zipPar(right))
        const leftInnerFiber = result.get(0)
        const rightResult = result.get(1)
        const leftResult = $(leftInnerFiber.await)
        const interrupted = $(ref.get())
        assert.isFalse(interrupted)
        assert.isTrue(leftResult.untraced == Exit.succeed("foo"))
        assert.strictEqual(rightResult, 42)
      }).unsafeRunPromise())
  })
})