import { describe, expect, it } from "vitest";
import {
  buildArgv,
  buildDryRunArgv,
  enabledFlagIds,
  isAllowedExtraArg,
  renderMultiLine,
  renderOneLine,
} from "@cmdgen/rsync";
import { localToDaemon, localToLocal, localToSsh } from "./rsync-fixtures";

/**
 * These assertions are the product's contract: a spec in, an exact command out.
 * They are written as literal strings rather than snapshots so a diff shows the
 * command that changed, not a hash.
 */
const line = (spec: Parameters<typeof buildArgv>[0], combine = false) =>
  renderOneLine(buildArgv(spec), { shell: spec.shell, combineShortFlags: combine });

describe("local to local", () => {
  it("emits the trailing slash for contents-only and none for the destination", () => {
    expect(line(localToLocal({ flags: { archive: true } }))).toBe(
      "rsync -a /home/me/photos/ /backup/photos",
    );
  });

  it("nests the source directory when contentsOnly is false", () => {
    expect(line(localToLocal({ contentsOnly: false, flags: { archive: true } }))).toBe(
      "rsync -a /home/me/photos /backup/photos",
    );
  });

  it("orders flags by the catalogue, not by insertion order", () => {
    const spec = localToLocal({
      flags: { humanReadable: true, archive: true, verbose: "1", compress: true },
    });
    expect(line(spec)).toBe("rsync -a -z -v -h /home/me/photos/ /backup/photos");
  });

  it("coalesces short flags on request", () => {
    const spec = localToLocal({ flags: { archive: true, verbose: "1", humanReadable: true } });
    expect(line(spec, true)).toBe("rsync -avh /home/me/photos/ /backup/photos");
  });

  it("attaches values with = and quotes only the value half", () => {
    const spec = localToLocal({ flags: { archive: true, bwlimit: "5M", maxSize: "100M" } });
    expect(line(spec)).toBe(
      "rsync -a --bwlimit=5M --max-size=100M /home/me/photos/ /backup/photos",
    );
  });

  it("expands the delete enum to the chosen variant", () => {
    const spec = localToLocal({ flags: { archive: true, delete: "after", maxDelete: 100 } });
    expect(line(spec)).toBe(
      "rsync -a --delete-after --max-delete=100 /home/me/photos/ /backup/photos",
    );
  });

  it("emits nothing for an enum set to none", () => {
    const spec = localToLocal({ flags: { archive: true, delete: "none", append: "none" } });
    expect(line(spec)).toBe("rsync -a /home/me/photos/ /backup/photos");
  });

  it("quotes paths containing spaces and apostrophes", () => {
    const spec = localToLocal({
      source: { kind: "local", path: "/Users/me/Bob's Files" },
      destination: { kind: "local", path: "/Volumes/Backup Drive/archive" },
      flags: { archive: true },
    });
    expect(line(spec)).toBe(
      `rsync -a '/Users/me/Bob'\\''s Files/' '/Volumes/Backup Drive/archive'`,
    );
  });
});

describe("filters", () => {
  it("preserves user order, because rsync stops at the first match", () => {
    const spec = localToLocal({
      flags: { archive: true },
      filters: [
        { id: "1", kind: "include", pattern: "*.jpg", enabled: true, comment: "" },
        { id: "2", kind: "exclude", pattern: "*", enabled: true, comment: "" },
      ],
    });
    expect(line(spec)).toBe(
      "rsync -a --include '*.jpg' --exclude '*' /home/me/photos/ /backup/photos",
    );
  });

  it("skips disabled and blank rules", () => {
    const spec = localToLocal({
      flags: { archive: true },
      filters: [
        { id: "1", kind: "exclude", pattern: "*.tmp", enabled: false, comment: "" },
        { id: "2", kind: "exclude", pattern: "   ", enabled: true, comment: "" },
        { id: "3", kind: "filter", pattern: "- .git/", enabled: true, comment: "" },
      ],
    });
    expect(line(spec)).toBe("rsync -a --filter '- .git/' /home/me/photos/ /backup/photos");
  });
});

describe("ssh transport", () => {
  it("omits -e entirely when there is nothing to customise", () => {
    expect(line(localToSsh({ flags: { archive: true, compress: true } }))).toBe(
      "rsync -a -z /srv/build/ deploy@deploy.example.com:/var/www/app",
    );
  });

  it("emits -e only for non-default ssh settings", () => {
    const spec = localToSsh({
      flags: { archive: true },
      destination: {
        kind: "ssh",
        host: "deploy.example.com",
        user: "deploy",
        port: 2222,
        identityFile: "/home/me/.ssh/deploy_ed25519",
        batchMode: true,
        strictHostKeyChecking: "accept-new",
        sshOptions: ["ConnectTimeout=10"],
        path: "/var/www/app",
      },
    });
    expect(line(spec)).toBe(
      "rsync -a " +
        "-e 'ssh -p 2222 -i /home/me/.ssh/deploy_ed25519 -o BatchMode=yes " +
        "-o StrictHostKeyChecking=accept-new -o ConnectTimeout=10' " +
        "/srv/build/ deploy@deploy.example.com:/var/www/app",
    );
  });

  it("leaves remote paths POSIX even when the local flavour is Windows", () => {
    const spec = localToSsh({
      pathFlavor: "cygwin",
      source: { kind: "local", path: "C:\\Builds\\app" },
      flags: { archive: true },
    });
    expect(line(spec)).toBe(
      "rsync -a /cygdrive/c/Builds/app/ deploy@deploy.example.com:/var/www/app",
    );
  });
});

