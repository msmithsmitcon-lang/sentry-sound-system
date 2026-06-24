import * as fs from "fs"
import * as path from "path"

/**
 * Wrapper harness for the repo's pre-existing "*.test.ts" files.
 *
 * Discovered during Jest setup: none of the existing *.test.ts files in
 * this repo use Jest's describe/test/it/expect API. Every one of them is
 * a self-executing script — `function assert(condition, message) { if
 * (!condition) throw ... }`, run at module load via a floating
 * `run().catch(error => { console.error(error); process.exit(1) })` (or
 * an equivalent `.then()`/`.catch(console.error)` pattern) — designed to
 * be invoked directly via `tsx`/`node`, not collected by Jest's test
 * runner.
 *
 * Pointing Jest's testMatch directly at these files does not work: Jest
 * requires every matched file to register at least one test via its own
 * API, and fails the whole file with "Your test suite must contain at
 * least one test" even when the script's own internal logic ran and
 * passed cleanly (confirmed empirically while wiring this up).
 *
 * This harness requires each legacy script inside a real Jest test()
 * block instead — without modifying any of the original 54 files — so
 * their existing logic still actually executes under `npm test`, and a
 * thrown assertion failure (or a process.exit(1) from their .catch
 * handler, intercepted below) surfaces as a normal Jest failure on that
 * file's test entry.
 */

const REPO_ROOT = path.resolve(__dirname, "..")
const IGNORED_DIRS = new Set(["node_modules", ".next", "temp", ".git"])
const SELF = path.resolve(__filename)

function discoverLegacyTestFiles(dir: string, found: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue

    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      discoverLegacyTestFiles(fullPath, found)
    } else if (entry.name.endsWith(".test.ts") && path.resolve(fullPath) !== SELF) {
      found.push(fullPath)
    }
  }

  return found
}

const legacyTestFiles = discoverLegacyTestFiles(REPO_ROOT)

describe("legacy self-executing test scripts (pre-existing, not Jest-native)", () => {
  test("at least one legacy script was discovered", () => {
    expect(legacyTestFiles.length).toBeGreaterThan(0)
  })

  for (const file of legacyTestFiles) {
    const relativePath = path.relative(REPO_ROOT, file)

    test(relativePath, async () => {
      const capturedErrors: unknown[] = []

      const exitSpy = jest.spyOn(process, "exit").mockImplementation(((code?: number) => {
        capturedErrors.push(new Error(`process.exit(${code ?? 0}) called by legacy script`))
        // Throwing here unwinds the script's own .catch handler instead
        // of actually terminating the Jest worker process.
        throw new Error(`process.exit(${code ?? 0})`)
      }) as never)

      const onUnhandledRejection = (reason: unknown) => {
        capturedErrors.push(reason)
      }
      process.on("unhandledRejection", onUnhandledRejection)

      try {
        jest.resetModules()
        require(file)

        // These scripts run their assertions in a floating (unawaited)
        // promise chain. Give pending microtasks/timers room to settle
        // before checking whether anything failed.
        for (let i = 0; i < 10; i++) {
          await new Promise((resolve) => setImmediate(resolve))
        }
      } catch (error) {
        capturedErrors.push(error)
      } finally {
        process.removeListener("unhandledRejection", onUnhandledRejection)
        exitSpy.mockRestore()
      }

      if (capturedErrors.length > 0) {
        throw capturedErrors[0]
      }
    })
  }
})
