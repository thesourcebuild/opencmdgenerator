import { describe, expect, it } from "vitest";
import { MANIFESTS } from "@cmdgen/registry";
import type { LsPlatform } from "@cmdgen/ls";
import type { RmPlatform } from "@cmdgen/rm";
import type { KillPlatform } from "@cmdgen/kill";

describe("command manifests", () => {
  it("has no duplicate ids", () => {
    const ids = MANIFESTS.map((m) => m.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
  });

  it("every manifest declares at least one supported platform and shell", () => {
    // Guards against a future command's badges silently rendering empty —
    // these fields are hand-authored, not type-derived, so nothing else
    // forces someone adding a 9th command to fill them in.
    for (const manifest of MANIFESTS) {
      expect(manifest.platforms.length, `${manifest.id}.platforms`).toBeGreaterThan(0);
      expect(manifest.shells.length, `${manifest.id}.shells`).toBeGreaterThan(0);
    }
  });

  it("cmd.exe support is claimed only by commands with a real cmd.exe story", () => {
    // cd, mkdir (md), ln (mklink), mv (move), cp (copy), cat (type), echo,
    // grep (findstr), sort, diff (fc), export (set), clear (cls), whoami
    // (the same real whoami.exe), ifconfig (ipconfig), and traceroute
    // (tracert) are all cmd.exe builtins or binaries; ssh/scp
    // (Win32-OpenSSH), tar (bsdtar, bundled since Windows 10 1803), curl
    // (the real curl.exe, also bundled since Windows 10 1803), git (git.exe,
    // bundled with Git for Windows), and rsync (once a Windows port is
    // installed) are all plain argv .exe files that run the same from
    // cmd.exe as from PowerShell.
    // ffmpeg (ffmpeg.exe, a real cross-platform binary that runs identically
    // from cmd.exe as from PowerShell — same justification as curl/tar/git).
    // openssl (openssl.exe, bundled with Git for Windows and natively
    // packaged on Linux/macOS, runs identically from cmd.exe and PowerShell —
    // same justification as curl/tar/git/ffmpeg).
    // where (where.exe, a real Windows-native binary) is a special case:
    // it's cmd.exe-only in the sense that it has no Linux/Mac form at all,
    // but IS one of the few commands here where cmd.exe and PowerShell
    // genuinely diverge beyond quoting — PowerShell's built-in `where`
    // alias (-> Where-Object) shadows the real tool, so this app renders
    // the explicit `where.exe` there and plain `where` for cmd.exe.
    // alias deliberately does NOT claim cmd.exe: doskey macros are real but
    // process-local to the current console — gone the moment that window
    // closes — unlike a shell alias or a PowerShell profile entry, so this
    // app only offers PowerShell's Set-Alias on Windows.
    // ls/rm/kill/pwd/touch/chown/head/tail/less/cmp/comm/uname/ps/top/
    // killall/df/mount/man/whatis/whereis/cal/dd/zip/unzip/wget have no
    // cmd.exe equivalent at all — cmd.exe's real tools there are
    // dir/del/taskkill/cd, which this app never generates for those
    // commands (and most of them have no Windows story at all).
    const cmdSupporters = MANIFESTS.filter((m) => m.shells.includes("cmd"))
      .map((m) => m.id)
      .sort();
    expect(cmdSupporters).toEqual([
      "cat",
      "cd",
      "clear",
      "cp",
      "curl",
      "diff",
      "echo",
      "export",
      "ffmpeg",
      "git",
      "grep",
      "ifconfig",
      "ln",
      "mkdir",
      "mv",
      "openssl",
      "rsync",
      "scp",
      "sort",
      "ssh",
      "tar",
      "traceroute",
      "where",
      "whoami",
    ]);
  });

  it("ls/rm/kill's own platform types stay decoupled from ShellDialect's cmd value", () => {
    // Compile-time guard, not a runtime one: LsPlatform/RmPlatform/KillPlatform
    // were deliberately changed from `= ShellDialect` aliases to their own
    // standalone z.enum(["posix","powershell"]) (see each spec.ts's own note)
    // specifically so widening the shared ShellDialect to add "cmd" couldn't
    // silently let these three accept it too. If any of them ever got
    // re-aliased back to ShellDialect, "cmd" would become assignable again and
    // this line would fail to typecheck (tsc -p tests, part of `pnpm typecheck`).
    type NotAssignable<T, U> = T extends U ? never : true;
    const lsExcludesCmd: NotAssignable<"cmd", LsPlatform> = true;
    const rmExcludesCmd: NotAssignable<"cmd", RmPlatform> = true;
    const killExcludesCmd: NotAssignable<"cmd", KillPlatform> = true;
    expect([lsExcludesCmd, rmExcludesCmd, killExcludesCmd]).toEqual([true, true, true]);
  });
});
