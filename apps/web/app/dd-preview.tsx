"use client";

import type { DdSpec } from "@cmdgen/dd";
import { buildArgv, lint, renderTokens } from "@cmdgen/dd";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface DdPreviewProps {
  spec: DdSpec;
}

/**
 * dd's data for the shared `GeneratedCommandPanel` template — no shell
 * picker, same reasoning as `@cmdgen/mount`'s preview. dd's own
 * `renderTokens` (see `@cmdgen/dd/render.ts`) takes no options at all — it's
 * POSIX-only, unlike the generic engine's `renderTokens`, which mount's
 * preview calls with `{ shell: spec.shell }`.
 */
export function DdPreview({ spec }: DdPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description=""
      continuation=" \\"
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv) }]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
