"use client";

import type { WhoisSpec } from "@cmdgen/whois";
import { buildArgv, lint, renderTokens } from "@cmdgen/whois";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface WhoisPreviewProps {
  spec: WhoisSpec;
}

/** whois's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function WhoisPreview({ spec }: WhoisPreviewProps) {
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
