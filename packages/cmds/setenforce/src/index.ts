// spec — types only from this barrel, same reasoning as @cmdgen/iptables's index.ts.
export type * from "./spec";
export * from "./pure";

// catalogue (empty — see catalogue/groups.ts and catalogue/flags.ts)
export * from "./catalogue/groups";
export * from "./catalogue/flags";

// build
export * from "./argv";

// render (generic — owned by @cmdgen/engine, re-exported here by name for
// convenience. Nothing here needs `attached`/`quoteAttached` treatment — the
// generic engine renderer works directly, same reasoning as @cmdgen/iptables's
// index.ts, so no custom render.ts is needed.)
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
// identical note in @cmdgen/iptables's index.ts. Reach it via "@cmdgen/setenforce/definition".
