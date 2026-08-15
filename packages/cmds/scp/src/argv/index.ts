import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { Endpoint, PathFlavor, ScpSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { normalisePath, toScpPath } from "./paths";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: ScpSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Render an endpoint as the single path token scp expects.
 *   local  -> /home/me/photos          (translated per pathFlavor)
 *   remote -> me@host:/srv/photos      (port travels in -P, not here — remote
 *                                        path is interpreted by the remote
 *                                        shell, so it is always POSIX)
 */
export function renderScpTarget(e: Endpoint, flavor: PathFlavor): string {
  if (e.kind === "local") {
    return toScpPath(normalisePath(e.path), flavor);
  }
  const userPart = e.user.trim() ? `${e.user.trim()}@` : "";
  return `${userPart}${e.host.trim()}:${normalisePath(e.path)}`;
}

/** Short label for the UI, e.g. "me@host:/srv/photos". */
export function endpointLabel(e: Endpoint): string {
  if (e.kind === "local") return e.path || "(no path)";
  return `${e.user ? `${e.user}@` : ""}${e.host || "(no host)"}:${e.path || "(no path)"}`;
}

export function endpointIsEmpty(e: Endpoint): boolean {
  if (e.kind === "local") return e.path.trim() === "";
  return e.host.trim() === "" || e.path.trim() === "";
}

/**
 * Build the scp invocation as ordered, role-tagged tokens: catalogue flags,
 * then `-i identity`/`-P port` (top-level connection fields, not catalogue
 * flags — same reasoning as ssh's `-i`/`-p`), then repeatable `-o`/`-X`
 * options, then every source, then the destination.
 */
export function buildArgv(spec: ScpSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const identityFile = spec.identityFile.trim();
  if (identityFile !== "") {
    args.push({ text: "-i", role: "flag" });
    args.push({ text: identityFile, role: "path" });
  }

  const port = spec.port.trim();
  if (port !== "") {
    args.push({ text: "-P", role: "flag" });
    args.push({ text: port, role: "value" });
  }

  for (const opt of spec.sshOptions) {
    const trimmed = opt.trim();
    if (trimmed === "") continue;
    args.push({ text: "-o", role: "flag" });
    args.push({ text: trimmed, role: "value" });
  }

  for (const opt of spec.sftpOptions) {
    const trimmed = opt.trim();
    if (trimmed === "") continue;
    args.push({ text: "-X", role: "flag" });
    args.push({ text: trimmed, role: "value" });
  }

  for (const source of spec.sources) {
    const rendered = renderScpTarget(source, spec.pathFlavor);
    if (rendered !== "") args.push({ text: rendered, role: "path" });
  }

  const destination = renderScpTarget(spec.destination, spec.pathFlavor);
  if (destination !== "") args.push({ text: destination, role: "path" });

  return { binary: spec.scpBinary || "scp", args };
}
