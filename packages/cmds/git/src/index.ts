// spec — types only from this barrel, same reasoning as @cmdgen/apt's index.ts.
export type * from "./spec";
export * from "./pure";

// catalogue
export * from "./catalogue/groups";
export * from "./catalogue/staging";
export * from "./catalogue/undo";
export * from "./catalogue/setup";
export * from "./catalogue/branching";
export * from "./catalogue/remote";
export * from "./catalogue/history";
export * from "./catalogue/diffgrep";
export * from "./catalogue/mergerebase";
export * from "./catalogue/tags";
export * from "./catalogue/stashing";
export * from "./catalogue/index";

// build
export * from "./argv";
export * from "./argv/staging";
export * from "./argv/undo";
export * from "./argv/setup";
export * from "./argv/branching";
export * from "./argv/remote";
export * from "./argv/history";
export * from "./argv/diffgrep";
export * from "./argv/mergerebase";
export * from "./argv/tags";
export * from "./argv/stashing";

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
export * from "./lint/setup";
export * from "./lint/branching";
export * from "./lint/remote";
export * from "./lint/history";
export * from "./lint/diffgrep";
export * from "./lint/mergerebase";
export * from "./lint/tags";
export * from "./lint/stashing";

// explain
export * from "./explain/describe";

// presets and factory
export * from "./presets";
export * from "./presets-setup";
export * from "./presets-branching";
export * from "./presets-remote";
export * from "./presets-history";
export * from "./presets-diffgrep";
export * from "./presets-mergerebase";
export * from "./presets-tags";
export * from "./presets-stashing";

// manifest — cheap, zero-cost data, safe in the default barrel.
export * from "./manifest";

// The full CommandDefinition (./definition) is NOT re-exported here — see the
// identical note in @cmdgen/apt's index.ts. Reach it via "@cmdgen/git/definition".
