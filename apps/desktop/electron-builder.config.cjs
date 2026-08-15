/**
 * electron-builder configuration.
 *
 * JS rather than YAML so the output directory can be redirected with
 * CMD_GENERATOR_RELEASE_DIR. That matters on machines where real-time antivirus holds
 * a lock on the freshly extracted Electron binaries inside the project tree —
 * electron-builder then fails with `EPERM: rename win-unpacked.tmp` — and it lets
 * CI put artifacts wherever it wants without editing tracked config.
 */
const fs = require("node:fs");
const path = require("node:path");

// The root `version` file is the single source of truth for the project version.
// electron-builder would otherwise read the version from this package's
// package.json; extraMetadata overrides it so the installer name, the packaged
// app's version (app.getVersion()), and the artifact name all agree with the
// `version` file.
const projectVersion = fs
  .readFileSync(path.join(__dirname, "../../version"), "utf8")
  .trim();

module.exports = {
  appId: "com.example.cmdgenerator",
  productName: "Command Builder",
  copyright: "Copyright © 2026",
  extraMetadata: { version: projectVersion },

  directories: {
    output: process.env.CMD_GENERATOR_RELEASE_DIR || "release",
    buildResources: "resources",
  },

  // The bundled main/preload, the copied static renderer, and (the one
  // exception) node-pty's real node_modules install — tsup inlines every
  // other dependency, but node-pty ships a native .node binary that can't be
  // bundled into a JS file, so it has to ship as an actual package.
  files: ["dist/**/*", "renderer/**/*", "package.json", "node_modules/node-pty/**/*"],

  // node-pty's native binary can't be dlopen'd from inside the asar archive —
  // unpacked so it's a real file on disk at runtime, same convention
  // electron-builder documents for every native-addon dependency.
  asarUnpack: ["**/node-pty/**/*"],

  asar: true,

  win: {
    target: [{ target: "nsis", arch: ["x64", "arm64"] }],
    // Deliberately not ${productName}: that contains spaces, which are awkward in
    // URLs, curl commands and CI. Fixing it here rather than renaming afterwards
    // keeps the .blockmap paired with its installer, which auto-update relies on.
    artifactName: "OpenCmdGenerator-setup-${version}-${arch}.${ext}",
  },

  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: false,
  },

  mac: {
    category: "public.app-category.utilities",
    target: [
      { target: "dmg", arch: ["arm64", "x64"] },
      { target: "zip", arch: ["arm64", "x64"] },
    ],
    // Required for a notarised build; harmless before signing is configured.
    hardenedRuntime: true,
    gatekeeperAssess: false,
  },

  linux: {
    category: "Utility",
    target: [
      { target: "AppImage", arch: ["x64"] },
      { target: "deb", arch: ["x64"] },
    ],
  },
};
