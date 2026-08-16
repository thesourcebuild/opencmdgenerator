"use client";

import type { PgrepSpec } from "@cmdgen/pgrep";
import { buildArgv, lint, renderTokens } from "@cmdgen/pgrep";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PgrepPreviewProps {
  spec: PgrepSpec;
}

export function PgrepPreview({ spec }: PgrepPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation=" \"
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
