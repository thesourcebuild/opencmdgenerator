// spec — types only from this barrel, same reasoning as @cmdgen/chmod's index.ts.
export type * from "./spec";
export * from "./pure";

// catalogue
export * from "./catalogue/groups";
export * from "./catalogue/flags";

// build
export * from "./argv";

// render (generic — owned by @cmdgen/engine, re-exported here by name for convenience)
export {
  quotePosix,
  quotePowerShell,
  quoteCmd,
  quoteFor,
  quoteAttached,
  needsQuoting,
  renderTokens,
  renderOneLine,
  renderMultiLine,
  continuationFor,
  type RenderOptions,
  type RenderedToken,
} from "@cmdgen/engine";

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
// identical note in @cmdgen/chmod's index.ts. Reach it via "@cmdgen/comm/definition".
