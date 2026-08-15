import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Real semanage manages a large set of SELinux policy object types (login,
 * user, port, interface, node, fcontext, boolean, module, permissive,
 * dontaudit, and more, each with its own further sub-flags). This app
 * deliberately scopes that down to the two most common ones in everyday
 * sysadmin use — fcontext (labeling a file/directory path pattern) and port
 * (labeling a TCP/UDP port) — same "explicitly scoped down" precedent as
 * this app's git support limiting itself to 10 categories rather than every
 * git subcommand and flag. See `explain/describe.ts` for where that scope
 * limit is stated to the user.
 */
export const SemanageObjectType = z.enum(["fcontext", "port"]);
export type SemanageObjectType = z.infer<typeof SemanageObjectType>;

/** Which of -a/-d/-m/-l to render — kept as a semantic enum, same reasoning as `@cmdgen/iptables`'s `IptablesAction`. */
export const SemanageAction = z.enum(["add", "delete", "modify", "list"]);
export type SemanageAction = z.infer<typeof SemanageAction>;

export const SemanageSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  objectType: SemanageObjectType.default("fcontext"),
  action: SemanageAction.default("add"),
  /**
   * The object being labeled. For `fcontext`, a file path pattern (often a
   * regex, e.g. "/web(/.*)?"). For `port`, a "PORT/PROTO" pair (e.g.
   * "8080/tcp") — split into semanage's actual `-p <proto> <port>` argument
   * shape in `argv/index.ts`'s `splitPortTarget`. Ignored by `list`, which
   * takes no target at all.
   */
  target: z.string().default(""),
  /**
   * The SELinux type label (e.g. "httpd_sys_content_t", "http_port_t") —
   * only meaningful for add/modify, where real semanage requires it via
   * `-t`. Ignored by delete (a target alone identifies what to remove) and
   * list.
   */
  type: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — semanage is a Linux-only SELinux policy management
   * tool with no macOS or Windows equivalent by this name at all, same
   * reasoning as `@cmdgen/iptables`'s `shell` field. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type SemanageSpec = z.infer<typeof SemanageSpec>;
