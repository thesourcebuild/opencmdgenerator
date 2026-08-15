import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel, isAvailableOn, unmetRequirements } from "@cmdgen/engine";
import type { TarMode, TarSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { droppedFlagIds } from "../argv";
import { BSD_UNSUPPORTED_MODES, compressionOf, flagBool, flagNumber, flagString, setFlag, setFlags } from "../pure";

const isBsd = (spec: TarSpec) => spec.variant === "bsd";

/** Modes that read an existing archive rather than writing a new one. */
const READ_MODES: ReadonlySet<TarMode> = new Set(["extract", "list", "diff", "testLabel"]);
/** Modes that need at least one input path to be meaningful. */
const NEEDS_INPUTS: ReadonlySet<TarMode> = new Set(["create", "append", "update"]);
/** Modes that rewrite an archive in place, which no compression filter supports. */
const IN_PLACE_MODES: ReadonlySet<TarMode> = new Set(["append", "update", "delete", "concatenate"]);

const MODE_LABEL: Record<TarMode, string> = {
  create: "create",
  extract: "extract",
  list: "list",
  append: "append to",
  update: "update",
  diff: "compare",
  delete: "delete from",
  concatenate: "concatenate",
  testLabel: "test the label of",
};

const COMPRESSION_SUFFIX: Record<string, readonly string[]> = {
  gzip: [".gz", ".tgz"],
  bzip2: [".bz2", ".tbz", ".tbz2"],
  xz: [".xz", ".txz"],
  zstd: [".zst", ".tzst"],
  lzma: [".lzma"],
  lzip: [".lz"],
  lzop: [".lzo"],
  lz4: [".lz4"],
  lrzip: [".lrz"],
  compress: [".z"],
};

function validFiles(spec: TarSpec): string[] {
  return spec.files.map((f) => f.trim()).filter((f) => f !== "");
}

/** Every distinct way this spec asks for compression. More than one is a contradiction. */
function compressionMethods(spec: TarSpec): string[] {
  const methods: string[] = [];
  const chosen = compressionOf(spec);
  if (chosen) methods.push(`the ${chosen} option`);
  if (flagBool(spec, "autoCompress")) methods.push("-a");
  if (flagString(spec, isBsd(spec) ? "useCompressProgramBsd" : "useCompressProgram")) {
    methods.push(isBsd(spec) ? "--use-compress-program" : "-I");
  }
  return methods;
}

const noInputs: LintRule<TarSpec> = {
  code: "TAR001",
  check(spec) {
    if (!NEEDS_INPUTS.has(spec.mode) || validFiles(spec).length > 0) return [];
    // -T reads the file list from elsewhere, so an empty list is fine then.
    if (flagString(spec, "filesFrom")) return [];
    return [
      {
        code: "TAR001",
        level: "error",
        message: `Nothing to ${MODE_LABEL[spec.mode]} — no input files listed.`,
        detail:
          "Add at least one file or directory, or read the list from a file with -T. As written, tar would create an empty archive.",
        field: "files",
      },
    ];
  },
};

const noArchive: LintRule<TarSpec> = {
  code: "TAR002",
  check(spec) {
    if (spec.archive.trim() !== "") return [];
    const reading = READ_MODES.has(spec.mode);

    // The two implementations have genuinely different defaults for a missing
    // -f, and saying the wrong one is worse than saying nothing. GNU tar
    // reports `-f-` in its own --show-defaults, i.e. stdin/stdout. bsdtar
    // defaults to a TAPE DEVICE — its help states "default \\.\tape0" on
    // Windows — so omitting -f there is almost always a mistake rather than a
    // deliberate pipe.
    if (isBsd(spec)) {
      return [
        {
          code: "TAR002",
          level: "warning",
          message: "No archive file set, so bsdtar falls back to a tape device.",
          detail:
            "bsdtar's default is the tape drive \\\\.\\tape0 on Windows (/dev/tape-ish elsewhere), not standard input/output — so without -f this fails on any machine that has no tape drive. Name an archive, or use - explicitly to mean stdin/stdout.",
          field: "archive",
        },
      ];
    }

    return [
      {
        code: "TAR002",
        level: "warning",
        message: `No archive file set, so GNU tar uses standard ${reading ? "input" : "output"}.`,
        detail: reading
          ? "GNU tar's compiled-in default is -f- , so it reads the archive from stdin — fine when piping one in, but it will simply hang if you run this at a prompt."
          : "GNU tar's compiled-in default is -f- , so it writes the archive to stdout. Valid when piping, but at a prompt it dumps binary data into your terminal.",
        field: "archive",
      },
    ];
  },
};

const removeFilesRisk: LintRule<TarSpec> = {
  code: "TAR003",
  check(spec) {
    if (!flagBool(spec, "removeFiles")) return [];
    return [
      {
        code: "TAR003",
        level: "destructive",
        message: "--remove-files deletes each original from disk after archiving it.",
        detail:
          "If the archive is corrupt, truncated, or written somewhere you did not intend, the source files are already gone. Verify the archive separately before trusting this.",
        flagIds: ["removeFiles"],
        fix: { label: "Remove --remove-files", apply: (s) => setFlag(s, "removeFiles", undefined) },
      },
    ];
  },
};

const absolutePathsOnExtract: LintRule<TarSpec> = {
  code: "TAR004",
  check(spec) {
    if (!flagBool(spec, "absoluteNames")) return [];

    if (READ_MODES.has(spec.mode)) {
      return [
        {
          code: "TAR004",
          level: "destructive",
          message: "-P lets this archive write outside the directory you run it in.",
          detail:
            "tar strips leading slashes precisely so extraction cannot escape the current directory. With -P, a member named /etc/passwd is written to /etc/passwd, and one named ../../x escapes upward. Only use this on an archive you produced yourself.",
          flagIds: ["absoluteNames"],
          fix: { label: "Remove -P", apply: (s) => setFlag(s, "absoluteNames", undefined) },
        },
      ];
    }

    return [
      {
        code: "TAR004",
        level: "warning",
        message: "-P stores absolute paths in the archive.",
        detail:
          "The archive becomes tied to these exact locations, and anyone extracting it with -P writes straight to them. Prefer -C to change directory and store relative names instead.",
        flagIds: ["absoluteNames"],
      },
    ];
  },
};

const tarBombRisk: LintRule<TarSpec> = {
  code: "TAR005",
  check(spec) {
    if (spec.mode !== "extract") return [];
    // Either guard is enough: a fresh -C directory, or GNU's --one-top-level.
    if (spec.changeDir.trim() !== "" || flagBool(spec, "oneTopLevel")) return [];

    const base: Omit<Diagnostic<TarSpec>, "fix"> = {
      code: "TAR005",
      level: "warning",
      message: "Nothing constrains where these files land.",
      detail:
        "Archives are not required to contain a single top-level directory. One that does not — a \"tar bomb\" — scatters its members across your current directory, mixed in with whatever is already there and awkward to undo. List the archive first, or extract into a directory of your own.",
      field: "changeDir",
    };

    if (isBsd(spec)) {
      // bsdtar has no --one-top-level, so the only honest advice is -C.
      return [{ ...base, detail: `${base.detail} bsdtar has no --one-top-level, so set "Change to directory" to a new, empty directory.` }];
    }

    return [
      {
        ...base,
        flagIds: ["oneTopLevel"],
        fix: { label: "Add --one-top-level", apply: (s) => setFlag(s, "oneTopLevel", true) },
      },
    ];
  },
};

const multipleCompressionMethods: LintRule<TarSpec> = {
  code: "TAR006",
  check(spec) {
    const methods = compressionMethods(spec);
    if (methods.length < 2) return [];
    return [
      {
        code: "TAR006",
        level: "error",
        message: `More than one compression method selected: ${methods.join(", ")}.`,
        detail:
          "tar applies a single compression filter. Passing several is either rejected or silently resolved to whichever came last — pick one.",
        flagIds: ["compression", "autoCompress", "useCompressProgram"],
      },
    ];
  },
};

const compressionSuffixMismatch: LintRule<TarSpec> = {
  code: "TAR007",
  check(spec) {
    const chosen = compressionOf(spec);
    const archive = spec.archive.trim().toLowerCase();
    if (!chosen || archive === "" || archive === "-") return [];

    const expected = COMPRESSION_SUFFIX[chosen] ?? [];
    if (expected.length === 0 || expected.some((s) => archive.endsWith(s))) return [];

    // Only complain when the name carries some *other* compression suffix, or
    // none at all — not for unusual-but-deliberate names.
    const otherSuffixes = Object.entries(COMPRESSION_SUFFIX)
      .filter(([method]) => method !== chosen)
      .flatMap(([, suffixes]) => suffixes);
    const looksLikePlainTar = archive.endsWith(".tar");
    const carriesWrongSuffix = otherSuffixes.some((s) => archive.endsWith(s));
    if (!looksLikePlainTar && !carriesWrongSuffix) return [];

    return [
      {
        code: "TAR007",
        level: "warning",
        message: `The archive name does not match ${chosen} compression (expected ${expected.join(" or ")}).`,
        detail:
          "tar will happily write gzip data to a file called .tar.xz — the name is not checked. Whoever picks the archive up later, including you, will be misled by it.",
        field: "archive",
      },
    ];
  },
};

const flagsDroppedForVariant: LintRule<TarSpec> = {
  code: "TAR008",
  check(spec) {
    const dropped = droppedFlagIds(spec);
    if (dropped.length === 0) return [];

    const labels = dropped.map((id) => {
      const def = CATALOGUE.getFlag(id);
      return def ? flagLabel(def) : id;
    });
    const other = isBsd(spec) ? "GNU tar" : "bsdtar";
    const current = isBsd(spec) ? "bsdtar" : "GNU tar";

    return [
      {
        code: "TAR008",
        level: "warning",
        message: `${labels.join(", ")} ${labels.length === 1 ? "does" : "do"} not exist in ${current} and ${labels.length === 1 ? "was" : "were"} left out.`,
        detail: `${labels.length === 1 ? "This option is" : "These options are"} ${other}-only, so ${labels.length === 1 ? "it is" : "they are"} silently omitted from the command above rather than producing something ${current} would reject. Switch implementation, or clear ${labels.length === 1 ? "it" : "them"} to make the command reflect what you actually asked for.`,
        flagIds: dropped,
        fix: {
          label: `Clear ${labels.length === 1 ? "it" : "them"}`,
          apply: (s) => setFlags(s, Object.fromEntries(dropped.map((id) => [id, undefined]))),
        },
      },
    ];
  },
};

const contradictoryFlags: LintRule<TarSpec> = {
  code: "TAR009",
  check(spec) {
    const active = CATALOGUE.flagsInArgvOrder()
      .filter((f) => isAvailableOn(f, spec.variant))
      .filter((f) => {
        const v = spec.flags[f.id];
        if (v === undefined) return false;
        if (f.kind === "boolean") return v === true;
        if (f.kind === "enum") return typeof v === "string" && v !== "" && v !== "none";
        return true;
      })
      .map((f) => f.id);

    return conflictingPairs(CATALOGUE, active).map(([a, b]): Diagnostic<TarSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "TAR009",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

const missingPrerequisite: LintRule<TarSpec> = {
  code: "TAR010",
  check(spec) {
    const active = CATALOGUE.flagsInArgvOrder()
      .filter((f) => isAvailableOn(f, spec.variant))
      .filter((f) => {
        const v = spec.flags[f.id];
        if (v === undefined) return false;
        if (f.kind === "boolean") return v === true;
        if (f.kind === "enum") return typeof v === "string" && v !== "" && v !== "none";
        return true;
      })
      .map((f) => f.id);

    return unmetRequirements(CATALOGUE, active).map(([id, need]): Diagnostic<TarSpec> => {
      const def = CATALOGUE.getFlag(id);
      const needDef = CATALOGUE.getFlag(need);
      return {
        code: "TAR010",
        level: "warning",
        message: `${def ? flagLabel(def) : id} has no effect without ${needDef ? flagLabel(needDef) : need}.`,
        flagIds: [id, need],
        fix: {
          label: `Enable ${needDef ? flagLabel(needDef) : need}`,
          apply: (s) => setFlag(s, need, needDef?.kind === "boolean" ? true : s.flags[need]),
        },
      };
    });
  },
};

const modeUnsupportedByVariant: LintRule<TarSpec> = {
  code: "TAR011",
  check(spec) {
    if (!isBsd(spec) || !BSD_UNSUPPORTED_MODES.includes(spec.mode)) return [];
    // Concatenate has a native bsdtar route, so it gets its own rule below.
    if (spec.mode === "concatenate") return [];

    const TOKEN: Partial<Record<TarMode, string>> = {
      diff: "-d / --compare",
      delete: "--delete",
      testLabel: "--test-label",
    };

    return [
      {
        code: "TAR011",
        level: "error",
        message: `bsdtar has no ${TOKEN[spec.mode] ?? spec.mode} — it cannot ${MODE_LABEL[spec.mode]} an archive.`,
        detail:
          "A genuine capability gap, not a spelling difference: bsdtar's own usage message offers only -c, -r, -t, -u and -x. Rebuild the archive instead, or run this where GNU tar is available.",
        field: "mode",
        fix: { label: "Switch to GNU tar", apply: (s) => ({ ...s, variant: "gnu" }) },
      },
    ];
  },
};

/**
 * bsdtar has no -A mode, but it is NOT incapable of concatenating: its create
 * mode accepts `@archive` operands, documented as "Add entries from <archive>
 * to output". So the right advice is a rewrite, not "go find GNU tar".
 *
 * The transformation is exact rather than a guess: in concatenate mode every
 * operand already *is* an archive, so prefixing each with @ and switching to
 * create mode produces the equivalent command.
 */
const concatenateOnBsd: LintRule<TarSpec> = {
  code: "TAR016",
  check(spec) {
    if (!isBsd(spec) || spec.mode !== "concatenate") return [];
    return [
      {
        code: "TAR016",
        level: "error",
        message: "bsdtar has no -A, but it can still merge archives via @archive.",
        detail:
          "In create mode bsdtar treats an operand written @other.tar as \"copy every entry from other.tar into the output\". So `tar -A -f dest.tar a.tar` becomes `tar -c -f dest.tar @a.tar`.",
        field: "mode",
        fix: {
          label: "Rewrite as create with @archive",
          apply: (s) => ({
            ...s,
            mode: "create",
            files: s.files.map((f) => {
              const trimmed = f.trim();
              return trimmed === "" || trimmed.startsWith("@") ? f : `@${trimmed}`;
            }),
          }),
        },
      },
    ];
  },
};

const inPlaceOnCompressedArchive: LintRule<TarSpec> = {
  code: "TAR012",
  check(spec) {
    if (!IN_PLACE_MODES.has(spec.mode)) return [];

    const chosen = compressionOf(spec);
    const archive = spec.archive.trim().toLowerCase();
    const compressedByName = Object.values(COMPRESSION_SUFFIX)
      .flat()
      .some((s) => archive.endsWith(s));
    if (!chosen && !compressedByName) return [];

    return [
      {
        code: "TAR012",
        level: "error",
        message: `tar cannot ${MODE_LABEL[spec.mode]} a compressed archive.`,
        detail:
          "Appending, updating, deleting and concatenating all rewrite the archive in place, which a compression stream does not support. Decompress it first, run the operation on the plain .tar, then recompress.",
        field: "mode",
      },
    ];
  },
};

const stripComponentsOutsideExtract: LintRule<TarSpec> = {
  code: "TAR013",
  check(spec) {
    if (flagNumber(spec, "stripComponents") === undefined) return [];
    if (READ_MODES.has(spec.mode)) return [];
    return [
      {
        code: "TAR013",
        level: "warning",
        message: "--strip-components only applies when reading an archive.",
        detail: "It rewrites member names on the way out, so it does nothing while creating one. Use --transform to rename on create.",
        flagIds: ["stripComponents"],
        fix: { label: "Remove --strip-components", apply: (s) => setFlag(s, "stripComponents", undefined) },
      },
    ];
  },
};

const verboseWithToStdout: LintRule<TarSpec> = {
  code: "TAR014",
  check(spec) {
    if (!flagBool(spec, "toStdout") || !flagBool(spec, "verbose")) return [];
    return [
      {
        code: "TAR014",
        level: "warning",
        message: "-v and -O both write to stdout, so the listing is mixed into the file data.",
        detail:
          "Anything consuming this stream receives the progress lines as content. Drop -v, or on GNU tar send the listing elsewhere with --index-file.",
        flagIds: ["verbose", "toStdout"],
        fix: { label: "Remove -v", apply: (s) => setFlag(s, "verbose", undefined) },
      },
    ];
  },
};

const windowsPathNeedsForceLocal: LintRule<TarSpec> = {
  code: "TAR015",
  check(spec) {
    if (isBsd(spec) || flagBool(spec, "forceLocal")) return [];
    // GNU tar reads `host:/path` as a remote tape drive, and a drive letter
    // looks exactly like that.
    if (!/^[A-Za-z]:[\\/]/.test(spec.archive.trim())) return [];
    return [
      {
        code: "TAR015",
        level: "warning",
        message: "GNU tar reads a drive-letter path as a remote host.",
        detail:
          "Anything before a colon is treated as a hostname, so C:\\backup.tar is parsed as host \"C\". --force-local disables that interpretation. (bsdtar does not do this, so on Windows' built-in tar the path works as written.)",
        field: "archive",
        fix: { label: "Add --force-local", apply: (s) => setFlag(s, "forceLocal", true) },
      },
    ];
  },
};

export const RULES: readonly LintRule<TarSpec>[] = [
  noInputs,
  noArchive,
  removeFilesRisk,
  absolutePathsOnExtract,
  tarBombRisk,
  multipleCompressionMethods,
  compressionSuffixMismatch,
  flagsDroppedForVariant,
  contradictoryFlags,
  missingPrerequisite,
  modeUnsupportedByVariant,
  concatenateOnBsd,
  inPlaceOnCompressedArchive,
  stripComponentsOutsideExtract,
  verboseWithToStdout,
  windowsPathNeedsForceLocal,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
