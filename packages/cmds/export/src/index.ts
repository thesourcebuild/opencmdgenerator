export type * from "./spec";
export * from "./pure";

export * from "./catalogue/groups";
export * from "./catalogue/flags";

export * from "./argv";

// render (export's own platform-aware quoting, not @cmdgen/engine's posix/powershell-only renderer)
export * from "./render";

export * from "./lint/rules";
export * from "./lint/run";

export * from "./explain/describe";

export * from "./presets";

export * from "./manifest";

// Full CommandDefinition lives at "@cmdgen/export/definition" — see @cmdgen/cd's index.ts for why.
