import { describe, expect, it } from "vitest";
import { CATALOGUE, type FlagDef } from "@cmdgen/chmod";

/**
 * Transcribed verbatim from the user's own pasted sources — this is the
 * completeness contract.
 *
 * GNU coreutils manual (info page), full option list:
 *   -c, --changes           -f, --silent, --quiet    --preserve-root
 *   --no-preserve-root      -v, --verbose            --reference=ref_file
 *   -R, --recursive         -H                       -L
 *   -P                      --dereference            -h, --no-dereference
 *
 * The user's own machine (`chmod --help`, GNU coreutils):
 *   -c, --changes          -f, --silent, --quiet  -v, --verbose
 *   --no-preserve-root     --preserve-root        --reference=RFILE
 *   -R, --recursive        --help                 --version
 *
 * Synopsis (both sources agree): chmod [OPTION]... MODE[,MODE]... FILE...
 *                              or  chmod [OPTION]... OCTAL-MODE FILE...
 *                              or  chmod [OPTION]... --reference=RFILE FILE...
 */
const SINGLE_LETTER_BOOLEANS = ["-c", "-f", "-v", "-R", "-H", "-L", "-P", "-h"];

const ARG_TAKING = ["--reference"];

/**
 * `--help`/`--version` exit immediately and print static text — not part of
 * "building a real invocation", matching every other command in this repo
 * (none of them model --help/--version either).
 *
 * `--no-preserve-root`'s own documented purpose is "cancel a *preceding*
 * --preserve-root" — a single generated invocation has no preceding flag to
 * cancel, so modeling it would always be a no-op duplicate of simply omitting
 * --preserve-root. Same reasoning that excluded ssh's `-l` this session.
 */
const INTENTIONALLY_NOT_MODELED = ["--help", "--version", "--no-preserve-root"];

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

describe("chmod usage coverage", () => {
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

  it("can represent every argument-taking option", () => {
    const missing = ARG_TAKING.filter((opt) => !tokens.has(opt));
    expect(missing).toEqual([]);
  });

  it("documents exactly the 3 intentionally-unmodeled options, not silently", () => {
    expect(INTENTIONALLY_NOT_MODELED).toEqual(["--help", "--version", "--no-preserve-root"]);
    for (const opt of INTENTIONALLY_NOT_MODELED) expect(tokens.has(opt)).toBe(false);
  });

  it("every enum flag offers the engine's inactive sentinel as its first option", () => {
    for (const flag of CATALOGUE.flags as readonly FlagDef[]) {
      if (flag.kind !== "enum") continue;
      expect(flag.options?.[0]?.value, `${flag.id}'s first option must be "none"`).toBe("none");
      expect(flag.options?.[0]?.renders, `${flag.id}'s "none" must render nothing`).toBe("");
    }
  });

  it("-H, -L and -P are one enum, not three independent booleans", () => {
    const traversal = CATALOGUE.getFlag("traversalMode")!;
    expect(traversal.kind).toBe("enum");
    expect(traversal.options?.map((o) => o.value)).toEqual(["none", "H", "L", "P"]);
  });
});
