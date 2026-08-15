import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { RsyncSpec } from "../spec";
import { flagBool, flagEnum, flagNumber, setFlag, setFlags } from "../pure";
import { ARCHIVE_EXPANSION, conflictingPairs, unmetRequirements } from "../catalogue/implications";
import { getFlag, flagLabel, isUnavailable, FLAGS } from "../catalogue/flags";
import { enabledFlagIds, rejectedExtraArgs } from "../argv";
import { endpointIsEmpty } from "../argv/endpoint";
import { isWithin, looksLikeWindowsPath } from "../argv/paths";

const DELETE_VALUES = ["plain", "during", "before", "after", "delay"] as const;

const deleteMode = (spec: RsyncSpec) => flagEnum(spec, "delete", DELETE_VALUES);
const isRecursing = (spec: RsyncSpec) =>
  flagBool(spec, "archive") || flagBool(spec, "recursive") || flagBool(spec, "filesFrom");
const isLocalToLocal = (spec: RsyncSpec) =>
  spec.source.kind === "local" && spec.destination.kind === "local";

// ── errors ──────────────────────────────────────────────────────────────────

const deleteWithoutRecursion: LintRule<RsyncSpec> = {
  code: "RS001",
  check(spec) {
    if (!deleteMode(spec) || isRecursing(spec)) return [];
    return [
      {
        code: "RS001",
        level: "error",
        message: "--delete does nothing without recursion.",
        detail:
          "rsync only deletes inside directories it actually descends into. With no -r or -a, nothing is recursed and nothing is deleted.",
        flagIds: ["delete", "recursive", "archive"],
        fix: { label: "Enable --archive", apply: (s) => setFlag(s, "archive", true) },
      },
    ];
  },
};

const bothEndpointsRemote: LintRule<RsyncSpec> = {
  code: "RS002",
  check(spec) {
    if (spec.source.kind === "local" || spec.destination.kind === "local") return [];
    return [
      {
        code: "RS002",
        level: "error",
        message: "rsync cannot copy directly between two remote hosts.",
        detail:
          "One side of the transfer must be local. Run the command on one of the two hosts, or stage the data through a local directory.",
        field: "destination",
      },
    ];
  },
};

const sshAndDaemonMixed: LintRule<RsyncSpec> = {
  code: "RS003",
  check(spec) {
    const kinds = [spec.source.kind, spec.destination.kind];
    if (!kinds.includes("ssh") || !kinds.includes("daemon")) return [];
    return [
      {
        code: "RS003",
        level: "error",
        message: "An SSH endpoint and an rsync:// daemon endpoint cannot be combined.",
        detail:
          "The -e ssh transport and the rsync daemon protocol are mutually exclusive. Pick one for both sides of the transfer.",
        field: "destination",
      },
    ];
  },
};

