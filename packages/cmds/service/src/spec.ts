import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/** Which action `service NAME ACTION` runs — see `argv/index.ts`. */
export const ServiceAction = z.enum(["start", "stop", "restart", "reload", "status"]);
export type ServiceAction = z.infer<typeof ServiceAction>;

export const ServiceSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The service to act on, e.g. "nginx" — required for a meaningful invocation. */
  serviceName: z.string().default(""),
  /** Which of start/stop/restart/reload/status to run. */
  action: ServiceAction.default("status"),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/mount`'s/
   * `@cmdgen/dd`'s `shell` field. `service` is the SysV-init-era wrapper
   * still present on most Linux distros alongside systemd; macOS uses
   * `launchctl`, a completely different tool, not modeled here, and there is
   * no Windows equivalent by this name either (`sc.exe`/`Get-Service` are
   * different tools). Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type ServiceSpec = z.infer<typeof ServiceSpec>;
