import { describe, expect, it } from "vitest";
import { CATALOGUE, isAvailableOn, type FlagDef } from "@cmdgen/tar";
import { buildArgv, createSpec, renderOneLine, type TarMode, type TarSpec } from "@cmdgen/tar";

/**
 * Every option GNU tar's own `--help` lists, transcribed verbatim from the
 * output of `tar --help` (GNU tar 1.35). This is the completeness contract:
 * if an option appears here, the catalogue must be able to emit it.
 *
 * A few entries are deliberately marked as handled elsewhere than the flag
 * catalogue — the operation modes are a `mode` spec field, and -f/-C/--exclude
 * are spec fields because their position or repetition is load-bearing.
 */
const MODE_OPTIONS: Record<string, TarMode> = {
  "-A": "concatenate",
  "-c": "create",
  "-d": "diff",
  "--delete": "delete",
  "-r": "append",
  "-t": "list",
  "--test-label": "testLabel",
  "-u": "update",
  "-x": "extract",
};

/** Handled as spec fields rather than catalogue flags — see src/spec.ts for why. */
const SPEC_FIELD_OPTIONS = ["-f", "--file", "-C", "--directory", "--exclude"];

/** Informational-only; not part of building a command. */
const NOT_A_BUILDABLE_OPTION = ["-?", "--help", "--usage"];

const GNU_HELP_OPTIONS = [
  // Local file name selection
  "--add-file", "-C", "--exclude", "--exclude-backups", "--exclude-caches",
  "--exclude-caches-all", "--exclude-caches-under", "--exclude-ignore",
  "--exclude-ignore-recursive", "--exclude-tag", "--exclude-tag-all",
  "--exclude-tag-under", "--exclude-vcs", "--exclude-vcs-ignores", "--no-null",
  "--no-recursion", "--no-unquote", "--no-verbatim-files-from", "--null",
  "--recursion", "-T", "--unquote", "--verbatim-files-from", "-X",
  // File name matching
  "--anchored", "--ignore-case", "--no-anchored", "--no-ignore-case",
  "--no-wildcards", "--no-wildcards-match-slash", "--wildcards",
  "--wildcards-match-slash",
  // Main operation mode
  "-A", "-c", "-d", "--delete", "-r", "-t", "--test-label", "-u", "-x",
  // Operation modifiers
  "--check-device", "-g", "-G", "--hole-detection", "--ignore-failed-read",
  "--level", "-n", "--no-check-device", "--no-seek", "--occurrence",
  "--sparse-version", "-S",
  // Overwrite control
  "-k", "--keep-directory-symlink", "--keep-newer-files", "--no-overwrite-dir",
  "--one-top-level", "--overwrite", "--overwrite-dir", "--recursive-unlink",
  "--remove-files", "--skip-old-files", "-U", "-W",
  // Select output stream
  "--ignore-command-error", "--no-ignore-command-error", "-O", "--to-command",
  // File attributes
  "--atime-preserve", "--clamp-mtime", "--delay-directory-restore", "--group",
  "--group-map", "--mode", "--mtime", "-m", "--no-delay-directory-restore",
  "--no-same-owner", "--no-same-permissions", "--numeric-owner", "--owner",
  "--owner-map", "-p", "--same-owner", "-s", "--sort",
  // Extended file attributes
  "--acls", "--no-acls", "--no-selinux", "--no-xattrs", "--selinux", "--xattrs",
  "--xattrs-exclude", "--xattrs-include",
  // Device selection and switching
  "-f", "--force-local", "-F", "-L", "-M", "--rmt-command", "--rsh-command",
  "--volno-file",
  // Device blocking
  "-b", "-B", "-i", "--record-size",
  // Archive format selection
  "-H", "--old-archive", "--pax-option", "--posix", "-V",
  // Compression
  "-a", "-I", "-j", "-J", "--lzip", "--lzma", "--lzop", "--no-auto-compress",
  "-z", "--zstd", "-Z",
  // Local file selection
  "--backup", "-h", "--hard-dereference", "-K", "--newer-mtime", "-N",
  "--one-file-system", "-P", "--suffix",
  // File name transformations
  "--strip-components", "--transform",
  // Informative output
  "--checkpoint", "--checkpoint-action", "--full-time", "--index-file", "-l",
  "--no-quote-chars", "--quote-chars", "--quoting-style", "-R",
  "--show-defaults", "--show-omitted-dirs", "--show-snapshot-field-ranges",
  "--show-transformed-names", "--totals", "--utc", "-v", "--warning", "-w",
  // Compatibility
  "-o",
  // Other
  "--restrict", "--version",
] as const;

