import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Which mode `route` runs in. Pushed as a single bare leading token — `route
 * add`/`route del` — never a `-flag`; "show" renders as a bare `route` with
 * no subcommand at all. Same shape as `@cmdgen/service`'s `action`.
 */
export const RouteAction = z.enum(["show", "add", "delete"]);
export type RouteAction = z.infer<typeof RouteAction>;

export const RouteSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  action: RouteAction.default("show"),
  /** The target network/host, e.g. "192.168.1.0/24" or "default". Required for add/delete; ignored by show. */
  destination: z.string().default(""),
  /** The gateway to route through, e.g. "192.168.1.1". Optional even for add/delete — a route can instead go out a bare interface. */
  gateway: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — `route` (net-tools) is a Linux-only command; macOS's own
   * `route` has different flag syntax and Windows' `route.exe` is a different
   * tool entirely, neither modeled here. Same single-platform shape as
   * `@cmdgen/service`'s `shell` field. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type RouteSpec = z.infer<typeof RouteSpec>;
