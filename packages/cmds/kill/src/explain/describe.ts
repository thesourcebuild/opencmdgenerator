import type { KillSpec } from "../spec";
import { flagBool } from "../pure";

const isPosixFamily = (spec: KillSpec) =>
  spec.platform === "linux" ||
  spec.platform === "mac" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";

export function describeSpec(spec: KillSpec): string {
  if (isPosixFamily(spec) && spec.mode !== "signal") {
    const signals = spec.listSignals.map((s) => s.trim()).filter((s) => s !== "");
    const which = signals.length === 0 ? "every supported signal name" : signals.length === 1 ? `signal ${signals[0]}` : `${signals.length} signals`;
    return spec.mode === "table"
      ? `Print a table of numbers, names, and descriptions for ${which} — nothing is signaled.`
      : `List ${which}${signals.length === 0 ? "" : ", converting between name and number"} — nothing is signaled.`;
  }

  const targets = spec.targets.map((t) => t.trim()).filter((t) => t !== "");
  const who = targets.length === 0 ? "NO PROCESSES (no targets set)" : targets.length === 1 ? `process ${targets[0]}` : `${targets.length} processes`;

  if (spec.platform === "windows-powershell") {
    const forced = flagBool(spec, "forcePs") ? ", forcing it if it would otherwise refuse" : "";
    return `Stop ${who}${forced}.`;
  }

  const signal = (spec.signal.trim() || "TERM").toUpperCase();
  const specialNote = targets.includes("0")
    ? " — 0 means every process in your own process group"
    : targets.includes("-1")
      ? " — -1 means every process you have permission to signal"
      : targets.some((t) => /^-\d+$/.test(t) && t !== "-1")
        ? " — a PID below -1 targets that whole process group"
        : "";
  return `Send SIG${signal.replace(/^SIG/i, "")} to ${who}${specialNote}.`;
}
