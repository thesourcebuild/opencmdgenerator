import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { RmSpec } from "../spec";
import { flagBool, flagEnum, setFlag } from "../pure";

const isPowerShell = (spec: RmSpec) => spec.platform === "windows-powershell";

/** Patterns where "delete this, recursively, forcefully" is almost certainly a mistake. */
const CATASTROPHIC_PATTERNS_POSIX = new Set(["/", "~", ".", "..", "*", "./*", "/*"]);
/** Same idea, PowerShell/Windows-shaped: drive roots and the provider-level home shorthand. */
const CATASTROPHIC_PATTERNS_POWERSHELL = new Set(["C:\\", "\\", "~", ".", ".."]);

function validPaths(spec: RmSpec): string[] {
  return spec.paths.map((p) => p.trim()).filter((p) => p !== "");
}

const noTargets: LintRule<RmSpec> = {
  code: "RM001",
  check(spec) {
    if (validPaths(spec).length > 0) return [];
    return [
      {
        code: "RM001",
        level: "error",
        message: "No files or directories to remove.",
        field: "paths",
      },
    ];
  },
};

const catastrophicPath: LintRule<RmSpec> = {
  code: "RM002",
  check(spec) {
    const patterns = isPowerShell(spec) ? CATASTROPHIC_PATTERNS_POWERSHELL : CATASTROPHIC_PATTERNS_POSIX;
    const hits = validPaths(spec).filter((p) => patterns.has(p));
    if (hits.length === 0) return [];
    return [
      {
        code: "RM002",
        level: "destructive",
        message: `"${hits.join('", "')}" targets an entire filesystem root, home directory, or everything in the current directory.`,
        detail:
          "This is the shape of command that has wiped out home directories and servers by accident. Double, then triple-check this is really the intended target before running it.",
        field: "paths",
      },
    ];
  },
};

const recursiveForce: LintRule<RmSpec> = {
  code: "RM003",
  check(spec) {
    const recursive = isPowerShell(spec) ? flagBool(spec, "recursePs") : flagBool(spec, "recursive");
    const force = isPowerShell(spec) ? flagBool(spec, "forcePs") : flagBool(spec, "force");
    if (!recursive || !force) return [];
    return [
      {
        code: "RM003",
        level: "destructive",
        message: isPowerShell(spec)
          ? "Remove-Item -Recurse -Force: recursive and forced — the PowerShell equivalent of rm -rf."
          : "rm -rf: recursive and forced — no prompts, no way back.",
        detail:
          "Every file and subdirectory under each target is removed immediately, silently, and permanently. Review the path list once more before running this.",
        flagIds: isPowerShell(spec) ? ["recursePs", "forcePs"] : ["recursive", "force"],
      },
    ];
  },
};

const noPreserveRootRisk: LintRule<RmSpec> = {
  code: "RM004",
  check(spec) {
    // Windows/Remove-Item has no equivalent protection to disable in the first place.
    if (isPowerShell(spec) || !flagBool(spec, "noPreserveRoot")) return [];
    return [
      {
        code: "RM004",
        level: "destructive",
        message: "--no-preserve-root removes GNU rm's one built-in guard against deleting /.",
        detail:
          "rm -rf / is refused by default specifically to prevent destroying the entire filesystem. This flag turns that protection off.",
        flagIds: ["noPreserveRoot"],
        fix: { label: "Remove --no-preserve-root", apply: (s) => setFlag(s, "noPreserveRoot", undefined) },
      },
    ];
  },
};

const alwaysIrreversible: LintRule<RmSpec> = {
  code: "RM005",
  check(spec) {
    if (validPaths(spec).length === 0) return []; // RM001 already covers this case.

    if (isPowerShell(spec)) {
      if (flagBool(spec, "whatIfPs")) return []; // -WhatIf only previews — nothing is actually removed.
      return [
        {
          code: "RM005",
          level: "destructive",
          message: "This command permanently deletes the listed files and directories.",
          detail:
            "Unlike POSIX rm, Remove-Item has a real dry-run: -WhatIf previews what would happen without removing anything. Worth running once first.",
          field: "paths",
          fix: { label: "Add -WhatIf to preview first", apply: (s) => setFlag(s, "whatIfPs", true) },
        },
      ];
    }

    return [
      {
        code: "RM005",
        level: "destructive",
        message: "This command permanently deletes the listed files and directories.",
        detail: "Unlike rsync's --delete, rm has no --dry-run. There is no undo and no recycle bin.",
        field: "paths",
      },
    ];
  },
};

const forceWithoutVisibility: LintRule<RmSpec> = {
  code: "RM006",
  check(spec) {
    if (isPowerShell(spec)) {
      if (!flagBool(spec, "forcePs")) return [];
      if (flagBool(spec, "verbosePs")) return [];
      if (flagBool(spec, "confirmPs")) return [];
      return [
        {
          code: "RM006",
          level: "warning",
          message: "-Force gives no confirmation and, without -Verbose, no output either.",
          detail: "You won't see what was removed unless something goes wrong. -Verbose at least reports each removal.",
          flagIds: ["forcePs", "verbosePs"],
          fix: { label: "Add -Verbose", apply: (s) => setFlag(s, "verbosePs", true) },
        },
      ];
    }

    if (!flagBool(spec, "force")) return [];
    if (flagBool(spec, "verbose")) return [];
    if (flagEnum(spec, "interactive", ["once", "always"])) return [];
    return [
      {
        code: "RM006",
        level: "warning",
        message: "-f gives no confirmation and, without -v, no output either.",
        detail: "You won't see what was removed unless something goes wrong. -v at least reports each removal.",
        flagIds: ["force", "verbose"],
        fix: { label: "Add -v", apply: (s) => setFlag(s, "verbose", true) },
      },
    ];
  },
};

export const RULES: readonly LintRule<RmSpec>[] = [
  noTargets,
  catastrophicPath,
  recursiveForce,
  noPreserveRootRisk,
  alwaysIrreversible,
  forceWithoutVisibility,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
