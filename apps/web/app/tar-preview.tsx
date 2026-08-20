"use client";

import { useState } from "react";
import type { ShellDialect, TarSpec } from "@cmdgen/tar";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/tar";
import type { RenderedToken } from "@cmdgen/engine";
import { Button } from "@cmdgen/ui";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { ShellQuotingSelect } from "./shell-dialect-selector";

export interface TarPreviewProps {
  spec: TarSpec;
  onShellChange: (shell: ShellDialect) => void;
  commandExample?: string;
}

function tokensFromCommandExample(commandExample: string): readonly RenderedToken[] {
  return commandExample
    .split(/\s+/)
    .filter(Boolean)
    .map((text, index) => ({
      text,
      role:
        index === 0
          ? "binary"
          : text === ">" || text === "|" || text === ">>"
            ? "flag"
            : text.startsWith("-")
              ? "flag"
              : text === "-" ||
                  text.endsWith(".gz") ||
                  text.endsWith(".zst") ||
                  text.includes("/")
                ? "path"
                : "value",
    }));
}

/** tar's data for the shared `GeneratedCommandPanel` template — a shell-quoting picker (real choice once Windows is active, disabled POSIX placeholder otherwise; see `ShellDialectTargetSelector` in the sidebar for the POSIX/Windows choice itself), plus the short-flag bundling toggle that makes `-czvf` readable. */
export function TarPreview({ spec, onShellChange, commandExample }: TarPreviewProps) {
  const [combine, setCombine] = useState(true);
  const tokens = commandExample
    ? tokensFromCommandExample(commandExample)
    : renderTokens(buildArgv(spec), { shell: spec.shell, combineShortFlags: combine });

  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[{ id: "normal", label: "Command", tokens }]}
      dialect={spec.shell}
      isDestructive={lint(spec).counts.destructive > 0}
      extraActions={
        <>
          <ShellQuotingSelect
            value={spec.shell}
            onChange={onShellChange}
            title="Which Windows shell will run this command — controls quoting only. tar is a real executable, so its flags are identical everywhere."
          />
          {!commandExample ? (
            <Button
              size="sm"
              variant={combine ? "primary" : "secondary"}
              onClick={() => setCombine((c) => !c)}
              title="Bundle single-letter flags the way every tar tutorial writes them."
            >
              {combine ? "-czvf" : "-c -z -v -f"}
            </Button>
          ) : null}
        </>
      }
    />
  );
}
