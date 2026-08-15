"use client";

import type { IptablesSpec } from "@cmdgen/iptables";
import { buildArgv, lint, renderTokens } from "@cmdgen/iptables";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface IptablesPreviewProps {
  spec: IptablesSpec;
}

/** iptables's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/apt`'s preview (iptables is Linux-only, one shell). */
export function IptablesPreview({ spec }: IptablesPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description=""
      continuation=" \\"
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) }]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
