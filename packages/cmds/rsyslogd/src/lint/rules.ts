import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { RsyslogdSpec } from "../spec";
import { flagBool, flagNumber, setFlag } from "../pure";

/**
 * -N causes rsyslogd to parse the config, report at the given verbosity, and
 * exit immediately — it never daemonizes and never enters its main loop.
 * Combining it with -n (stay in foreground) or -d (debug mode) is legal but
 * has no effect: there's no foreground/daemon distinction to make, and
 * nothing ever runs long enough to debug. `fix` clears the two flags that
 * are being silently ignored.
 */
const checkConfigIgnoresRuntimeFlags: LintRule<RsyslogdSpec> = {
  code: "RSL001",
  check(spec) {
    if (flagNumber(spec, "checkConfig") === undefined) return [];
    const ignored: string[] = [];
    if (flagBool(spec, "foreground")) ignored.push("foreground");
    if (flagBool(spec, "debug")) ignored.push("debug");
    if (ignored.length === 0) return [];

    const diagnostic: Diagnostic<RsyslogdSpec> = {
      code: "RSL001",
      level: "warning",
      message: "-N validates the config and exits immediately — -n and -d have no effect alongside it.",
      detail: "rsyslogd never daemonizes or enters its main loop in config-check mode, so there's no foreground/background distinction to make and nothing runs long enough to debug.",
      flagIds: ignored,
      fix: {
        label: "Remove -n/-d",
        apply: (s) => ignored.reduce((next, id) => setFlag(next, id, undefined), s),
      },
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<RsyslogdSpec>[] = [checkConfigIgnoresRuntimeFlags];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
