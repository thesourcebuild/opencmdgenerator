import { describe, expect, it } from "vitest";
import { CATALOGUE, type FlagDef } from "@cmdgen/ssh";

/**
 * Transcribed verbatim from the user's own terminal output — this is the
 * completeness contract. Windows (Win32-OpenSSH):
 *
 *   usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface] [-b bind_address]
 *              [-c cipher_spec] [-D [bind_address:]port] [-E log_file]
 *              [-e escape_char] [-F configfile] [-I pkcs11] [-i identity_file]
 *              [-J destination] [-L address] [-l login_name] [-m mac_spec]
 *              [-O ctl_cmd] [-o option] [-P tag] [-p port] [-Q query_option]
 *              [-R address] [-S ctl_path] [-W host:port] [-w local_tun[:remote_tun]]
 *              destination [command [argument ...]]
 *
 * Linux (OpenSSH) is identical except: no `-P tag`, and `-J` is spelled out as
 * `[user@]host[:port]` there instead of the generic word "destination" — the
 * same option, not a difference.
 */
const SINGLE_LETTER_BOOLEANS = ["-4", "-6", "-A", "-a", "-C", "-f", "-G", "-g", "-K", "-k", "-M", "-N", "-n", "-q", "-s", "-T", "-t", "-V", "-v", "-X", "-x", "-Y", "-y"];

const ARG_TAKING = ["-B", "-b", "-c", "-D", "-E", "-e", "-F", "-I", "-i", "-J", "-L", "-l", "-m", "-O", "-o", "-p", "-Q", "-R", "-S", "-W", "-w"];

/**
 * Handled as spec fields, not catalogue flags, because they express identity
 * (destination/port/key) rather than behavior — the same reasoning rsync's
 * source/destination and tar's -f/-C use.
 */
const SPEC_FIELD_OPTIONS = ["-i", "-p"];

/**
 * Deliberately not modeled — not omissions. `-l login_name` duplicates what
 * the `user` field already expresses via `user@host`; adding it back as a
 * flag would let a spec set the user two contradictory ways at once.
 * `destination [command [argument ...]]` is covered by the single
 * `remoteCommand` string field — ssh joins multiple trailing argv words into
 * one remote command string itself, so one field produces the same result.
 */
const INTENTIONALLY_NOT_MODELED = ["-l"];

/**
 * Windows-only and NOT part of upstream OpenSSH — `-p` is the real port flag
 * there, so `-P tag` is some Win32-OpenSSH-specific addition with no
 * documented meaning available to verify. Left unimplemented rather than
 * guessed at; see the conversation this test was added from.
 */
const UNVERIFIED_WINDOWS_ONLY = ["-P"];

function spellingsOf(flag: FlagDef): string[] {
  const out: string[] = [];
  if (flag.short) out.push(flag.short);
  out.push(flag.long.split("=")[0]!);
  for (const option of flag.options ?? []) {
    if (option.renders === "") continue;
    for (const part of option.renders.split(/\s+/)) out.push(part.split("=")[0]!);
  }
  return out;
}

function allSpellings(): Set<string> {
  const tokens = new Set<string>();
  for (const flag of CATALOGUE.flags as readonly FlagDef[]) {
    for (const spelling of spellingsOf(flag)) tokens.add(spelling);
  }
  return tokens;
}

describe("ssh usage-line coverage", () => {
  const tokens = allSpellings();

  it("has no duplicate order values", () => {
    const orders = CATALOGUE.flags.map((f) => f.order);
    expect(orders.filter((o, i) => orders.indexOf(o) !== i)).toEqual([]);
  });

  it("has no duplicate flag ids", () => {
    const ids = CATALOGUE.flags.map((f) => f.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it("can represent every bundled single-letter option", () => {
    const missing = SINGLE_LETTER_BOOLEANS.filter((opt) => !tokens.has(opt));
    expect(missing).toEqual([]);
  });

  it("can represent every argument-taking option (excluding identity/port, which are spec fields)", () => {
    const missing = ARG_TAKING.filter((opt) => {
      if (SPEC_FIELD_OPTIONS.includes(opt)) return false;
      if (INTENTIONALLY_NOT_MODELED.includes(opt)) return false;
      return !tokens.has(opt);
    });
    expect(missing).toEqual([]);
  });

  it("documents exactly one unverified Windows-only option (-P), not silently", () => {
    // This test exists so that if -P's meaning is ever confirmed, someone has
    // to come here and delete this test rather than the gap staying invisible.
    expect(UNVERIFIED_WINDOWS_ONLY).toEqual(["-P"]);
    expect(tokens.has("-P")).toBe(false);
  });

  it("-L and -R document their full [bind_address:] form, not just the short mnemonic", () => {
    const localForward = CATALOGUE.getFlag("localForward")!;
    const remoteForward = CATALOGUE.getFlag("remoteForward")!;
    expect(localForward.detail).toContain("[bind_address:]local_port:remote_host:remote_port");
    expect(remoteForward.detail).toContain("[bind_address:]remote_port:local_host:local_port");
  });

  it("every enum flag offers the engine's inactive sentinel as its first option", () => {
    for (const flag of CATALOGUE.flags as readonly FlagDef[]) {
      if (flag.kind !== "enum") continue;
      expect(flag.options?.[0]?.value, `${flag.id}'s first option must be "none"`).toBe("none");
      expect(flag.options?.[0]?.renders, `${flag.id}'s "none" must render nothing`).toBe("");
    }
  });

  it("-4 and -6 cannot both be selected — they're one enum, not two independent booleans", () => {
    const ipVersion = CATALOGUE.getFlag("ipVersion")!;
    expect(ipVersion.kind).toBe("enum");
    expect(ipVersion.options?.map((o) => o.value)).toEqual(["none", "ipv4", "ipv6"]);
  });
});
