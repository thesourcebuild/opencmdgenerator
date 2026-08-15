// spec — types only from this barrel. `FfmpegSpec` is a zod schema (a real
// runtime value), but every value this package's own behavior needs lives in
// the zod-free ./pure instead — same split @cmdgen/contracts and every other
// command package here uses. Something that genuinely needs the schema as a
// value (this package's own ./definition) imports ./spec directly instead.
export type * from "./spec";
export * from "./pure";

export * from "./catalogue/groups";
export * from "./catalogue/flags";

export * from "./argv";

// render — ffmpeg, like curl/rsync/ssh/tar, is a real executable invoked
// identically from bash, cmd and PowerShell alike, so there is no bespoke
// render.ts here: the generic renderer is re-exported by name.
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

export * from "./lint/rules";
export * from "./lint/run";

export * from "./explain/describe";

export * from "./presets";

export * from "./manifest";

// Full CommandDefinition lives at "@cmdgen/ffmpeg/definition" — see @cmdgen/curl's index.ts for why.
