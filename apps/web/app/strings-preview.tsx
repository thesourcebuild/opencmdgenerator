"use client";

import type { StringsSpec } from "@cmdgen/strings";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/strings";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface StringsPreviewProps {
  spec: StringsSpec;
}

export function StringsPreview({ spec }: StringsPreviewProps) {
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
