import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import { CATALOGUE } from "../catalogue/flags";
import type { CurlDataMode, CurlFormMode, CurlSpec } from "../spec";
import { validUrls } from "../pure";

const DATA_FLAG: Record<CurlDataMode, string> = {
  data: "-d",
  "data-raw": "--data-raw",
  "data-binary": "--data-binary",
  "data-ascii": "--data-ascii",
  "data-urlencode": "--data-urlencode",
  json: "--json",
};

const FORM_FLAG: Record<CurlFormMode, string> = {
  form: "-F",
  "form-string": "--form-string",
};

/**
 * Catalogue flags first, then the repeatable groups the catalogue has no
 * concept of — headers, body entries, form entries, each in user order —
 * then the URL(s) last, matching real curl's own tolerant ordering. `-H`,
 * `-d`/its variants, and `-F`/`--form-string` are not catalogue flags at
 * all; see `../catalogue/flags.ts`'s header comment for why.
 */
export function buildArgv(spec: CurlSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  for (const header of spec.headers) {
    const trimmed = header.trim();
    if (trimmed === "") continue;
    args.push({ text: "-H", role: "flag" }, { text: trimmed, role: "value" });
  }

  for (const entry of spec.dataEntries) {
    const value = entry.value.trim();
    if (value === "") continue;
    args.push({ text: DATA_FLAG[entry.mode], role: "flag" }, { text: value, role: "value" });
  }

  for (const entry of spec.formEntries) {
    const value = entry.value.trim();
    if (value === "") continue;
    args.push({ text: FORM_FLAG[entry.mode], role: "flag" }, { text: value, role: "value" });
  }

  for (const url of validUrls(spec)) {
    args.push({ text: url, role: "value" });
  }

  return { binary: "curl", args };
}
