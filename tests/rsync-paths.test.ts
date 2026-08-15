import { describe, expect, it } from "vitest";
import { isWithin, normalisePath, toRsyncPath } from "@cmdgen/rsync";

/**
 * Windows has no native rsync, so a drive-letter path has to be rewritten for
 * whichever build will run the command. Getting the flavour wrong produces a
 * command that fails, or worse, one that targets the wrong location.
 */

describe("Windows drive translation", () => {
  const cases: [string, string, string, string][] = [
    // input, cygwin, msys, wsl
    ["C:\\Data\\Photos", "/cygdrive/c/Data/Photos", "/c/Data/Photos", "/mnt/c/Data/Photos"],
    ["D:/Media", "/cygdrive/d/Media", "/d/Media", "/mnt/d/Media"],
    ["h:\\PX\\Manuals", "/cygdrive/h/PX/Manuals", "/h/PX/Manuals", "/mnt/h/PX/Manuals"],
  ];

  for (const [input, cygwin, msys, wsl] of cases) {
    it(`translates ${input}`, () => {
      expect(toRsyncPath(input, "cygwin")).toBe(cygwin);
      expect(toRsyncPath(input, "msys")).toBe(msys);
      expect(toRsyncPath(input, "wsl")).toBe(wsl);
    });
  }

  it("passes POSIX paths through untouched for every flavour", () => {
    for (const flavor of ["unix", "cygwin", "msys", "wsl"] as const) {
      expect(toRsyncPath("/home/me/photos", flavor)).toBe("/home/me/photos");
    }
  });

  it("never rewrites drive letters under the unix flavour", () => {
    expect(toRsyncPath("C:\\Data", "unix")).toBe("C:\\Data");
  });

  it("normalises UNC shares to forward slashes", () => {
    expect(toRsyncPath("\\\\nas\\media\\films", "cygwin")).toBe("//nas/media/films");
  });

  it("converts backslashes in relative Windows paths", () => {
    expect(toRsyncPath("sub\\dir", "msys")).toBe("sub/dir");
  });
});

describe("normalisePath", () => {
  it("strips trailing separators so semantics live in contentsOnly", () => {
    expect(normalisePath("/home/me/photos/")).toBe("/home/me/photos");
    expect(normalisePath("C:\\Data\\")).toBe("C:\\Data");
    expect(normalisePath("/home/me/photos///")).toBe("/home/me/photos");
  });

  it("preserves the filesystem root", () => {
    expect(normalisePath("/")).toBe("/");
  });
});

describe("isWithin", () => {
  it("detects a destination nested in the source", () => {
    expect(isWithin("/data", "/data/backup", "unix")).toBe(true);
  });

  it("does not treat sibling prefixes as nested", () => {
    expect(isWithin("/data", "/database", "unix")).toBe(false);
  });

  it("treats identical paths as nested", () => {
    expect(isWithin("/data", "/data/", "unix")).toBe(true);
  });

  it("compares across spellings of the same Windows location", () => {
    expect(isWithin("C:\\Data", "C:\\Data\\Backup", "cygwin")).toBe(true);
    expect(isWithin("c:\\data", "C:\\Data\\Backup", "cygwin")).toBe(true);
  });

  it("returns false for empty input", () => {
    expect(isWithin("", "/data", "unix")).toBe(false);
  });
});
