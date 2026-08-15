// spec — types only from this barrel, same reasoning as @cmdgen/crontab's index.ts.
export type * from "./spec";
export * from "./pure";

// catalogue (empty — see catalogue/groups.ts and catalogue/flags.ts)
export * from "./catalogue/groups";
export * from "./catalogue/flags";

// build
export * from "./argv";

// render — at's own, NOT the generic direct re-export every other command in
// this batch uses, because at's schedule action needs the extra `echo ... |`
// prefix render.ts hand-assembles. See render.ts's own comment for why.
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
// identical note in @cmdgen/crontab's index.ts. Reach it via "@cmdgen/at/definition".
