"use client";

import type { DateSpec } from "@cmdgen/date";
import { buildArgv, lint, renderTokens } from "@cmdgen/date";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface DatePreviewProps {
  spec: DateSpec;
}

export function DatePreview({ spec }: DatePreviewProps) {
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
