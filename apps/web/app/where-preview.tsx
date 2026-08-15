"use client";

import type { WhereSpec } from "@cmdgen/where";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/where";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface WherePreviewProps {
  spec: WhereSpec;
}

/**
 * where's data for the shared `GeneratedCommandPanel` template — no shell
 * picker beyond the platform buttons, same reasoning as `@cmdgen/which`'s
 * preview. `WherePlatform`'s two values ("cmd"/"powershell") are literally
 * `ShellDialect` members, so the generic `continuationFor`/`renderTokens`
 * work directly with no adapter, unlike `@cmdgen/alias`'s bespoke platform
 * type.
 */
export function WherePreview({ spec }: WherePreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.platform)}
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.platform }) }]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.platform}
    />
  );
}