/**
 * Every option spelling a single flag covers — the forms it declares (short and
 * long, which are what the reference/tooltip shows) plus the tokens its enum
 * options actually render. An enum like `formatGnu` declares -H/--format but
 * renders `--format=v7`, and `seekMode` declares --seek but renders `-n`, so
 * both sides have to be considered to answer "can this option be expressed".
 */
function spellingsOf(flag: FlagDef): string[] {
  const out: string[] = [];
  if (flag.short) out.push(flag.short);
  out.push(flag.long.split("=")[0]!);

  for (const option of flag.options ?? []) {
    if (option.renders === "") continue;
    // An option may render several tokens, and may carry an =value.
    for (const part of option.renders.split(/\s+/)) out.push(part.split("=")[0]!);
  }

  return out;
}

/** Every option spelling the catalogue covers for a given variant. */
function emittableTokens(variant: "gnu" | "bsd"): Set<string> {
  const tokens = new Set<string>();
  for (const flag of CATALOGUE.flags as readonly FlagDef[]) {
    if (!isAvailableOn(flag, variant)) continue;
    for (const spelling of spellingsOf(flag)) tokens.add(spelling);
  }
  return tokens;
}

describe("GNU tar --help coverage", () => {
  const gnuTokens = emittableTokens("gnu");

  it("has no duplicate order values (flagsInArgvOrder sorts the whole catalogue)", () => {
    const orders = CATALOGUE.flags.map((f) => f.order);
    const duplicates = orders.filter((o, i) => orders.indexOf(o) !== i);
    expect(duplicates).toEqual([]);
  });

  it("has no duplicate flag ids", () => {
    const ids = CATALOGUE.flags.map((f) => f.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  it("can represent every option GNU tar's --help lists", () => {
    const missing = GNU_HELP_OPTIONS.filter((opt) => {
      if (opt in MODE_OPTIONS) return false;
      if (SPEC_FIELD_OPTIONS.includes(opt)) return false;
      if (NOT_A_BUILDABLE_OPTION.includes(opt)) return false;
      return !gnuTokens.has(opt);
    });

    expect(missing).toEqual([]);
  });

  it("always emits the mode as the very first option", () => {
    // bsdtar is explicit about this: "First option must be a mode specifier".
    // With short-flag bundling the mode letter must still lead the bundle.
    const base = { archive: "a.tar", files: ["x"], changeDir: "d" };
    const heavyFlags = {
      compressionGnu: "gzip",
      verbose: true,
      keepOldFiles: true,
      numericOwner: true,
      blockingFactor: 20,
    };

    for (const [mode, token] of Object.entries(MODE_OPTIONS).map(([t, m]) => [m, t] as const)) {
      for (const combine of [true, false]) {
        const rendered = renderOneLine(
          buildArgv({ ...createSpec({ id: "order" }), ...base, mode, flags: heavyFlags }),
          { shell: "posix", combineShortFlags: combine },
        );
        const firstOption = rendered.split(/\s+/)[1]!;

        if (token.startsWith("--")) {
          expect(firstOption, `${mode} (combine=${combine})`).toBe(token);
        } else {
          // e.g. -czvkf — must begin with the mode letter.
          expect(firstOption.startsWith(token), `${mode} (combine=${combine}) got ${firstOption}`).toBe(true);
        }
      }
    }
  });

  it("can actually emit each mode's token", () => {
    const spec = (mode: TarMode): TarSpec => ({
      ...createSpec({ id: "coverage" }),
      mode,
      archive: "a.tar",
      files: ["x"],
    });

    for (const [token, mode] of Object.entries(MODE_OPTIONS)) {
      const rendered = renderOneLine(buildArgv(spec(mode)), { shell: "posix", combineShortFlags: false });
      expect(rendered, `mode ${mode} should emit ${token}`).toContain(token);
    }
  });

  it("every catalogue flag is reachable from exactly one variant or both", () => {
    // A flag tagged with an unknown variant would be silently unreachable.
    for (const flag of CATALOGUE.flags as readonly FlagDef[]) {
      const reachable = isAvailableOn(flag, "gnu") || isAvailableOn(flag, "bsd");
      expect(reachable, `${flag.id} is unreachable from either variant`).toBe(true);
    }
  });

  it("every enum flag offers the engine's inactive sentinel as its first option", () => {
    // `isFlagActive` treats "none" as unset; an enum whose first option is
    // anything else reports as "set" the moment the form renders it.
    for (const flag of CATALOGUE.flags as readonly FlagDef[]) {
      if (flag.kind !== "enum") continue;
      expect(flag.options?.[0]?.value, `${flag.id}'s first option must be "none"`).toBe("none");
      expect(flag.options?.[0]?.renders, `${flag.id}'s "none" must render nothing`).toBe("");
    }
  });

  it("bsdtar's own documented options are represented too", () => {
    const bsdTokens = emittableTokens("bsd");
    const expected = [
      "-c", "-r", "-t", "-u", "-x", // modes are spec-level, but these letters must not appear as flags
      "-a", "-b", "-C", "-f", "-H", "-i", "-j", "-J", "-k", "-L", "-l", "-n",
      "-O", "-p", "-P", "-q", "-s", "-v", "-w", "-W", "-z", "-Z",
      "--chroot", "--clamp-mtime", "--exclude-vcs", "--fflags", "--no-fflags",
      "--format", "--gid", "--gname", "--lrzip", "--lz4", "--lzma",
      "--mac-metadata", "--newer", "--newer-than", "--no-mac-metadata",
      "--no-read-sparse", "--no-safe-writes", "--nodump", "--numeric-owner",
      "--options", "--read-sparse", "--safe-writes", "--strip-components",
      "--totals", "--uid", "--uname", "--use-compress-program", "--zstd",
      "--b64encode", "--uuencode", "--grzip",
    ];

    const missing = expected.filter((opt) => {
      if (SPEC_FIELD_OPTIONS.includes(opt)) return false;
      if (Object.keys(MODE_OPTIONS).includes(opt)) return false;
      return !bsdTokens.has(opt);
    });

    expect(missing).toEqual([]);
  });

  it("no GNU-only token leaks into a bsdtar command, and vice versa", () => {
    const bsdTokens = emittableTokens("bsd");

    // Letters the two implementations use for genuinely different things.
    // Each must be emittable by both — but from different flag ids.
    for (const letter of ["-n", "-s", "-L", "-W"]) {
      expect(gnuTokens.has(letter), `${letter} should exist for GNU tar`).toBe(true);
      expect(bsdTokens.has(letter), `${letter} should exist for bsdtar`).toBe(true);

      const gnuOwners = (CATALOGUE.flags as readonly FlagDef[])
        .filter((f) => isAvailableOn(f, "gnu") && spellingsOf(f).includes(letter))
        .map((f) => f.id);
      const bsdOwners = (CATALOGUE.flags as readonly FlagDef[])
        .filter((f) => isAvailableOn(f, "bsd") && spellingsOf(f).includes(letter))
        .map((f) => f.id);

      expect(gnuOwners.length, `${letter} should have one GNU owner`).toBeGreaterThan(0);
      expect(bsdOwners.length, `${letter} should have one bsd owner`).toBeGreaterThan(0);
      // The whole point: different ids, so a spec cannot carry one meaning into the other.
      expect(
        gnuOwners.some((id) => bsdOwners.includes(id)),
        `${letter} must not be owned by a single shared flag — the meanings differ`,
      ).toBe(false);
    }
  });
});