const contradictoryFlags: LintRule<RsyncSpec> = {
  code: "RS004",
  check(spec) {
    return conflictingPairs(enabledFlagIds(spec)).map((pair): Diagnostic<RsyncSpec> => {
      const [a, b] = pair;
      const defA = getFlag(a);
      const defB = getFlag(b);
      return {
        code: "RS004",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        detail: "rsync will either reject this combination or silently ignore one of the two.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

const missingPrerequisite: LintRule<RsyncSpec> = {
  code: "RS005",
  check(spec) {
    return unmetRequirements(enabledFlagIds(spec)).map(([id, need]): Diagnostic<RsyncSpec> => {
      const def = getFlag(id);
      const needDef = getFlag(need);
      return {
        code: "RS005",
        level: "error",
        message: `${def ? flagLabel(def) : id} has no effect without ${needDef ? flagLabel(needDef) : need}.`,
        flagIds: [id, need],
        fix: {
          label: `Enable ${needDef ? flagLabel(needDef) : need}`,
          apply: (s) => setFlag(s, need, needDef?.kind === "enum" ? "during" : true),
        },
      };
    });
  },
};

const emptyEndpoint: LintRule<RsyncSpec> = {
  code: "RS006",
  check(spec) {
    const out: Diagnostic<RsyncSpec>[] = [];
    if (endpointIsEmpty(spec.source)) {
      out.push({
        code: "RS006",
        level: "error",
        message: "Source is incomplete.",
        field: "source",
      });
    }
    if (endpointIsEmpty(spec.destination)) {
      out.push({
        code: "RS006",
        level: "error",
        message: "Destination is incomplete.",
        field: "destination",
      });
    }
    return out;
  },
};

const unavailableForTarget: LintRule<RsyncSpec> = {
  code: "RS007",
  check(spec) {
    return enabledFlagIds(spec)
      .map((id) => getFlag(id))
      .filter((def): def is NonNullable<typeof def> => !!def && isUnavailable(def, spec.targetProtocol))
      .map((def) => ({
        code: "RS007",
        level: "error" as const,
        message: `${flagLabel(def)} does not exist in the rsync version you are targeting.`,
        detail: `Requires protocol ${def.sinceProtocol} or newer. It has been omitted from the generated command.`,
        flagIds: [def.id],
        fix: { label: `Remove ${flagLabel(def)}`, apply: (s: RsyncSpec) => setFlag(s, def.id, undefined) },
      }));
  },
};

const disallowedExtraArg: LintRule<RsyncSpec> = {
  code: "RS008",
  check(spec) {
    return rejectedExtraArgs(spec).map((arg) => ({
      code: "RS008",
      level: "error" as const,
      message: `Passthrough argument "${arg}" is not allowed.`,
      detail:
        "Options that make rsync execute a program (-e, --rsh, --rsync-path) are blocked, as is anything that is not a well-formed option. Use the SSH and Remote sections instead.",
      field: "extraArgs" as const,
    }));
  },
};

// ── destructive ─────────────────────────────────────────────────────────────

const deleteIsDestructive: LintRule<RsyncSpec> = {
  code: "RS010",
  check(spec) {
    const mode = deleteMode(spec);
    if (!mode) return [];
    if (flagBool(spec, "dryRun")) return [];
    return [
      {
        code: "RS010",
        level: "destructive",
        message: "This command deletes files at the destination.",
        detail:
          "Anything present at the destination but missing from the source will be removed permanently. Run the dry-run variant first and read the deletion list.",
        flagIds: ["delete"],
        fix: {
          label: "Add --dry-run",
          apply: (s) => setFlags(s, { dryRun: true, itemizeChanges: true }),
        },
      },
    ];
  },
};

const deleteWithoutMaxDelete: LintRule<RsyncSpec> = {
  code: "RS011",
  check(spec) {
    if (!deleteMode(spec)) return [];
    if (flagNumber(spec, "maxDelete") !== undefined) return [];
    return [
      {
        code: "RS011",
        level: "destructive",
        message: "No --max-delete limit is set.",
        detail:
          "If the source is ever empty or unmounted when this runs, rsync will happily delete the entire destination. --max-delete aborts instead.",
        flagIds: ["delete", "maxDelete"],
        fix: { label: "Limit to 100 deletions", apply: (s) => setFlag(s, "maxDelete", 100) },
      },
    ];
  },
};

const deleteExcludedSurprise: LintRule<RsyncSpec> = {
  code: "RS012",
  check(spec) {
    if (!deleteMode(spec) || !flagBool(spec, "deleteExcluded")) return [];
    const hasExcludes = spec.filters.some((f) => f.enabled && f.kind === "exclude");
    if (!hasExcludes) return [];
    return [
      {
        code: "RS012",
        level: "destructive",
        message: "--delete-excluded will delete the files your exclude rules protect.",
        detail:
          "Without this flag, excluded files already at the destination are left alone. With it, they are deleted. This is the opposite of what most people expect from an exclude list.",
        flagIds: ["deleteExcluded"],
        fix: {
          label: "Remove --delete-excluded",
          apply: (s) => setFlag(s, "deleteExcluded", undefined),
        },
      },
    ];
  },
};

const nestedEndpoints: LintRule<RsyncSpec> = {
  code: "RS013",
  check(spec) {
    if (!isLocalToLocal(spec)) return [];
    const src = spec.source.kind === "local" ? spec.source.path : "";
    const dst = spec.destination.kind === "local" ? spec.destination.path : "";
    if (src.trim() === "" || dst.trim() === "") return [];

    if (isWithin(src, dst, spec.pathFlavor)) {
      return [
        {
          code: "RS013",
          level: "destructive",
          message: "The destination is inside the source.",
          detail:
            "rsync will copy the destination into itself, growing without bound until the disk fills. Move the destination outside the source tree, or exclude it explicitly.",
          field: "destination",
        },
      ];
    }
    if (isWithin(dst, src, spec.pathFlavor)) {
      return [
        {
          code: "RS013",
          level: "destructive",
          message: "The source is inside the destination.",
          detail:
            "Combined with --delete this can delete the source itself. Verify this is really what you intend.",
          field: "source",
        },
      ];
    }
    return [];
  },
};

const inplaceRisk: LintRule<RsyncSpec> = {
  code: "RS014",
  check(spec) {
    if (!flagBool(spec, "inplace")) return [];
    return [
      {
        code: "RS014",
        level: "destructive",
        message: "--inplace leaves a corrupt file if the transfer is interrupted.",
        detail:
          "Data is written directly into the destination file rather than to a temporary copy, so the destination is inconsistent for the duration of the transfer and unrecoverable if it fails partway.",
        flagIds: ["inplace"],
      },
    ];
  },
};

const appendWithoutVerify: LintRule<RsyncSpec> = {
  code: "RS015",
  check(spec) {
    if (flagEnum(spec, "append", ["append", "verify"]) !== "append") return [];
    return [
      {
        code: "RS015",
        level: "destructive",
        message: "--append does not verify the data already at the destination.",
        detail:
          "It assumes existing bytes are a correct prefix of the source. If they are not, the result is a silently corrupt file. --append-verify checksums the existing portion first.",
        flagIds: ["append"],
        fix: { label: "Use --append-verify", apply: (s) => setFlag(s, "append", "verify") },
      },
    ];
  },
};

// ── warnings ────────────────────────────────────────────────────────────────

const redundantWithArchive: LintRule<RsyncSpec> = {
  code: "RS020",
  check(spec) {
    if (!flagBool(spec, "archive")) return [];
    const redundant = ARCHIVE_EXPANSION.filter((id) => flagBool(spec, id));
    if (redundant.length === 0) return [];
    const labels = redundant.map((id) => {
      const def = getFlag(id);
      return def ? flagLabel(def) : id;
    });
    return [
      {
        code: "RS020",
        level: "warning",
        message: `--archive already includes ${labels.join(", ")}.`,
        detail: "-a expands to -rlptgoD, so these add nothing but noise to the command.",
        flagIds: [...redundant],
        fix: {
          label: "Remove redundant flags",
          apply: (s) => setFlags(s, Object.fromEntries(redundant.map((id) => [id, undefined]))),
        },
      },
    ];
  },
};

const compressLocally: LintRule<RsyncSpec> = {
  code: "RS021",
  check(spec) {
    if (!isLocalToLocal(spec) || !flagBool(spec, "compress")) return [];
    return [
      {
        code: "RS021",
        level: "warning",
        message: "-z wastes CPU on a local-to-local copy.",
        detail:
          "Compression only helps when the bottleneck is a network link. Copying between local paths, it burns CPU for no benefit.",
        flagIds: ["compress"],
        fix: { label: "Remove -z", apply: (s) => setFlag(s, "compress", undefined) },
      },
    ];
  },
};

const bwlimitLocally: LintRule<RsyncSpec> = {
  code: "RS022",
  check(spec) {
    if (!isLocalToLocal(spec) || spec.flags.bwlimit === undefined) return [];
    return [
      {
        code: "RS022",
        level: "warning",
        message: "--bwlimit throttles a local copy.",
        detail:
          "This still works — it limits disk I/O — but if the intent was to spare a network link, it is doing nothing useful here.",
        flagIds: ["bwlimit"],
      },
    ];
  },
};

const filesFromWithRecursive: LintRule<RsyncSpec> = {
  code: "RS023",
  check(spec) {
    if (!spec.flags.filesFrom || !flagBool(spec, "recursive")) return [];
    return [
      {
        code: "RS023",
        level: "warning",
        message: "-r changes the meaning of --files-from.",
        detail:
          "--files-from turns recursion off so the list is taken literally. Adding -r back makes rsync descend into any directory named in the list, which is usually not what the list was for.",
        flagIds: ["filesFrom", "recursive"],
        fix: { label: "Remove -r", apply: (s) => setFlag(s, "recursive", undefined) },
      },
    ];
  },
};

const filterOrderShadowed: LintRule<RsyncSpec> = {
  code: "RS024",
  check(spec) {
    const active = spec.filters.filter((f) => f.enabled && f.pattern.trim() !== "");
    const out: Diagnostic<RsyncSpec>[] = [];

    for (let i = 0; i < active.length; i++) {
      const earlier = active[i]!;
      if (earlier.kind !== "exclude") continue;
      // A broad earlier exclude makes any later include unreachable.
      if (!/^\*{1,2}$|^\*\/?$|^\*\*\/?\*?$/.test(earlier.pattern.trim())) continue;
      const laterInclude = active.slice(i + 1).find((f) => f.kind === "include");
      if (!laterInclude) continue;
      out.push({
        code: "RS024",
        level: "warning",
        message: `Exclude "${earlier.pattern}" makes the later include "${laterInclude.pattern}" unreachable.`,
        detail:
          "rsync stops at the first matching rule. To include a subset of an excluded tree, the include rules must come first.",
        field: "filters",
      });
    }
    return out;
  },
};

const privilegedAttributes: LintRule<RsyncSpec> = {
  code: "RS025",
  check(spec) {
    const needsRoot = (["owner", "devices", "acls", "xattrs"] as const).filter((id) =>
      flagBool(spec, id),
    );
    if (needsRoot.length === 0) return [];
    if (typeof spec.flags.rsyncPath === "string" && spec.flags.rsyncPath.includes("sudo")) return [];
    const labels = needsRoot.map((id) => {
      const def = getFlag(id);
      return def ? flagLabel(def) : id;
    });
    return [
      {
        code: "RS025",
        level: "warning",
        message: `${labels.join(", ")} usually require superuser privileges.`,
        detail:
          "Run the command with sudo, or set --rsync-path=\"sudo rsync\" for the remote side. Without privileges rsync silently preserves less than you asked for.",
        flagIds: [...needsRoot],
      },
    ];
  },
};

const noTimesPreserved: LintRule<RsyncSpec> = {
  code: "RS026",
  check(spec) {
    if (flagBool(spec, "archive") || flagBool(spec, "times")) return [];
    if (flagBool(spec, "checksum") || flagBool(spec, "sizeOnly")) return [];
    return [
      {
        code: "RS026",
        level: "warning",
        message: "Without -t, every future run re-transfers everything.",
        detail:
          "rsync's quick check compares size and modification time. If mtimes are not preserved, nothing ever looks up to date.",
        flagIds: ["times"],
        fix: { label: "Enable -t", apply: (s) => setFlag(s, "times", true) },
      },
    ];
  },
};

const windowsPathWithUnixFlavor: LintRule<RsyncSpec> = {
  code: "RS027",
  check(spec) {
    if (spec.pathFlavor !== "unix") return [];
    const paths = [
      spec.source.kind === "local" ? spec.source.path : "",
      spec.destination.kind === "local" ? spec.destination.path : "",
    ].filter((p) => looksLikeWindowsPath(p));
    if (paths.length === 0) return [];
    return [
      {
        code: "RS027",
        level: "warning",
        message: "A Windows path is being emitted verbatim.",
        detail:
          "rsync does not understand C:\\ style paths. Choose the path flavour matching the rsync build that will run this — cwRsync, MSYS2 or WSL — and the drive letter will be translated.",
        field: "source",
      },
    ];
  },
};

const partialWithoutDir: LintRule<RsyncSpec> = {
  code: "RS028",
  check(spec) {
    if (!flagBool(spec, "partial") || spec.flags.partialDir !== undefined) return [];
    if (flagBool(spec, "inplace")) return [];
    return [
      {
        code: "RS028",
        level: "warning",
        message: "--partial leaves half-written files at their final paths.",
        detail:
          "Anything reading the destination can pick up a truncated file and treat it as complete. --partial-dir keeps fragments out of the way.",
        flagIds: ["partial", "partialDir"],
        fix: {
          label: "Add --partial-dir",
          apply: (s) => setFlag(s, "partialDir", ".rsync-partial"),
        },
      },
    ];
  },
};

// ── info ────────────────────────────────────────────────────────────────────

const trailingSlashSemantics: LintRule<RsyncSpec> = {
  code: "RS030",
  check(spec) {
    if (spec.contentsOnly) return [];
    return [
      {
        code: "RS030",
        level: "info",
        message: "The source directory itself will be nested inside the destination.",
        detail:
          "Because the source has no trailing slash, rsync creates a subdirectory named after it at the destination rather than copying its contents directly.",
        field: "contentsOnly",
      },
    ];
  },
};

const noDryRunOnMutation: LintRule<RsyncSpec> = {
  code: "RS031",
  check(spec) {
    if (flagBool(spec, "dryRun")) return [];
    if (deleteMode(spec)) return []; // RS010 already covers the dangerous case.
    return [
      {
        code: "RS031",
        level: "info",
        message: "This command writes to the destination.",
        detail: "Use the dry-run variant to preview the exact file list before running it.",
        fix: {
          label: "Add --dry-run",
          apply: (s) => setFlags(s, { dryRun: true, itemizeChanges: true }),
        },
      },
    ];
  },
};

const checksumIsSlow: LintRule<RsyncSpec> = {
  code: "RS032",
  check(spec) {
    if (!flagBool(spec, "checksum")) return [];
    return [
      {
        code: "RS032",
        level: "info",
        message: "-c reads every byte on both sides before transferring anything.",
        detail:
          "This is the right choice for verifying an earlier copy, but it makes routine syncs dramatically slower. On rsync 3.2+, --checksum-choice=xxh64 is much faster than the default.",
        flagIds: ["checksum"],
      },
    ];
  },
};

export const RULES: readonly LintRule<RsyncSpec>[] = [
  // errors
  deleteWithoutRecursion,
  bothEndpointsRemote,
  sshAndDaemonMixed,
  contradictoryFlags,
  missingPrerequisite,
  emptyEndpoint,
  unavailableForTarget,
  disallowedExtraArg,
  // destructive
  deleteIsDestructive,
  deleteWithoutMaxDelete,
  deleteExcludedSurprise,
  nestedEndpoints,
  inplaceRisk,
  appendWithoutVerify,
  // warnings
  redundantWithArchive,
  compressLocally,
  bwlimitLocally,
  filesFromWithRecursive,
  filterOrderShadowed,
  privilegedAttributes,
  noTimesPreserved,
  windowsPathWithUnixFlavor,
  partialWithoutDir,
  // info
  trailingSlashSemantics,
  noDryRunOnMutation,
  checksumIsSlow,
];

/** Every code the catalogue can emit, for the reference page and tests. */
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);

/** Guard against a rule silently pointing at a flag id that no longer exists. */
export function validateRuleFlagIds(): string[] {
  const known = new Set(FLAGS.map((f) => f.id));
  const problems: string[] = [];
  for (const id of ["delete", "maxDelete", "deleteExcluded", "partialDir", "append"]) {
    if (!known.has(id)) problems.push(`lint rules reference missing flag id: ${id}`);
  }
  return problems;
}
