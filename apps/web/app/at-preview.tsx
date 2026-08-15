"use client";

import type { AtSpec } from "@cmdgen/at";
import { buildArgv, lint, renderTokens } from "@cmdgen/at";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface AtPreviewProps {
  spec: AtSpec;
}

/**
 * at's data for the shared `GeneratedCommandPanel` template — no shell
 * picker, same reasoning as `@cmdgen/crontab`'s preview. `renderTokens` here
 * is at's own (from `render.ts`), not the generic one — it needs the whole
 * spec, not just a shell dialect, to add the `echo ... |` prefix for the
 * schedule action.
 */
export function AtPreview({ spec }: AtPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description={spec.action === "remove" ? "This app never cancels anything." : "This app never schedules anything."}
      continuation=" \\"
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, spec) }]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
