// spec — types only from this barrel, same reasoning as @cmdgen/touch's index.ts.
export type * from "./spec";
export * from "./pure";

// catalogue (empty — see catalogue/groups.ts and catalogue/flags.ts)
export * from "./catalogue/groups";
export * from "./catalogue/flags";

// build
export * from "./argv";

// render (dd's own POSIX-only quoting, not @cmdgen/engine's generic
// posix/cmd/powershell renderer — see render.ts's own doc comment for why;
// same reasoning as @cmdgen/export's index.ts)
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
// identical note in @cmdgen/mount's index.ts. Reach it via "@cmdgen/dd/definition".
