import type { LintRule } from "@cmdgen/contracts/diagnostic";
import { looksLikeWindowsPath } from "@cmdgen/engine";
import type { CdSpec } from "../spec";

// Every platform that runs *on* Windows — cmd.exe, PowerShell, Cygwin, MSYS2
// and WSL alike — so a C:\... path is unremarkable there and CD001 should not
// fire. Only true POSIX hosts (linux/mac) get the warning: Cygwin, MSYS2 and
// WSL are bash environments, but they still run on (or alongside) a real
// Windows filesystem with real drive letters, unlike linux/mac.
const isWindowsHosted = (spec: CdSpec) =>
  spec.platform === "windows-cmd" ||
  spec.platform === "windows-powershell" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";

const windowsPathOnPosixPlatform: LintRule<CdSpec> = {
  code: "CD001",
  check(spec) {
    if (isWindowsHosted(spec) || !looksLikeWindowsPath(spec.path)) return [];
    return [
      {
        code: "CD001",
        level: "warning",
        message: "A Windows-style path is set, but the target platform is Linux or macOS.",
        detail:
          "Neither shell understands C:\\ style paths or UNC shares. Pick the matching platform above, or rewrite the path as a POSIX path.",
        field: "path",
      },
    ];
  },
};

const homeShorthandOnCmd: LintRule<CdSpec> = {
  code: "CD002",
  check(spec) {
    // PowerShell's filesystem provider expands `~` directly — only cmd.exe lacks it.
    if (spec.platform !== "windows-cmd" || !spec.path.trim().startsWith("~")) return [];
    return [
      {
        code: "CD002",
        level: "warning",
        message: "`~` does not expand to the home directory in cmd.exe.",
        detail:
          "cmd.exe has no home-directory shorthand. Use %USERPROFILE% instead (the \"Home directory\" preset does this for you).",
        field: "path",
        fix: { label: "Use %USERPROFILE%", apply: (s) => ({ ...s, path: "%USERPROFILE%" }) },
      },
    ];
  },
};

export const RULES: readonly LintRule<CdSpec>[] = [windowsPathOnPosixPlatform, homeShorthandOnCmd];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
