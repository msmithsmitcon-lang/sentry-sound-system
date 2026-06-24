/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  /**
   * The project tsconfig.json uses module: "esnext" (required for
   * Next.js's bundler-based build). Compiling test files with that
   * setting leaves native `import.meta` references untouched, which
   * crashes under Jest's CommonJS runtime — surfaced by Prisma's
   * generated client (src/generated/prisma/client.ts), which reads
   * `import.meta.url`. tsconfig.jest.json overrides module to
   * "commonjs" for the test run only; tsconfig.json itself is untouched
   * so `next build` / `tsc --noEmit` behavior is unaffected.
   */
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  /**
   * Only __tests__/ is collected directly by Jest's own test-discovery.
   *
   * The repo's pre-existing *.test.ts files (scattered across src/lib/**
   * and tests/) are NOT written against Jest's describe/test/it API —
   * each is a self-executing script (assert() + a floating
   * run().catch(process.exit) promise). Pointing testMatch at them
   * directly fails every one with Jest's "must contain at least one
   * test" error regardless of whether their own internal logic passes
   * (confirmed empirically while wiring this up) — that's a Jest
   * test-collection mismatch, not a real failure signal.
   *
   * __tests__/legacy-script-harness.test.ts is a real Jest test (proper
   * describe/test blocks) that requires each legacy script directly and
   * surfaces its actual pass/fail — without modifying any of the
   * original files. New, properly Jest-native tests should go in
   * __tests__/ going forward to be picked up automatically; the *.test.ts
   * naming convention itself is unchanged.
   */
  testMatch: ["<rootDir>/__tests__/**/*.test.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/temp/"],
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
