import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { KillSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/**
 * Build the kill invocation.
 *
 * PowerShell: Stop-Process has no signal concept at all — targets become a
 * single comma-joined -Id array (its actual array-parameter syntax), plus
 * -Force from the catalogue if set.
 *
 * POSIX "list"/"table" mode: the real second synopsis, `kill [-l|-t]
 * [signal]...` — no targets, no `--` concerns, just -l/-t and the signals
 * to convert (upper-cased the same as signal-mode, empty list = every name).
 *
 * POSIX "signal" mode: the signal is rendered in whichever of the three
 * equivalent spellings `signalStyle` picks, always upper-cased — the manual
 * requires upper case for the bare `-SIGNAL` form specifically ("to avoid
 * ambiguity with lower case option letters"), and upper case is always valid
 * for -s/--signal too (their case is documented as ignored), so normalizing
 * unconditionally is never wrong and removes the whole case pitfall. Then,
 * if the first target looks negative (e.g. "-1"), a `--` is inserted first —
 * the manual's own documented-safe form for that case, and harmless even
 * with the bare shorthand's looser "common extension" behavior.
 */
export function buildArgv(spec: KillSpec): Argv {
  if (spec.platform === "windows-powershell") {
    const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: "powershell" });

    const targets = spec.targets.map((t) => t.trim()).filter((t) => t !== "");
    if (targets.length > 0) {
      args.push({ text: "-Id", role: "flag" });
      args.push({ text: targets.join(","), role: "value" });
    }

    return { binary: "Stop-Process", args };
  }

  if (spec.mode !== "signal") {
    const args: Arg[] = [{ text: spec.mode === "table" ? "-t" : "-l", role: "flag" }];
    for (const raw of spec.listSignals) {
      const trimmed = raw.trim();
      if (trimmed !== "") args.push({ text: trimmed.toUpperCase(), role: "value" });
    }
    return { binary: "kill", args };
  }

  const args: Arg[] = [];

  const signal = spec.signal.trim().toUpperCase();
  if (signal !== "") {
    switch (spec.signalStyle) {
      case "bare":
        args.push({ text: `-${signal}`, role: "flag" });
        break;
      case "short":
        args.push({ text: "-s", role: "flag" });
        args.push({ text: signal, role: "value" });
        break;
      case "long":
        args.push({ text: `--signal=${signal}`, role: "flag", attached: true });
        break;
    }
  }

  const targets = spec.targets.map((t) => t.trim()).filter((t) => t !== "");
  if (targets.length > 0 && targets[0]!.startsWith("-")) {
    args.push({ text: "--", role: "flag" });
  }
  for (const target of targets) {
    args.push({ text: target, role: "value" });
  }

  return { binary: "kill", args };
}
