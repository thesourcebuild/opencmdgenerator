import type { RsyncSpec } from "../spec";
import { normalisePath } from "../argv/paths";

export interface TrailingSlashExplanation {
  /** The source token as it will appear in the command. */
  sourceToken: string;
  /** What the destination tree ends up looking like. */
  result: string;
  /** The same thing phrased the other way, so the choice is visible. */
  alternative: { sourceToken: string; result: string };
  summary: string;
}

function basename(path: string): string {
  const p = normalisePath(path).replace(/\\/g, "/");
  const idx = p.lastIndexOf("/");
  return idx === -1 ? p : p.slice(idx + 1);
}

function endpointPath(spec: RsyncSpec, side: "source" | "destination"): string {
  const e = spec[side];
  return e.kind === "daemon" ? `${e.module}${e.path ? `/${e.path}` : ""}` : e.path;
}

/**
 * The single most misread part of rsync. Rendered as a before/after tree rather
 * than described in prose, because the difference is one character.
 */
export function explainTrailingSlash(spec: RsyncSpec): TrailingSlashExplanation {
  const src = normalisePath(endpointPath(spec, "source")) || "SOURCE";
  const dst = normalisePath(endpointPath(spec, "destination")) || "DEST";
  const name = basename(src) || "SOURCE";

  const contentsOnly = {
    sourceToken: `${src}/`,
    result: `${dst}/<contents of ${name}>`,
  };
  const nested = {
    sourceToken: src,
    result: `${dst}/${name}/<contents>`,
  };

  return spec.contentsOnly
    ? {
        ...contentsOnly,
        alternative: nested,
        summary: `Copies the contents of ${name} directly into ${dst}.`,
      }
    : {
        ...nested,
        alternative: contentsOnly,
        summary: `Creates ${dst}/${name} and copies the contents inside it.`,
      };
}
