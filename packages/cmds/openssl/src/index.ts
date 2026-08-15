// spec — types only from this barrel, same reasoning as @cmdgen/git's index.ts.
export type * from "./spec";
export * from "./pure";

// catalogue
export * from "./catalogue/groups";
export * from "./catalogue/verify";
export * from "./catalogue/enc";
export * from "./catalogue/digest";
export * from "./catalogue/keygen";
export * from "./catalogue/cert";
export * from "./catalogue/pkcs";
export * from "./catalogue/tls";
export * from "./catalogue/pki";
export * from "./catalogue/smime";
export * from "./catalogue/diag";
export * from "./catalogue/index";

// build
export * from "./argv";
export * from "./argv/verify";
export * from "./argv/enc";
export * from "./argv/digest";
export * from "./argv/keygen";
export * from "./argv/cert";
export * from "./argv/pkcs";
export * from "./argv/tls";
export * from "./argv/pki";
export * from "./argv/smime";
export * from "./argv/diag";

// render — mostly the generic renderer (owned by @cmdgen/engine, re-exported
// here by name), EXCEPT renderTokens/renderOneLine/renderMultiLine, which are
// openssl's own (see render.ts's comment — needed for dgst's "text" input
// mode's `echo <text> |` pipe prefix, same technique @cmdgen/at uses).
export { quotePosix, quotePowerShell, quoteCmd, quoteFor, quoteAttached, needsQuoting, continuationFor, type RenderOptions } from "@cmdgen/engine";
export * from "./render";

// lint
export * from "./lint/rules";
export * from "./lint/run";
export * from "./lint/verify";
export * from "./lint/enc";
export * from "./lint/digest";
export * from "./lint/keygen";
export * from "./lint/cert";
export * from "./lint/pkcs";
export * from "./lint/tls";
export * from "./lint/pki";
export * from "./lint/smime";
export * from "./lint/diag";

// explain
export * from "./explain/describe";

// presets and factory
export * from "./presets";
export * from "./presets-keygen";
export * from "./presets-cert";
export * from "./presets-pkcs";
export * from "./presets-tls";
export * from "./presets-pki";
export * from "./presets-smime";
export * from "./presets-diag";

// manifest — cheap, zero-cost data, safe in the default barrel.
export * from "./manifest";

// The full CommandDefinition (./definition) is NOT re-exported here — see the
// identical note in @cmdgen/git's index.ts. Reach it via "@cmdgen/openssl/definition".
