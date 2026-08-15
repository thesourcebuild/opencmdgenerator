import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type DdSpec } from "@cmdgen/dd";

const line = (spec: DdSpec) => renderOneLine(buildArgv(spec));

const spec = (partial: Partial<DdSpec> = {}): DdSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("operands", () => {
  it("a spec with nothing set renders a bare dd", () => {
    expect(line(spec())).toBe("dd");
  });

  it("renders if=/of= as attached KEY=VALUE tokens", () => {
    expect(line(spec({ inputFile: "/dev/sda", outputFile: "backup.img" }))).toBe("dd if=/dev/sda of=backup.img");
  });

  it("renders bs=, count=, skip=, conv=, status= after if=/of=, in that order", () => {
    expect(
      line(
        spec({
          inputFile: "input.img",
          outputFile: "output.img",
          blockSize: "512",
          count: "100",
          skip: "10",
          conv: "notrunc,noerror",
          status: "progress",
        }),
      ),
    ).toBe("dd if=input.img of=output.img bs=512 count=100 skip=10 conv=notrunc,noerror status=progress");
  });

  it("omits any field left empty", () => {
    expect(line(spec({ inputFile: "/dev/zero", outputFile: "/dev/sdb", blockSize: "1M" }))).toBe(
      "dd if=/dev/zero of=/dev/sdb bs=1M",
    );
  });

  it("trims whitespace from every field", () => {
    expect(line(spec({ inputFile: "  /dev/sda  ", outputFile: "  backup.img  " }))).toBe(
      "dd if=/dev/sda of=backup.img",
    );
  });

  it("quotes only the value half of an attached token when it needs quoting", () => {
    expect(line(spec({ inputFile: "/dev/sda", outputFile: "my backup.img" }))).toBe(
      "dd if=/dev/sda of='my backup.img'",
    );
  });
});

describe("lint", () => {
  it("DD001 catches an empty input file", () => {
    expect(lint(spec({ outputFile: "backup.img" })).diagnostics.map((d) => d.code)).toContain("DD001");
  });

  it("DD002 catches an empty output file", () => {
    expect(lint(spec({ inputFile: "/dev/sda" })).diagnostics.map((d) => d.code)).toContain("DD002");
  });

  it("DD003 warns when input and output are the same non-empty file", () => {
    const s = spec({ inputFile: "/dev/sda", outputFile: "/dev/sda" });
    const diagnostics = lint(s).diagnostics;
    expect(diagnostics.map((d) => d.code)).toContain("DD003");
    expect(diagnostics.find((d) => d.code === "DD003")!.level).toBe("warning");
  });

  it("DD003 does not fire when both are empty, or when they differ", () => {
    expect(lint(spec()).diagnostics.map((d) => d.code)).not.toContain("DD003");
    expect(
      lint(spec({ inputFile: "/dev/sda", outputFile: "backup.img" })).diagnostics.map((d) => d.code),
    ).not.toContain("DD003");
  });

  it("a fully specified, distinct if=/of= has no diagnostics", () => {
    expect(lint(spec({ inputFile: "/dev/sda", outputFile: "backup.img" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'Create a disk image'", () => {
    expect(line(getPreset("disk-image")!.apply(spec()))).toBe("dd if=/dev/sda of=backup.img bs=4M status=progress");
  });

  it("'Wipe a device with zeros'", () => {
    expect(line(getPreset("wipe-with-zeros")!.apply(spec()))).toBe("dd if=/dev/zero of=/dev/sdb bs=1M");
  });

  it("'Copy a fixed number of blocks'", () => {
    expect(line(getPreset("copy-n-blocks")!.apply(spec()))).toBe("dd if=input.img of=output.img bs=512 count=100");
  });
});

describe("describeSpec", () => {
  it("uses SOME_INPUT/SOME_OUTPUT placeholders when both are empty", () => {
    expect(describeSpec(spec())).toBe("Copy from SOME_INPUT to SOME_OUTPUT.");
  });

  it("describes the disk-image preset", () => {
    expect(describeSpec(getPreset("disk-image")!.apply(spec()))).toBe(
      "Copy from /dev/sda to backup.img, 4M at a time, showing progress.",
    );
  });

  it("mentions count, skip, and conv as trailing clauses", () => {
    const description = describeSpec(
      spec({
        inputFile: "input.img",
        outputFile: "output.img",
        blockSize: "512",
        count: "100",
        skip: "10",
        conv: "notrunc,noerror",
      }),
    );
    expect(description).toContain("skipping 10 block(s) of input first");
    expect(description).toContain("stopping after 100 block(s)");
    expect(description).toContain("converting with notrunc,noerror");
  });
});
