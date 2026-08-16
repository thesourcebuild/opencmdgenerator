"use client";

import type { Bunzip2Spec } from "@cmdgen/bunzip2";
import { buildArgv, lint, renderTokens } from "@cmdgen/bunzip2";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface Bunzip2PreviewProps {
  spec: Bunzip2Spec;
}

export function Bunzip2Preview({ spec }: Bunzip2PreviewProps) {
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
