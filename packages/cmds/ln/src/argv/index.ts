import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { LnSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: LnSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** `mklink`'s fixed mode token — undefined for its default (file symlink). */
const CMD_MODE_FLAG: Record<LnSpec["winKind"], string | undefined> = {
  "file-symlink": undefined,
  "dir-symlink": "/D",
  "hard-link": "/H",
  junction: "/J",
};

/** `New-Item -ItemType` value. PowerShell's SymbolicLink handles both files and directories, unlike mklink's split /D flag. */
const PS_ITEM_TYPE: Record<LnSpec["winKind"], string> = {
  "file-symlink": "SymbolicLink",
  "dir-symlink": "SymbolicLink",
  "hard-link": "HardLink",
  junction: "Junction",
};

/**
 * Build the ln invocation. Argument order genuinely differs by platform:
 * POSIX `ln TARGET LINK_NAME` gives the existing file first; cmd.exe's
 * `MKLINK [mode] Link Target` and PowerShell's `New-Item -Path Link -Target
 * Target` both give the NEW link first — a real, easy-to-miss trap this
 * spec's named `target`/`linkName` fields (rather than a raw positional
 * list) exist specifically to get right regardless of platform.
 */
export function buildArgv(spec: LnSpec): Argv {
  const target = spec.target.trim();
  const linkName = spec.linkName.trim();

  if (spec.platform === "windows-cmd") {
    const args: Arg[] = [];
    const modeFlag = CMD_MODE_FLAG[spec.winKind];
    if (modeFlag) args.push({ text: modeFlag, role: "flag" });
    if (linkName !== "") args.push({ text: linkName, role: "path" });
    if (target !== "") args.push({ text: target, role: "path" });
    return { binary: "mklink", args };
  }

  if (spec.platform === "windows-powershell") {
    const args: Arg[] = [
      { text: "-ItemType", role: "flag" },
      { text: PS_ITEM_TYPE[spec.winKind], role: "value" },
    ];
    if (linkName !== "") {
      args.push({ text: "-Path", role: "flag" });
      args.push({ text: linkName, role: "path" });
    }
    if (target !== "") {
      args.push({ text: "-Target", role: "flag" });
      args.push({ text: target, role: "path" });
    }
    args.push(...buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform }));
    return { binary: "New-Item", args };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });
  if (target !== "") args.push({ text: target, role: "path" });
  if (linkName !== "") args.push({ text: linkName, role: "path" });
  return { binary: "ln", args };
}
