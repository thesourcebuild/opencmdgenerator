"use client";

import type { UmountSpec } from "@cmdgen/umount";
import { buildArgv, lint, renderTokens } from "@cmdgen/umount";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UmountPreviewProps {
  spec: UmountSpec;
}

/** umount's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/mount`'s preview. */
export function UmountPreview({ spec }: UmountPreviewProps) {
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
