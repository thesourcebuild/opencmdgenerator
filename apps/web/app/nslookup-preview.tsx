"use client";

import type { NslookupSpec } from "@cmdgen/nslookup";
import { buildArgv, lint, renderTokens } from "@cmdgen/nslookup";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface NslookupPreviewProps {
  spec: NslookupSpec;
}

/** nslookup's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function NslookupPreview({ spec }: NslookupPreviewProps) {
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
