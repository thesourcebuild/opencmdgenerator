import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// The root `version` file is the single source of truth for the project version.
// Read it directly rather than trusting npm_package_version, which varies with
// how the build is launched and which package.json the runner is in.
const projectVersion = fs.readFileSync(path.join(__dirname, "../../version"), "utf8").trim();
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";

/**
 * One static bundle serves both targets: a browser loads it from a static host,
 * Electron loads the same `out/` directory over its own app:// protocol. Because
 * the desktop shell registers a real origin rather than using file://, no
 * assetPrefix divergence is needed and there is only one build of the UI.
 */
const config: NextConfig = {
  ...(basePath ? { basePath } : {}),
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  images: { unoptimized: true },
  transpilePackages: [
    "@cmdgen/contracts",
    "@cmdgen/engine",
    "@cmdgen/rsync",
    "@cmdgen/cd",
    "@cmdgen/ssh",
    "@cmdgen/ls",
    "@cmdgen/rm",
    "@cmdgen/kill",
    "@cmdgen/tar",
    "@cmdgen/registry",
    "@cmdgen/platform",
    "@cmdgen/ui",
  ],
  /**
   * `experimental.optimizePackageImports` was measured here and changed the bundle
   * by 0 KB — it does not apply to workspace source packages already listed in
   * transpilePackages. Left out rather than kept as decoration. Revisit if these
   * packages ever ship built dist with deep entry points.
   */
  env: {
    NEXT_PUBLIC_APP_VERSION: projectVersion,
  },
};

export default config;
