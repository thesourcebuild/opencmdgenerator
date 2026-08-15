import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { EmacsSpec } from "../spec";
import { flagBool } from "../pure";

const noFiles: LintRule<EmacsSpec> = {
  code: "EMC001",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [
      {
        code: "EMC001",
        level: "info",
        message: "No files given — Emacs will open with an empty scratch buffer.",
        field: "files",
      },
    ];
  },
};

const daemonStartsInBackground: LintRule<EmacsSpec> = {
  code: "EMC002",
  check(spec) {
    if (!flagBool(spec, "daemon")) return [];
    return [
      {
        code: "EMC002",
        level: "info",
        message: "--daemon starts an Emacs server in the background instead of opening a window.",
        detail: "Connect to it afterward with emacsclient. No frame is ever shown by this invocation itself.",
        flagIds: ["daemon"],
      },
    ];
  },
};

const noWindowSystemWithDaemon: LintRule<EmacsSpec> = {
  code: "EMC003",
  check(spec) {
    if (!flagBool(spec, "daemon") || !flagBool(spec, "noWindowSystem")) return [];
    return [
      {
        code: "EMC003",
        level: "info",
        message: "-nw has no effect alongside --daemon.",
        detail: "A daemon never shows any frame — graphical or terminal — until a client connects, so -nw is redundant here.",
        flagIds: ["noWindowSystem", "daemon"],
      },
    ];
  },
};

export const RULES: readonly LintRule<EmacsSpec>[] = [noFiles, daemonStartsInBackground, noWindowSystemWithDaemon];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