describe("daemon transport", () => {
  it("renders an rsync:// URL", () => {
    expect(line(localToDaemon({ flags: { archive: true } }))).toBe(
      "rsync -a /data/ rsync://mirror.example.org/archive/incoming",
    );
  });

  it("includes an explicit port", () => {
    const spec = localToDaemon({
      flags: { archive: true },
      destination: {
        kind: "daemon",
        host: "mirror.example.org",
        port: 8730,
        module: "archive",
        path: "",
        user: "anon",
      },
    });
    expect(line(spec)).toBe("rsync -a /data/ rsync://anon@mirror.example.org:8730/archive");
  });
});

describe("path flavour translation", () => {
  it("rewrites both endpoints for cwRsync", () => {
    const spec = localToLocal({
      pathFlavor: "cygwin",
      shell: "powershell",
      source: { kind: "local", path: "C:\\Data\\Photos" },
      destination: { kind: "local", path: "E:\\Backup" },
      flags: { archive: true },
    });
    expect(line(spec)).toBe("rsync -a /cygdrive/c/Data/Photos/ /cygdrive/e/Backup");
  });

  it("translates path-valued flags too", () => {
    const spec = localToLocal({
      pathFlavor: "wsl",
      source: { kind: "local", path: "C:\\Data" },
      destination: { kind: "local", path: "D:\\Backup" },
      flags: { archive: true, logFile: "C:\\Logs\\rsync.log" },
    });
    expect(line(spec)).toBe(
      "rsync -a --log-file=/mnt/c/Logs/rsync.log /mnt/c/Data/ /mnt/d/Backup",
    );
  });
});

describe("passthrough argument allowlist", () => {
  it("accepts well-formed options", () => {
    expect(isAllowedExtraArg("--no-motd")).toBe(true);
    expect(isAllowedExtraArg("--modify-window=2")).toBe(true);
    expect(isAllowedExtraArg("-q")).toBe(true);
  });

  it("rejects anything that makes rsync execute a program", () => {
    expect(isAllowedExtraArg("-e")).toBe(false);
    expect(isAllowedExtraArg("--rsh=ssh")).toBe(false);
    expect(isAllowedExtraArg("--rsync-path=/tmp/evil")).toBe(false);
  });

  it("rejects malformed input and bare words", () => {
    expect(isAllowedExtraArg("; rm -rf /")).toBe(false);
    expect(isAllowedExtraArg("/etc/passwd")).toBe(false);
    expect(isAllowedExtraArg("")).toBe(false);
  });

  it("drops rejected arguments from the generated command", () => {
    const spec = localToLocal({
      flags: { archive: true },
      extraArgs: ["--no-motd", "--rsh=ssh", "; rm -rf /"],
    });
    expect(line(spec)).toBe("rsync -a --no-motd /home/me/photos/ /backup/photos");
  });
});

describe("version gating", () => {
  it("omits flags the target rsync does not have", () => {
    const spec = localToLocal({
      targetProtocol: 30,
      flags: { archive: true, mkpath: true, info: "progress2" },
    });
    expect(line(spec)).toBe("rsync -a /home/me/photos/ /backup/photos");
  });

  it("includes them when the target is new enough", () => {
    const spec = localToLocal({
      targetProtocol: 31,
      flags: { archive: true, mkpath: true, info: "progress2" },
    });
    expect(line(spec)).toBe(
      "rsync -a --mkpath --info=progress2 /home/me/photos/ /backup/photos",
    );
  });
});

describe("dry-run variant", () => {
  it("adds -n -i --stats without mutating the original spec", () => {
    const spec = localToLocal({ flags: { archive: true, delete: "after" } });
    const dry = renderOneLine(buildDryRunArgv(spec), { shell: "posix" });
    expect(dry).toBe(
      "rsync -a --delete-after -i --stats -n /home/me/photos/ /backup/photos",
    );
    expect(spec.flags.dryRun).toBeUndefined();
  });
});

describe("enabledFlagIds", () => {
  it("reports only genuinely active flags", () => {
    const spec = localToLocal({
      flags: {
        archive: true,
        compress: false,
        delete: "none",
        bwlimit: "",
        maxDelete: 100,
        logFile: "  ",
      },
    });
    expect(enabledFlagIds(spec)).toEqual(["archive", "maxDelete"]);
  });
});

describe("multi-line rendering", () => {
  it("keeps a flag and its detached value on one line", () => {
    const spec = localToLocal({
      flags: { archive: true },
      filters: [{ id: "1", kind: "exclude", pattern: "*.tmp", enabled: true, comment: "" }],
    });
    expect(renderMultiLine(buildArgv(spec), { shell: "posix" })).toBe(
      [
        "rsync \\",
        "  -a \\",
        "  --exclude '*.tmp' \\",
        "  /home/me/photos/ \\",
        "  /backup/photos",
      ].join("\n"),
    );
  });

  it("uses a backtick continuation for PowerShell", () => {
    const spec = localToLocal({ shell: "powershell", flags: { archive: true } });
    expect(renderMultiLine(buildArgv(spec), { shell: "powershell" })).toBe(
      ["rsync `", "  -a `", "  /home/me/photos/ `", "  /backup/photos"].join("\n"),
    );
  });
});
