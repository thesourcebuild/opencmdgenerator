import { describe, expect, it } from "vitest";
import { CATALOGUE, type FlagDef } from "@cmdgen/scp";

/**
 * Transcribed verbatim from the user's own terminal output — this is the
 * completeness contract. Windows (Win32-OpenSSH, newer — SFTP-protocol era):
 *
 *   usage: scp [-346ABCOpqRrsTv] [-c cipher] [-D sftp_server_path] [-F ssh_config]
 *              [-i identity_file] [-J destination] [-l limit] [-o ssh_option]
 *              [-P port] [-S program] [-X sftp_option] source ... target
 *
 * Linux (older OpenSSH, legacy-protocol-only) is a strict subset:
 *
 *   usage: scp [-346BCpqrv] [-c cipher] [-F ssh_config] [-i identity_file]
 *              [-l limit] [-o ssh_option] [-P port] [-S program] source ... target
 *
 * The Windows banner is the superset and the one used below.
 */
const SINGLE_LETTER_BOOLEANS = ["-3", "-4", "-6", "-A", "-B", "-C", "-O", "-p", "-q", "-R", "-r", "-s", "-T", "-v"];

const ARG_TAKING = ["-c", "-D", "-F", "-i", "-J", "-l", "-o", "-P", "-S", "-X"];

/**
 * Handled as spec fields, not catalogue flags, because they express identity
 * (which key/port to use) rather than behavior — same reasoning as ssh's
 * -i/-p and rsync's source/destination.
 */
const SPEC_FIELD_OPTIONS = ["-i", "-P"];

/**
 * Also spec fields, not catalogue flags — repeatable options modeled as
 * plain string arrays (`sshOptions`/`sftpOptions`) so the UI can reuse the
 * existing `StringListEditor` component instead of inventing a "repeatable
 * flag" concept in the engine.
 */
const LIST_SPEC_FIELDS = ["-o", "-X"];

/**
 * -R and -s appear in the real usage banner but could not be confidently
 * verified from memory (unlike every other scp flag here) — asked the user
 * for `man scp` text to confirm; they had none to add. Left unimplemented
 * rather than guessed at, same precedent as ssh's unverified -P tag. This
 * test exists so that if their meaning is ever confirmed, someone has to
 * come here and delete this test rather than the gap staying invisible.
 */
const UNVERIFIED = ["-R", "-s"];

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

describe("scp usage-line coverage", () => {
  const tokens = allSpellings();

  it("has no duplicate order values", () => {
    const orders = CATALOGUE.flags.map((f) => f.order);
    expect(orders.filter((o, i) => orders.indexOf(o) !== i)).toEqual([]);
  });

  it("has no duplicate flag ids", () => {
    const ids = CATALOGUE.flags.map((f) => f.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it("can represent every bundled single-letter option except the unverified ones", () => {
    const missing = SINGLE_LETTER_BOOLEANS.filter((opt) => !UNVERIFIED.includes(opt) && !tokens.has(opt));
    expect(missing).toEqual([]);
  });

  it("can represent every argument-taking option (excluding identity/port/list fields, which are spec fields)", () => {
    const missing = ARG_TAKING.filter((opt) => {
      if (SPEC_FIELD_OPTIONS.includes(opt)) return false;
      if (LIST_SPEC_FIELDS.includes(opt)) return false;
      return !tokens.has(opt);
    });
    expect(missing).toEqual([]);
  });

  it("documents exactly two unverified options (-R, -s), not silently", () => {
    expect(UNVERIFIED).toEqual(["-R", "-s"]);
    expect(tokens.has("-R")).toBe(false);
    expect(tokens.has("-s")).toBe(false);
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
