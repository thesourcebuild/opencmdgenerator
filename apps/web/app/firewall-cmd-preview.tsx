"use client";

import type { FirewallCmdSpec } from "@cmdgen/firewall-cmd";
import { buildArgv, lint, renderTokens } from "@cmdgen/firewall-cmd";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FirewallCmdPreviewProps {
  spec: FirewallCmdSpec;
}

/** firewall-cmd's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/ufw`'s preview (Linux-only, one shell). */
export function FirewallCmdPreview({ spec }: FirewallCmdPreviewProps) {
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
