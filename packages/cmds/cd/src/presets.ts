import type { Preset } from "@cmdgen/engine";
import type { CdPlatform, CdSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: CdSpec) =>
  spec.platform === "linux" ||
  spec.platform === "mac" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";
const isWindows = (spec: CdSpec) => spec.platform === "windows-cmd" || spec.platform === "windows-powershell";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  platform?: CdPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): CdSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    path: "",
    platform: options.platform ?? "linux",
    flags: {},
  };
}

export const PRESETS: readonly Preset<CdSpec>[] = [
  {
    id: "home",
    label: "Home directory",
    summary:
      "Goes to the home directory: a bare cd on bash/zsh (including Cygwin, MSYS2 and WSL), ~ on PowerShell, %USERPROFILE% (with /d) on cmd.exe.",
    apply: (spec) => {
      switch (spec.platform) {
        case "linux":
        case "mac":
        case "windows-cygwin":
        case "windows-msys":
        case "windows-wsl":
          // A bare `cd` is bash/zsh's own "go home" — no argument needed. Cygwin,
          // MSYS2 and WSL run the same real bash, so this applies there too.
          return { ...spec, path: "", flags: {} };
        case "windows-powershell":
          // PowerShell's filesystem provider expands ~ directly, unlike cmd.exe.
          return { ...spec, path: "~", flags: {} };
        case "windows-cmd":
          // cmd.exe has no home shorthand at all; %USERPROFILE% is the closest
          // equivalent, and /d covers the (uncommon) case where it's on another drive.
          return { ...spec, path: "%USERPROFILE%", flags: { switchDrive: true } };
      }
    },
  },
  {
    id: "previous",
    label: "Previous directory",
    summary: "cd - switches back to $OLDPWD. No equivalent on cmd.exe or PowerShell.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, path: "-", flags: {} } : spec),
  },
  {
    id: "parent",
    label: "Parent directory",
    summary: "Goes up one directory. .. means the same thing in bash/zsh, cmd.exe and PowerShell.",
    apply: (spec) => ({ ...spec, path: "..", flags: {} }),
  },
  {
    id: "up-two",
    label: "Up two levels",
    summary: "Goes up two directories at once.",
    apply: (spec) => ({ ...spec, path: isWindows(spec) ? "..\\.." : "../..", flags: {} }),
  },
  {
    id: "root",
    label: "Root directory",
    summary: "Goes to the filesystem root — / on bash/zsh, or \\ (root of the current drive) on Windows.",
    apply: (spec) => ({ ...spec, path: isWindows(spec) ? "\\" : "/", flags: {} }),
  },
  {
    id: "other-user-home",
    label: "Another user's home",
    summary:
      "~username expands to that user's home directory. Edit \"username\" after applying. bash/zsh only.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, path: "~username", flags: {} } : spec),
  },
];

export function getPreset(id: string): Preset<CdSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
