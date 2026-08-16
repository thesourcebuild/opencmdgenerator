"use client";

import type { Bzip2Spec } from "@cmdgen/bzip2";
import { buildArgv, lint, renderTokens } from "@cmdgen/bzip2";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface Bzip2PreviewProps {
  spec: Bzip2Spec;
}

export function Bzip2Preview({ spec }: Bzip2PreviewProps) {
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
