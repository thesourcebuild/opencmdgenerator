import type { CommandManifest } from "@cmdgen/engine";

export const DD_MANIFEST: CommandManifest = {
  id: "dd",
  label: "dd",
  category: "Shell",
  tags: ["Shell", "Filesystem"],
  // DANGER: dd is famously destructive. Swap if= and of= — or simply point
  // of= at the wrong device — and dd will silently and irreversibly
  // overwrite it with whatever if= produces: a disk image over a live disk,
  // a partition over a boot loader, /dev/zero over data. There is no
  // confirmation prompt and no undo. This app never executes dd itself; the
  // one guard it offers is DD003 in lint/rules.ts, a warning (not a hard
  // block) for the narrower case of if= and of= naming the same file. This
  // is the same restraint the rest of this app applies to rm's -r/-f (see
  // `DangerLevel` on `@cmdgen/rm`'s catalogue flags) — describe the risk,
  // don't try to code around it.
  summary: "Copy and convert raw data block by block — disk images, wipes, and low-level copies.",
  // No win32 — same reasoning as @cmdgen/mount: dd has no Windows-native
  // equivalent by that name at all, and it can never be typed into a bare
  // cmd.exe/PowerShell prompt regardless.
  platforms: ["darwin", "linux"],
  shells: ["posix"],
};
