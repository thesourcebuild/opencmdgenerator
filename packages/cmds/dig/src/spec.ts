import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Real dig record types this app models. `""` renders nothing (dig defaults
 * to A when no type is given), so it is a valid, meaningful default rather
 * than a placeholder that needs coercing to something else.
 */
export const DigRecordType = z.enum(["", "A", "AAAA", "MX", "TXT", "NS", "CNAME", "ANY"]);
export type DigRecordType = z.infer<typeof DigRecordType>;

export const DigSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * The domain name (or, with `-x` set, the address) to look up — dig's one
   * mandatory positional. Same role as traceroute's `host`.
   */
  lookupName: z.string().default(""),
  /** Record type, e.g. "MX" — a bare positional after the name, not a `-flag`. Ignored by real dig when `-x` is set. */
  type: DigRecordType.default(""),
  /**
   * The server to query, without the leading `@` — added by `argv/index.ts`
   * when rendering. Optional: a bare `dig example.com` uses the system
   * resolver.
   */
  server: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — dig is a real, identically-behaving binary
   * on Linux/macOS and inside any POSIX-capable shell on Windows (WSL,
   * Cygwin, MSYS2); it has no separate cmd.exe/PowerShell-native form or
   * flag set the way tracert/ipconfig do, so unlike traceroute/ifconfig this
   * needs no platform axis at all — same shape as `@cmdgen/df`'s `shell`
   * field. Kept only so the generic render pipeline has a ShellDialect to
   * quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type DigSpec = z.infer<typeof DigSpec>;
