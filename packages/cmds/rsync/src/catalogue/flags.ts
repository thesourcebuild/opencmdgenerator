import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  isUnavailable as isUnavailableGeneric,
  type DangerLevel,
  type FlagArgSpec,
  type FlagDef as FlagDefGeneric,
  type FlagEnumOption,
  type FlagKind,
} from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  // ── core ──────────────────────────────────────────────────────────────────
  {
    id: "archive",
    short: "-a",
    long: "--archive",
    group: "core",
    kind: "boolean",
    preferShort: true,
    summary: "Archive mode — the usual starting point.",
    detail:
      "Equivalent to -rlptgoD: recurse, copy symlinks as symlinks, and preserve permissions, modification times, group, owner and device/special files. It does NOT include -H, -A or -X.",
    implies: ["recursive", "links", "perms", "times", "group", "owner", "devices"],
    order: 100,
  },
  {
    id: "recursive",
    short: "-r",
    long: "--recursive",
    group: "core",
    kind: "boolean",
    preferShort: true,
    summary: "Descend into directories.",
    detail:
      "Without recursion rsync copies only the files named on the command line and skips directories entirely. Already included in --archive.",
    order: 110,
  },
  {
    id: "update",
    short: "-u",
    long: "--update",
    group: "core",
    kind: "boolean",
    preferShort: true,
    summary: "Skip files newer on the destination.",
    detail:
      "Protects destination files whose modification time is newer than the source. Useful when the destination is also being edited, but it makes the transfer non-authoritative.",
    order: 120,
  },
  {
    id: "compress",
    short: "-z",
    long: "--compress",
    group: "core",
    kind: "boolean",
    preferShort: true,
    summary: "Compress file data during transfer.",
    detail:
      "Trades CPU for bandwidth. Worthwhile over slow links with compressible data; pure overhead on a local copy or with already-compressed media.",
    order: 130,
  },
  {
    id: "compressLevel",
    long: "--compress-level",
    group: "core",
    kind: "number",
    arg: { placeholder: "6", min: 0, max: 9 },
    requires: ["compress"],
    summary: "Compression level 0–9.",
    detail: "0 disables compression for the transfer while leaving -z negotiated. 1 is fastest, 9 smallest.",
    order: 140,
  },
  {
    id: "wholeFile",
    short: "-W",
    long: "--whole-file",
    group: "core",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["noWholeFile"],
    summary: "Copy whole files, skip the delta algorithm.",
    detail:
      "Faster when source and destination are on the same fast storage, because computing block checksums costs more than rewriting the file. This is already the default for local-to-local transfers.",
    order: 150,
  },
  {
    id: "noWholeFile",
    long: "--no-whole-file",
    group: "core",
    kind: "boolean",
    conflictsWith: ["wholeFile"],
    summary: "Force the delta algorithm.",
    detail:
      "Forces incremental block transfer even for local copies. Useful when the destination is a slow or network-mounted filesystem and reading is cheaper than writing.",
    order: 160,
  },
  {
    id: "relative",
    short: "-R",
    long: "--relative",
    group: "core",
    kind: "boolean",
    preferShort: true,
    summary: "Recreate the full source path at the destination.",
    detail:
      "Sends the complete path of each source argument rather than just its basename, so `rsync -R /a/b/c dest` creates `dest/a/b/c`. A `/./` in the source path marks where the relative portion begins.",
    order: 170,
  },
  {
    id: "mkpath",
    long: "--mkpath",
    group: "core",
    kind: "boolean",
    sinceProtocol: 31,
    summary: "Create missing destination path components.",
    detail:
      "Creates the destination directory hierarchy if it does not exist. Requires rsync 3.2.3 or newer; older builds fail with an unknown-option error.",
    order: 180,
  },
  {
    id: "dirs",
    short: "-d",
    long: "--dirs",
    group: "core",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["recursive"],
    summary: "Transfer directories without recursing.",
    detail:
      "Creates the directory entries themselves but not their contents. Mostly useful with --files-from.",
    order: 190,
  },

  // ── attributes ────────────────────────────────────────────────────────────
  {
    id: "links",
    short: "-l",
    long: "--links",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    summary: "Copy symlinks as symlinks.",
    detail: "Recreates symbolic links at the destination rather than skipping them. Included in --archive.",
    order: 200,
  },
  {
    id: "copyLinks",
    short: "-L",
    long: "--copy-links",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["links"],
    summary: "Follow symlinks and copy their targets.",
    detail:
      "Replaces each symlink with the file or directory it points to. Can duplicate large amounts of data and can loop on circular links.",
    order: 210,
  },
  {
    id: "safeLinks",
    long: "--safe-links",
    group: "attributes",
    kind: "boolean",
    summary: "Ignore symlinks pointing outside the tree.",
    detail:
      "Skips absolute symlinks and relative links that escape the destination hierarchy. Worth enabling whenever the source is not fully trusted.",
    order: 220,
  },
  {
    id: "perms",
    short: "-p",
    long: "--perms",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    summary: "Preserve permissions.",
    detail: "Sets the destination permission bits to match the source. Included in --archive.",
    order: 230,
  },
  {
    id: "times",
    short: "-t",
    long: "--times",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    summary: "Preserve modification times.",
    detail:
      "Strongly recommended: without it every subsequent run re-transfers everything, because rsync's quick check relies on size and mtime.",
    order: 240,
  },
  {
    id: "group",
    short: "-g",
    long: "--group",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    summary: "Preserve group ownership.",
    detail: "Requires the group to exist on the destination, or --numeric-ids. Included in --archive.",
    order: 250,
  },
  {
    id: "owner",
    short: "-o",
    long: "--owner",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    summary: "Preserve owner (needs superuser).",
    detail:
      "Only the superuser can change file ownership, so this silently has no effect for unprivileged transfers. Included in --archive.",
    order: 260,
  },
  {
    id: "devices",
    short: "-D",
    long: "--devices --specials",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    summary: "Preserve device and special files.",
    detail:
      "Shorthand for --devices --specials. Requires superuser for device nodes. Included in --archive.",
    order: 270,
  },
  {
    id: "hardLinks",
    short: "-H",
    long: "--hard-links",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    summary: "Preserve hard links.",
    detail:
      "Detects files that share an inode and recreates the link structure. Costs memory proportional to the file count, so it is not in --archive.",
    order: 280,
  },
  {
    id: "acls",
    short: "-A",
    long: "--acls",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    sinceProtocol: 30,
    implies: ["perms"],
    summary: "Preserve POSIX ACLs.",
    detail:
      "Requires ACL support in both rsync builds and on both filesystems, and generally superuser privileges for full fidelity.",
    order: 290,
  },
  {
    id: "xattrs",
    short: "-X",
    long: "--xattrs",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    sinceProtocol: 30,
    summary: "Preserve extended attributes.",
    detail:
      "Needed for macOS metadata and SELinux labels. Requires xattr support on both ends; user namespace attributes need superuser on some systems.",
    order: 300,
  },
  {
    id: "numericIds",
    long: "--numeric-ids",
    group: "attributes",
    kind: "boolean",
    summary: "Transfer numeric user/group ids.",
    detail:
      "Skips name lookups and copies raw uid/gid values. Correct for disk images and identical systems; wrong when the two machines have different user databases.",
    order: 310,
  },
  {
    id: "chmod",
    long: "--chmod",
    group: "attributes",
    kind: "text",
    arg: { placeholder: "D755,F644" },
    summary: "Force permissions on the destination.",
    detail:
      "Applies a symbolic or octal mode to transferred files, overriding the source bits. `D` prefixes apply to directories, `F` to files.",
    order: 320,
  },
  {
    id: "sparse",
    short: "-S",
    long: "--sparse",
    group: "attributes",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["inplace"],
    summary: "Write sparse files efficiently.",
    detail:
      "Turns runs of zero bytes into filesystem holes. Good for VM images and database files; incompatible with --inplace on older rsync builds.",
    order: 330,
  },

  // ── selection ─────────────────────────────────────────────────────────────
  {
    id: "checksum",
    short: "-c",
    long: "--checksum",
    group: "selection",
    kind: "boolean",
    preferShort: true,
    conflictsWith: ["sizeOnly"],
    summary: "Compare by checksum, not size and time.",
    detail:
      "Reads every byte of every file on both sides before deciding what to send. Slow but authoritative — the right choice for verifying a previous copy.",
    order: 400,
  },
  {
    id: "sizeOnly",
    long: "--size-only",
    group: "selection",
    kind: "boolean",
    conflictsWith: ["checksum"],
    summary: "Compare by size only, ignore timestamps.",
    detail:
      "Skips files whose size matches even if the contents changed. Useful after a migration that reset all mtimes; dangerous otherwise.",
    order: 410,
  },
  {
    id: "ignoreExisting",
    long: "--ignore-existing",
    group: "selection",
    kind: "boolean",
    conflictsWith: ["existing"],
    summary: "Skip files that already exist at the destination.",
    detail: "Transfers only new files and never updates existing ones. Good for resuming a one-time seed copy.",
    order: 420,
  },
  {
    id: "existing",
    long: "--existing",
    group: "selection",
    kind: "boolean",
    conflictsWith: ["ignoreExisting"],
    summary: "Update only files already at the destination.",
    detail: "Never creates new files; refreshes what is already there. The inverse of --ignore-existing.",
    order: 430,
  },
  {
    id: "excludeFrom",
    long: "--exclude-from",
    group: "selection",
    kind: "path",
    arg: { placeholder: "/path/to/excludes.txt" },
    summary: "Read exclude patterns from a file.",
    detail:
      "One pattern per line; blank lines and lines starting with # or ; are ignored. Keeps long exclusion lists out of the command line.",
    order: 440,
  },
  {
    id: "filesFrom",
    long: "--files-from",
    group: "selection",
    kind: "path",
    arg: { placeholder: "/path/to/list.txt" },
    summary: "Transfer exactly the paths listed in a file.",
    detail:
      "Reads the transfer list from a file. This implies --relative and turns OFF recursion — adding -r back changes the meaning, which is rarely what people want.",
    implies: ["relative"],
    order: 450,
  },
  {
    id: "pruneEmptyDirs",
    short: "-m",
    long: "--prune-empty-dirs",
    group: "selection",
    kind: "boolean",
    preferShort: true,
    summary: "Omit directories that end up empty.",
    detail:
      "Removes from the transfer any directory left empty after filters were applied, instead of creating empty shells at the destination.",
    order: 460,
  },
  {
    id: "oneFileSystem",
    short: "-x",
    long: "--one-file-system",
    group: "selection",
    kind: "boolean",
    preferShort: true,
    summary: "Do not cross filesystem boundaries.",
    detail:
      "Stops rsync descending into mount points. Essential when backing up a root filesystem, or it will walk into /proc, /sys and network mounts.",
    order: 470,
  },

  // ── deletion ──────────────────────────────────────────────────────────────
  {
    id: "delete",
    long: "--delete",
    group: "deletion",
    kind: "enum",
    danger: "destructive",
    options: [
      { value: "none", label: "Do not delete", renders: "" },
      {
        value: "plain",
        label: "--delete (rsync chooses when)",
        renders: "--delete",
        summary: "Lets rsync pick during/before based on the transfer style.",
      },
      {
        value: "during",
        label: "--delete-during",
        renders: "--delete-during",
        summary: "Delete as each directory is processed. Lowest memory.",
      },
      {
        value: "before",
        label: "--delete-before",
        renders: "--delete-before",
        summary: "Delete everything first. Frees space before transferring.",
      },
      {
        value: "after",
        label: "--delete-after",
        renders: "--delete-after",
        summary: "Delete once the transfer succeeds. Safest ordering.",
      },
      {
        value: "delay",
        label: "--delete-delay",
        renders: "--delete-delay",
        summary: "Collect deletions during, apply at the end.",
      },
    ],
    summary: "Delete destination files missing from the source.",
    detail:
      "Makes the destination an exact mirror by removing anything the source no longer has. This deletes real data and cannot be undone. Always review a --dry-run first, and note that deletion only happens inside directories rsync actually recurses into.",
    order: 500,
  },
  {
    id: "deleteExcluded",
    long: "--delete-excluded",
    group: "deletion",
    kind: "boolean",
    danger: "destructive",
    requires: ["delete"],
    summary: "Also delete excluded files from the destination.",
    detail:
      "By default excluded files at the destination are protected from --delete. This removes that protection, which surprises people who used excludes expecting them to be preserved.",
    order: 510,
  },
  {
    id: "maxDelete",
    long: "--max-delete",
    group: "deletion",
    kind: "number",
    arg: { placeholder: "100", min: 0 },
    requires: ["delete"],
    summary: "Abort if more than N files would be deleted.",
    detail:
      "A circuit breaker: if the source is accidentally empty or unmounted, rsync stops instead of wiping the destination. Cheap insurance on any scheduled mirror.",
    order: 520,
  },
  {
    id: "force",
    long: "--force",
    group: "deletion",
    kind: "boolean",
    danger: "destructive",
    summary: "Delete destination directories even when non-empty.",
    detail:
      "Allows replacing a non-empty destination directory with a non-directory from the source. Rarely needed once --delete is in use.",
    order: 530,
  },
  {
    id: "ignoreErrors",
    long: "--ignore-errors",
    group: "deletion",
    kind: "boolean",
    danger: "destructive",
    requires: ["delete"],
    summary: "Delete even when I/O errors occurred.",
    detail:
      "Normally rsync suppresses deletion after I/O errors, because an unreadable source directory can look empty. This override removes that safety net.",
    order: 540,
  },

  // ── partial transfers ─────────────────────────────────────────────────────
  {
    id: "partial",
    long: "--partial",
    group: "resume",
    kind: "boolean",
    summary: "Keep partially transferred files.",
    detail:
      "Leaves incomplete files in place so a later run can resume them. Without --partial-dir the fragment sits at the final path, which can look like a complete file to other tools.",
    order: 600,
  },
  {
    id: "partialDir",
    long: "--partial-dir",
    group: "resume",
    kind: "text",
    arg: { placeholder: ".rsync-partial" },
    conflictsWith: ["inplace"],
    implies: ["partial"],
    summary: "Stage partial files in a separate directory.",
    detail:
      "Holds fragments away from the destination tree so consumers never see a half-written file at its real path. This is what you almost always want alongside --partial.",
    order: 610,
  },
  {
    id: "inplace",
    long: "--inplace",
    group: "resume",
    kind: "boolean",
    danger: "caution",
    conflictsWith: ["partialDir", "sparse", "append"],
    summary: "Write updates directly into the destination file.",
    detail:
      "Avoids a temporary copy, so it needs no extra free space and preserves hard links — but the destination is inconsistent while the transfer runs, and an interruption leaves a corrupt file. Also defeats --backup.",
    order: 620,
  },
  {
    id: "append",
    long: "--append",
    group: "resume",
    kind: "enum",
    danger: "caution",
    conflictsWith: ["inplace"],
    options: [
      { value: "none", label: "Off", renders: "" },
      {
        value: "append",
        label: "--append",
        renders: "--append",
        summary: "Assume existing data is correct and only add to the end.",
      },
      {
        value: "verify",
        label: "--append-verify",
        renders: "--append-verify",
        summary: "Checksum the existing portion before appending.",
      },
    ],
    summary: "Resume by appending to shorter destination files.",
    detail:
      "Only valid when destination files are truncated prefixes of the source, such as an interrupted download. Plain --append does not verify the existing bytes and will silently produce a corrupt file if they differ.",
    order: 630,
  },
  {
    id: "timeout",
    long: "--timeout",
    group: "resume",
    kind: "number",
    arg: { placeholder: "600", unit: "seconds", min: 1 },
    summary: "Abort after N seconds of I/O inactivity.",
    detail:
      "Prevents a scheduled job hanging forever on a dead connection. Set it comfortably above the longest expected pause for large-file checksumming.",
    order: 640,
  },

  // ── bandwidth & size ──────────────────────────────────────────────────────
  {
    id: "bwlimit",
    long: "--bwlimit",
    group: "bandwidth",
    kind: "text",
    arg: { placeholder: "5M" },
    summary: "Limit transfer rate.",
    detail:
      "Accepts a bare number as KiB/s, or a suffix such as 500K, 5M, 1G. Keeps a background sync from saturating an uplink.",
    order: 700,
  },
  {
    id: "maxSize",
    long: "--max-size",
    group: "bandwidth",
    kind: "text",
    arg: { placeholder: "100M" },
    summary: "Skip files larger than this.",
    detail: "Accepts suffixes K, M, G. Useful for excluding disk images or video from a document sync.",
    order: 710,
  },
  {
    id: "minSize",
    long: "--min-size",
    group: "bandwidth",
    kind: "text",
    arg: { placeholder: "1K" },
    summary: "Skip files smaller than this.",
    detail: "Filters out thumbnails, lock files and empty placeholders.",
    order: 720,
  },

  // ── output ────────────────────────────────────────────────────────────────
  {
    id: "verbose",
    long: "--verbose",
    group: "output",
    kind: "enum",
    options: [
      { value: "none", label: "Quiet", renders: "" },
      { value: "1", label: "-v (list transferred files)", renders: "-v" },
      { value: "2", label: "-vv (also list skipped files)", renders: "-vv" },
      { value: "3", label: "-vvv (debug)", renders: "-vvv" },
    ],
    summary: "Verbosity level.",
    detail:
      "Each level adds detail. -v names transferred files; -vv explains why files were skipped, which is the fastest way to debug filter rules.",
    order: 800,
  },
  {
    id: "humanReadable",
    short: "-h",
    long: "--human-readable",
    group: "output",
    kind: "boolean",
    preferShort: true,
    summary: "Print sizes in human units.",
    detail: "Formats byte counts as K/M/G. Repeat as -hh for powers of 1000 instead of 1024.",
    order: 810,
  },
  {
    id: "progress",
    long: "--progress",
    group: "output",
    kind: "boolean",
    summary: "Show per-file progress.",
    detail:
      "Prints a progress line per file. For a single overall progress bar across the whole transfer use --info=progress2 instead.",
    order: 820,
  },
  {
    id: "info",
    long: "--info",
    group: "output",
    kind: "text",
    arg: { placeholder: "progress2,stats2" },
    sinceProtocol: 31,
    summary: "Fine-grained output selection.",
    detail:
      "Comma-separated categories such as progress2 (whole-transfer progress), name, stats2, del. Requires rsync 3.1 or newer.",
    order: 830,
  },
  {
    id: "itemizeChanges",
    short: "-i",
    long: "--itemize-changes",
    group: "output",
    kind: "boolean",
    preferShort: true,
    summary: "Show exactly what changed per file.",
    detail:
      "Emits an 11-character change summary per item, e.g. `>f+++++++++` for a new file. Combined with --dry-run this is the clearest possible preview of what a run would do.",
    order: 840,
  },
  {
    id: "stats",
    long: "--stats",
    group: "output",
    kind: "boolean",
    summary: "Print a transfer summary at the end.",
    detail: "Reports file counts, bytes sent and received, and the speedup ratio versus a plain copy.",
    order: 850,
  },
  {
    id: "logFile",
    long: "--log-file",
    group: "output",
    kind: "path",
    arg: { placeholder: "/var/log/rsync-backup.log" },
    summary: "Append a log to this file.",
    detail: "Writes rsync's own log independently of shell redirection. The right way to log a cron job.",
    order: 860,
  },
  {
    id: "outFormat",
    long: "--out-format",
    group: "output",
    kind: "text",
    arg: { placeholder: "%i|%n|%l|%b" },
    summary: "Custom per-file output format.",
    detail:
      "Escape sequences such as %i (itemized change), %n (name), %l (length), %b (bytes transferred). Produces machine-readable output.",
    order: 870,
  },
  {
    id: "dryRun",
    short: "-n",
    long: "--dry-run",
    group: "output",
    kind: "boolean",
    preferShort: true,
    summary: "Show what would happen without doing it.",
    detail:
      "Performs the full comparison and reports every action, but transfers and deletes nothing. Run this first for anything involving --delete.",
    order: 880,
  },

  // ── backup ────────────────────────────────────────────────────────────────
  {
    id: "backup",
    short: "-b",
    long: "--backup",
    group: "backup",
    kind: "boolean",
    preferShort: true,
    summary: "Keep a copy of files before replacing them.",
    detail:
      "Renames each file that would be overwritten or deleted, adding a suffix (default `~`). Combined with --backup-dir this makes a mirror recoverable.",
    order: 900,
  },
  {
    id: "backupDir",
    long: "--backup-dir",
    group: "backup",
    kind: "path",
    arg: { placeholder: "/backup/previous" },
    implies: ["backup"],
    summary: "Store backups in this directory.",
    detail:
      "Preserves the original directory structure under the given path instead of littering suffixed files through the destination. Point it at a dated directory for cheap versioning.",
    order: 910,
  },
  {
    id: "suffix",
    long: "--suffix",
    group: "backup",
    kind: "text",
    arg: { placeholder: "~" },
    requires: ["backup"],
    summary: "Backup filename suffix.",
    detail: "Defaults to `~`, or to nothing when --backup-dir is set.",
    order: 920,
  },

  // ── remote ────────────────────────────────────────────────────────────────
  {
    id: "rsyncPath",
    long: "--rsync-path",
    group: "remote",
    kind: "text",
    arg: { placeholder: "sudo rsync" },
    summary: "Command used to start rsync on the remote host.",
    detail:
      "Typically `sudo rsync` to preserve ownership, or an absolute path when rsync is not on the remote PATH. This runs a command on the remote machine — treat it as privileged.",
    danger: "caution",
    order: 1000,
  },
  {
    id: "protectArgs",
    short: "-s",
    long: "--protect-args",
    group: "remote",
    kind: "boolean",
    preferShort: true,
    summary: "Stop the remote shell expanding filenames.",
    detail:
      "Sends filenames so the remote shell does not glob or word-split them. Enable it whenever paths contain spaces, brackets or wildcards.",
    order: 1010,
  },

  // ── advanced ──────────────────────────────────────────────────────────────
  {
    id: "checksumChoice",
    long: "--checksum-choice",
    group: "advanced",
    kind: "text",
    arg: { placeholder: "xxh64" },
    sinceProtocol: 31,
    summary: "Select the checksum algorithm.",
    detail:
      "xxh64/xxh3 are far faster than md5 and available in rsync 3.2+. Both ends must support the choice.",
    order: 1100,
  },
  {
    id: "blockingIo",
    long: "--blocking-io",
    group: "advanced",
    kind: "boolean",
    summary: "Use blocking I/O for the remote shell.",
    detail: "A workaround for remote shells that misbehave with non-blocking pipes. Rarely needed.",
    order: 1110,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

/** True when the flag does not exist in the rsync build being targeted. */
export function isUnavailable(flag: FlagDef, targetProtocol: number): boolean {
  return isUnavailableGeneric(flag, targetProtocol);
}

/** Human-facing label, preferring the short form when the flag has one. */
export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
