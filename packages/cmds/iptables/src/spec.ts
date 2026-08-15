import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/** -A / -I / -D's target chain — a bare word, never a `-flag`. */
export const IptablesChain = z.enum(["INPUT", "OUTPUT", "FORWARD"]);
export type IptablesChain = z.infer<typeof IptablesChain>;

/**
 * Which of -A/-I/-D to render. Kept as a semantic enum rather than the raw
 * flag token itself so the UI can offer readable labels ("append", "insert",
 * "delete") — the lookup from this to the actual `-A`/`-I`/`-D` text lives in
 * `argv/index.ts`, same shape as `@cmdgen/rm`'s or `@cmdgen/mount`'s
 * action-to-flag maps.
 */
export const IptablesAction = z.enum(["append", "insert", "delete"]);
export type IptablesAction = z.infer<typeof IptablesAction>;

/** -p's value. "any" means "omit -p entirely" — iptables itself has no literal "any" protocol keyword. */
export const IptablesProtocol = z.enum(["any", "tcp", "udp"]);
export type IptablesProtocol = z.infer<typeof IptablesProtocol>;

/** -j's target. */
export const IptablesJump = z.enum(["ACCEPT", "DROP", "REJECT"]);
export type IptablesJump = z.infer<typeof IptablesJump>;

export const IptablesSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * Real iptables rules are built from a run of bare `-flag value` PAIRS
   * (`-A INPUT`, `-p tcp`, `--dport 22`, `-s 1.2.3.4`, `-j ACCEPT`) chained in
   * a fixed order — nothing like the repeatable, order-independent
   * `--flag=value` catalogue flags the rest of this app models with
   * `buildFlagArgs`. Same reasoning as `@cmdgen/dd`'s if=/of=/bs=/etc and
   * `@cmdgen/ifconfig`'s state/netmask/mtu: every one of these lives here as
   * a plain spec-level field and is pushed manually, in order, in
   * `argv/index.ts`, rather than going through the catalogue machinery at
   * all (see `catalogue/flags.ts` — `FLAGS` is empty).
   */
  chain: IptablesChain.default("INPUT"),
  action: IptablesAction.default("append"),
  protocol: IptablesProtocol.default("any"),
  /**
   * --dport's value, used only when non-empty. Real iptables requires an
   * explicit protocol (-p tcp or -p udp) before --dport has any effect —
   * this field is still rendered even when `protocol` is "any" (nothing
   * here silently drops user input), but IPTABLES001 in `lint/rules.ts`
   * flags that exact combination as very likely a mistake.
   */
  port: z.string().default(""),
  /** -s's value — an optional source IP/CIDR to match against. */
  source: z.string().default(""),
  jumpTarget: IptablesJump.default("ACCEPT"),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — iptables is a Linux-only tool with no macOS (which uses
   * the unrelated `pfctl`) or Windows equivalent by this name at all, same
   * reasoning as `@cmdgen/apt`'s `shell` field. Kept only so the generic
   * render pipeline has a ShellDialect to quote with; the UI never offers a
   * way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type IptablesSpec = z.infer<typeof IptablesSpec>;
