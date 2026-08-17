"use client";

import type { Tune2fsSpec } from "@cmdgen/tune2fs";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/tune2fs";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface Tune2fsPreviewProps {
  spec: Tune2fsSpec;
}

export function Tune2fsPreview({ spec }: Tune2fsPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
