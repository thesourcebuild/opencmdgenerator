import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GzipSpec } from "../spec";
import { flagBool, setFlag } from "../pure";

function validFiles(spec: GzipSpec): string[] {
  return spec.files.map((f) => f.trim()).filter((f) => f !== "");
}

/**
 * gzip's single most surprising default: compressing (or, with -d,
 * decompressing) a file REPLACES it on disk — the original is deleted the
 * moment the operation finishes. -k is the only thing that stops that. With
 * no files listed, gzip reads from stdin and writes to stdout instead, so
 * nothing on disk is at risk — same reasoning as `@cmdgen/tar`'s TAR003
 * (--remove-files) for the fix shape, but this one fires by default rather
 * than only when an explicit flag is set.
 */
const keepFootgun: LintRule<GzipSpec> = {
  code: "GZP001",
  check(spec) {
    if (validFiles(spec).length === 0) return [];
    if (flagBool(spec, "keep")) return [];

    const decompressing = flagBool(spec, "decompress");
    return [
      {
        code: "GZP001",
        level: "destructive",
        message: decompressing
          ? "Without -k, each .gz file is deleted once it's decompressed."
          : "Without -k, each original file is deleted once it's compressed.",
        detail: decompressing
          ? "gzip -d replaces file.gz with the decompressed file and removes file.gz — there is no prompt and no way back short of recompressing."
          : "gzip replaces the original file with file.gz and removes the original — there is no prompt and no way back short of decompressing again.",
        flagIds: ["keep"],
        field: "files",
        fix: { label: "Add -k / --keep", apply: (s) => setFlag(s, "keep", true) },
      },
    ];
  },
};

/** Compression level only matters while compressing; -d ignores it entirely. */
const levelWithDecompress: LintRule<GzipSpec> = {
  code: "GZP002",
  check(spec) {
    if (spec.compressionLevel === undefined || !flagBool(spec, "decompress")) return [];
    return [
      {
        code: "GZP002",
        level: "warning",
        message: `-${spec.compressionLevel} has no effect together with -d.`,
        detail: "Decompression doesn't take a compression level — gzip silently ignores it when -d is also given.",
        flagIds: ["decompress"],
        fix: { label: "Clear the compression level", apply: (s) => ({ ...s, compressionLevel: undefined }) },
      },
    ];
  },
};

export const RULES: readonly LintRule<GzipSpec>[] = [keepFootgun, levelWithDecompress];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
