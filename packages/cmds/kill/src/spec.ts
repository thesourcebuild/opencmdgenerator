import { z } from "zod";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { SPEC_VERSION };

/**
 * A real "Target platform" axis (linux/mac/windows), mirroring
 * `@cmdgen/ls`'s `LsPlatform` shape: Linux and Mac render identically (both
 * are plain POSIX `kill`), and Windows further branches into WHICH shell will
 * run the command — `windows-powershell`/`windows-cygwin`/`windows-msys`/
 * `windows-wsl`, deliberately excluding a `windows-cmd` value entirely, same
 * as ls (`kill` has no cmd.exe equivalent binary; `Stop-Process` is
 * PowerShell-only).
 *
 * `kill` and PowerShell's `Stop-Process` (which `kill` is only an *alias* for
 * on Windows) aren't just differently-flagged — Stop-Process has no signal
 * concept at all (Windows processes don't have Unix signals), only a target
 * plus an optional -Force.
 *
 * `windows-cygwin`, `windows-msys`, and `windows-wsl` invoke the exact same
 * real `kill` binary with the exact same signal-sending behavior as
 * `linux`/`mac` — unlike `windows-powershell`'s `Stop-Process`, which has no
 * signal concept at all. Unlike ls, kill has no path arguments in the first
 * place (targets are PIDs/job-specs), so there is no path-spelling conversion
 * for `toShellDialect` (in `pure.ts`) to matter for here — cygwin/msys/wsl are
 * simply included for platform-family consistency with every other
 * multi-platform command, using the exact same real `kill` binary as
 * linux/mac.
 */
export const KillPlatform = z.enum(["linux", "mac", "windows-powershell", "windows-cygwin", "windows-msys", "windows-wsl"]);
export type KillPlatform = z.infer<typeof KillPlatform>;

/**
 * kill's real second synopsis — `kill [-l|--list|-t|--table] [signal]...` —
 * lists or converts signal names/numbers instead of sending anything.
 * PowerShell has nothing analogous (Stop-Process has no signal concept at
 * all), so this only ever matters on the POSIX-family platforms
 * (`linux`/`mac`/`windows-cygwin`/`windows-msys`), never `windows-powershell`.
 */
export const KillMode = z.enum(["signal", "list", "table"]);
export type KillMode = z.infer<typeof KillMode>;

/**
 * The manual documents three equivalent ways to give a signal — bare
 * `-SIGNAL`, `-s SIGNAL`, `--signal SIGNAL` — this is purely which one gets
 * rendered, not a different value. POSIX only.
 */
export const SignalOptionStyle = z.enum(["bare", "short", "long"]);
export type SignalOptionStyle = z.infer<typeof SignalOptionStyle>;

/**
 * kill's entire POSIX configuration is the mode, signal, and targets — GNU
 * kill has no other flags worth modeling (no --dry-run, no --verbose). The
 * PowerShell side gets exactly one flag (-Force) — see catalogue/flags.ts.
 */
export const KillSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Which of the two real synopses this spec builds. Ignored on PowerShell. */
  mode: KillMode.default("signal"),
  /** Bare name (TERM) or number (9) — kill accepts either. Ignored on PowerShell and outside "signal" mode. */
  signal: z.string().default("TERM"),
  /** Which of the three equivalent spellings to render the signal as. Ignored on PowerShell and outside "signal" mode. */
  signalStyle: SignalOptionStyle.default("bare"),
  /** PIDs, or a job spec like %1 on POSIX; PIDs only on PowerShell. Only used in "signal" mode. */
  targets: z.array(z.string()).default([]),
  /** Signals to list/convert in "list"/"table" mode — empty means "every supported signal name" (-l's own default). */
  listSignals: z.array(z.string()).default([]),
  platform: KillPlatform.default("linux"),

  flags: FlagValues.default({}),
});
export type KillSpec = z.infer<typeof KillSpec>;
