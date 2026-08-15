"use client";

import type { CrontabSpec } from "@cmdgen/crontab";
import { buildArgv, lint, renderTokens } from "@cmdgen/crontab";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface CrontabPreviewProps {
  spec: CrontabSpec;
}

/** crontab's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/service`'s preview. */
export function CrontabPreview({ spec }: CrontabPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description={spec.action === "remove" ? "This app never removes anything." : ""}
      continuation=" \\"
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) }]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
