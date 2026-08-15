// spec — types only from this barrel. `RsyncSpec`/`Endpoint` are zod schemas
// (real runtime values), but every value this package's own behavior needs
// (SPEC_VERSION, the empty-endpoint factories, the flag accessors) lives in
// the zod-free ./pure instead — the same split @cmdgen/contracts uses, and
// for the same reason: the web UI imports PRESETS/createSpec/etc. from this
// barrel and must not have zod tag along. Something that genuinely needs the
// RsyncSpec schema as a value (this package's own ./definition, or future
// validation code) imports ./spec directly instead of through here.
export type * from "./spec";
export type * from "./endpoint";
export * from "./pure";

// catalogue
export * from "./catalogue/groups";
export * from "./catalogue/flags";
export * from "./catalogue/implications";

// build
export * from "./argv/paths";
export * from "./argv/rsh";
export * from "./argv/endpoint";
export * from "./argv";

// render (generic — owned by @cmdgen/engine, re-exported here by name for
// convenience so consumers don't need a second package import for one command)
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
export * from "./explain/trailing-slash";
export * from "./explain/describe";

// presets and factory
export * from "./presets";

// manifest — cheap, zero-cost data, safe in the default barrel.
export * from "./manifest";

// The full CommandDefinition (./definition) is NOT re-exported here: it pulls
// in ./spec as a real value for `specSchema`, which would drag zod back into
// this barrel. Reach it via "@cmdgen/rsync/definition" (the registry's
// dynamic import already does this) instead of a static import from ".".
