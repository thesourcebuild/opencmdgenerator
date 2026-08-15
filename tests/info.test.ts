import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type InfoSpec } from "@cmdgen/info";

const line = (spec: InfoSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<InfoSpec> = {}): InfoSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("topic and flags", () => {
  it("a bare info with no topic", () => {
    expect(line(spec())).toBe("info");
  });

  it("a bare topic with no flags", () => {
    expect(line(spec({ topic: "gcc" }))).toBe("info gcc");
  });

  it("renders -w with a topic", () => {
    expect(line(spec({ topic: "gcc", flags: { where: true } }))).toBe("info -w gcc");
  });

  it("renders -w with no topic", () => {
    expect(line(spec({ flags: { where: true } }))).toBe("info -w");
  });

  it("trims the topic", () => {
    expect(line(spec({ topic: "  gcc  " }))).toBe("info gcc");
  });
});

describe("lint", () => {
  it("never has any diagnostics — a bare info is valid, real usage", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
    expect(lint(spec({ topic: "gcc" })).diagnostics).toEqual([]);
    expect(lint(spec({ flags: { where: true } })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Browse a topic' is a bare info with a topic", () => {
    expect(line(getPreset("browse-a-topic")!.apply(spec()))).toBe("info gcc");
  });

  it("'Find a topic's file location' is -w", () => {
    expect(line(getPreset("locate-a-topic")!.apply(spec()))).toBe("info -w gcc");
  });

  it("'Browse the top-level directory' is a bare info", () => {
    expect(line(getPreset("browse-the-directory")!.apply(spec({ topic: "gcc" })))).toBe("info");
  });
});

describe("describeSpec", () => {
  it("describes an empty topic", () => {
    expect(describeSpec(spec())).toBe("Open the top-level Info directory to browse.");
  });

  it("describes a topic", () => {
    expect(describeSpec(spec({ topic: "gcc" }))).toBe("Display the Info node for gcc.");
  });

  it("describes -w with a topic", () => {
    expect(describeSpec(spec({ topic: "gcc", flags: { where: true } }))).toBe(
      "Print the file location of the Info node for gcc instead of displaying it.",
    );
  });

  it("describes -w with no topic", () => {
    expect(describeSpec(spec({ flags: { where: true } }))).toBe(
      "Print the file location of the top-level Info directory node instead of displaying it.",
    );
  });
});
