import { defineConfig } from "tsup";

/**
 * Main and preload are bundled rather than compiled file-by-file. That lets them
 * import the workspace packages as TypeScript source with no per-package build
 * step, and sidesteps ESM/CJS interop entirely.
 *
 * Both outputs are CJS: a sandboxed preload script MUST be CommonJS, and there
 * is nothing to gain from ESM in the main process here.
 */
export default defineConfig([
  {
    entry: { "main/index": "src/main/index.ts" },
    outDir: "dist",
    format: ["cjs"],
    platform: "node",
    target: "node20",
    // Electron and node-pty are the only genuine runtime dependencies.
    // Everything else must be bundled: tsup externalizes package.json
    // `dependencies` by default, which would leave the output require()-ing
    // the workspace packages' raw TS source. node-pty ships a native `.node`
    // binary esbuild/tsup cannot inline into a JS bundle — it has to stay a
    // real `node_modules` package at runtime (see electron-builder.config.cjs's
    // `files`/`asarUnpack`).
    external: ["electron", "node-pty"],
    noExternal: [/^@rsync\//, "zod"],
    outExtension: () => ({ js: ".cjs" }),
    sourcemap: true,
    // Cleaning is done by the npm script: these two configs run concurrently, so
    // letting either one clean `dist` can delete the other's freshly written output.
    clean: false,
    bundle: true,
  },
  {
    entry: { "preload/index": "src/preload/index.ts" },
    outDir: "dist",
    format: ["cjs"],
    platform: "node",
    target: "node20",
    // Electron and node-pty are the only genuine runtime dependencies.
    // Everything else must be bundled: tsup externalizes package.json
    // `dependencies` by default, which would leave the output require()-ing
    // the workspace packages' raw TS source. node-pty ships a native `.node`
    // binary esbuild/tsup cannot inline into a JS bundle — it has to stay a
    // real `node_modules` package at runtime (see electron-builder.config.cjs's
    // `files`/`asarUnpack`).
    external: ["electron", "node-pty"],
    noExternal: [/^@rsync\//, "zod"],
    outExtension: () => ({ js: ".cjs" }),
    sourcemap: true,
    clean: false,
    bundle: true,
  },
]);
