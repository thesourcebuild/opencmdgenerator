import type { TarMode, TarSpec } from "../spec";
import { compressionOf, flagBool, flagNumber, flagString } from "../pure";

const MODE_VERB: Record<TarMode, string> = {
  create: "Create",
  extract: "Extract",
  list: "List the contents of",
  append: "Append to",
  update: "Add newer files to",
  diff: "Compare the filesystem against",
  delete: "Delete members from",
  concatenate: "Append other archives to",
  testLabel: "Test the volume label of",
};

const READ_MODES: readonly TarMode[] = ["extract", "list", "diff", "testLabel"];

export function describeSpec(spec: TarSpec): string {
  const archive = spec.archive.trim();
  const target =
    archive === ""
      ? READ_MODES.includes(spec.mode)
        ? "an archive on standard input"
        : "an archive on standard output"
      : `"${archive}"`;

  const parts: string[] = [`${MODE_VERB[spec.mode]} ${target}`];

  const compression = compressionOf(spec);
  if (compression) parts.push(`compressed with ${compression}`);
  else if (flagBool(spec, "autoCompress")) parts.push("choosing the compressor from the file extension");
  else {
    const program =
      flagString(spec, spec.variant === "bsd" ? "useCompressProgramBsd" : "useCompressProgram");
    if (program) parts.push(`filtered through "${program}"`);
  }

  const files = spec.files.map((f) => f.trim()).filter((f) => f !== "");
  if (spec.mode === "create" || spec.mode === "append" || spec.mode === "update") {
    if (files.length === 0 && flagString(spec, "filesFrom")) parts.push("from the file list given by -T");
    else if (files.length === 0) parts.push("from NOTHING (no inputs set)");
    else parts.push(`from ${files.length === 1 ? files[0] : `${files.length} paths`}`);
  } else if (files.length > 0) {
    parts.push(`limited to ${files.length === 1 ? files[0] : `${files.length} members`}`);
  }

  const dir = spec.changeDir.trim();
  if (dir !== "") parts.push(`working from "${dir}"`);

  const strip = flagNumber(spec, "stripComponents");
  if (strip !== undefined) parts.push(`dropping ${strip} leading path ${strip === 1 ? "component" : "components"}`);

  if (flagBool(spec, "oneTopLevel")) parts.push("into a single new subdirectory");
  else {
    const named = flagString(spec, "oneTopLevelDir");
    if (named) parts.push(`into the subdirectory "${named}"`);
  }
  if (flagBool(spec, "keepOldFiles")) parts.push("without replacing existing files");
  else if (flagBool(spec, "overwrite")) parts.push("overwriting existing files");

  const excludes = spec.excludes.map((e) => e.trim()).filter((e) => e !== "");
  if (excludes.length > 0) parts.push(`excluding ${excludes.length} ${excludes.length === 1 ? "pattern" : "patterns"}`);
  if (flagBool(spec, "excludeVcs")) parts.push("skipping version-control directories");

  if (flagBool(spec, "removeFiles")) parts.push("then DELETING the originals");

  return `${parts.join(", ")}.`;
}
