import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * `-d/--data-raw/--data-binary/--data-ascii/--data-urlencode/--json` are all
 * repeatable in real curl (multiple `-d` concatenate with `&`; `--json` also
 * sets Content-Type/Accept automatically). The flag catalogue has no
 * repeated-flag concept — same reason tar's `excludes` is a spec field, not
 * a flag — so every body chunk is one entry here, rendered in order.
 */
export const CurlDataMode = z.enum(["data", "data-raw", "data-binary", "data-ascii", "data-urlencode", "json"]);
export type CurlDataMode = z.infer<typeof CurlDataMode>;

export const CurlDataEntry = z.object({ mode: CurlDataMode, value: z.string() });
export type CurlDataEntry = z.infer<typeof CurlDataEntry>;

/** `-F/--form` and `--form-string`, repeated — same reasoning as `CurlDataEntry`. */
export const CurlFormMode = z.enum(["form", "form-string"]);
export type CurlFormMode = z.infer<typeof CurlFormMode>;

export const CurlFormEntry = z.object({ mode: CurlFormMode, value: z.string() });
export type CurlFormEntry = z.infer<typeof CurlFormEntry>;

export const CurlSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * Positional target(s) — `--url` is deliberately not a catalogue flag; a
   * bare URL and `--url <url>` are the same thing in real curl, and modeling
   * both would just be two representations of one value.
   */
  urls: z.array(z.string()).default([""]),

  /** `-H/--header`, repeated. Raw `"Name: value"` strings, rendered verbatim in user order. */
  headers: z.array(z.string()).default([]),

  /** Request body chunks — see `CurlDataEntry`. `-d`/`--data` itself is not a catalogue flag; every mode variant is represented here instead. */
  dataEntries: z.array(CurlDataEntry).default([]),

  /** Multipart form fields — see `CurlFormEntry`. `-F`/`--form-string` are not catalogue flags for the same reason. */
  formEntries: z.array(CurlFormEntry).default([]),

  /** Quoting only. curl is a real executable invoked identically from bash, cmd and PowerShell — Windows 10 1803+ bundles it in System32. */
  shell: ShellDialect.default("posix"),

  flags: FlagValues.default({}),
});
export type CurlSpec = z.infer<typeof CurlSpec>;
