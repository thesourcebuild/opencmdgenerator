// spec — types only from this barrel, same reasoning as @cmdgen/rsync's index.ts:
// CdSpec is a zod schema (a real runtime value), but nothing this package's own
// behavior needs requires it as a value except ./definition's specSchema, which
// is reached via the dedicated "@cmdgen/cd/definition" subpath instead.
export type * from "./spec";
export * from "./pure";

// catalogue
export * from "./catalogue/groups";
export * from "./catalogue/flags";

// build
export * from "./argv";

// render (cd's own platform-aware quoting, not @cmdgen/engine's posix/powershell-only renderer)
export * from "./render";

// lint
export * from "./lint/rules";
export * from "./lint/run";

// explain
export * from "./explain/describe";

// presets and factory
export * from "./presets";

// manifest — cheap, zero-cost data, safe in the default barrel.
export * from "./manifest";

// The full CommandDefinition (./definition) is NOT re-exported here — see the
// identical note in @cmdgen/rsync's index.ts. Reach it via "@cmdgen/cd/definition".
