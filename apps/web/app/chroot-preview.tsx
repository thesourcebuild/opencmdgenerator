"use client";

import type { ChrootSpec } from "@cmdgen/chroot";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/chroot";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ChrootPreviewProps {
  spec: ChrootSpec;
}

export function ChrootPreview({ spec }: ChrootPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
