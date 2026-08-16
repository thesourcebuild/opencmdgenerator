"use client";

import type { IpSpec } from "@cmdgen/ip";
import { buildArgv, lint, renderTokens } from "@cmdgen/ip";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface IpPreviewProps {
  spec: IpSpec;
}

export function IpPreview({ spec }: IpPreviewProps) {
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
