import type { CommandManifest } from "@cmdgen/engine";

export const WHERE_MANIFEST: CommandManifest = {
  id: "where",
  label: "where",
  category: "Shell",
  tags: ["Shell", "Documentation"],
  summary: "Locate the file(s) that match a pattern along PATH — the Windows equivalent of which.",
  // Windows only — where.exe has no Linux/Mac form (which/whereis already
  // cover POSIX). Both cmd.exe and PowerShell are real, distinct targets:
  // PowerShell's built-in `where` alias shadows the real tool (see
  // spec.ts's WherePlatform doc comment), so this app renders the explicit
  // `where.exe` there instead of the bare name cmd.exe uses.
  platforms: ["win32"],
  shells: ["cmd", "powershell"],
};
