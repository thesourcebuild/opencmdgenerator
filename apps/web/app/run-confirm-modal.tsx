"use client";

import { useEffect, useState } from "react";
import { Button, Dialog } from "@cmdgen/ui";
import type { RunShellKind } from "@cmdgen/contracts";

const SHELL_LABEL: Record<RunShellKind, string> = {
  cmd: "Command Prompt",
  powershell: "PowerShell",
  wsl: "WSL",
  bash: "Bash",
};

/** A real hold, not decoration — the security review flagged that lint's `destructive` level can't be trusted uniformly across every command, so this is the one gate every Run shares. */
const DESTRUCTIVE_HOLD_SECONDS = 3;

export interface RunConfirmModalProps {
  open: boolean;
  commandText: string;
  shellKind: RunShellKind;
  isDestructive: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Deliberately not styled like `DiagnosticsPanel`'s "Destructive" lint
 * badge — reusing that visual language risks click-through fatigue: a user
 * who has seen ten orange lint badges while editing flags will pattern-match
 * an eleventh as more of the same, not as "this is about to actually
 * happen." Every Run gets this modal, destructive-flagged or not, since
 * lint coverage can't be trusted uniformly across every command this app
 * generates.
 */
export function RunConfirmModal({ open, commandText, shellKind, isDestructive, onConfirm, onCancel }: RunConfirmModalProps) {
  const [holdRemaining, setHoldRemaining] = useState(isDestructive ? DESTRUCTIVE_HOLD_SECONDS : 0);

  useEffect(() => {
    if (!open) return;
    setHoldRemaining(isDestructive ? DESTRUCTIVE_HOLD_SECONDS : 0);
    if (!isDestructive) return;
    const interval = setInterval(() => setHoldRemaining((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(interval);
  }, [open, isDestructive]);

  return (
    <Dialog open={open} onClose={onCancel} title="Type this into a real shell?">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        This types the command below into a real {SHELL_LABEL[shellKind]} session. Nothing runs until
        you press Enter yourself, in that session.
      </p>

      <pre className="mt-3 overflow-x-auto rounded-md bg-slate-50 p-3 font-mono text-xs text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {commandText}
      </pre>

      {isDestructive && (
        <p className="mt-3 rounded-md border-l-4 border-l-red-500 bg-red-50 px-3 py-2 text-xs text-red-800 dark:bg-red-950/30 dark:text-red-300">
          This command is flagged destructive. Once you press Enter in the shell, there is no undo.
        </p>
      )}

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        After this, everything typed into the session — including replies to any prompts it shows —
        runs with none of this app&apos;s checks involved.
      </p>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant={isDestructive ? "danger" : "primary"} disabled={holdRemaining > 0} onClick={onConfirm}>
          {holdRemaining > 0 ? `Open terminal (${holdRemaining})` : "Open terminal"}
        </Button>
      </div>
    </Dialog>
  );
}
