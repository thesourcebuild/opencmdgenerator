import { describe, expect, it } from "vitest";
import {
  buildArgv,
  createSpec,
  describeSpec,
  getPreset,
  lint,
  renderOneLine,
  type ChrootSpec,
} from "@cmdgen/chroot";

const line = (spec: ChrootSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });
const spec = (partial: Partial<ChrootSpec> = {}): ChrootSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("chroot", () => {
  it("renders a bare command", () => {
    expect(line(spec())).toBe("chroot");
  });
  it("renders arguments after flags", () => {
    expect(line(spec({ args: ["alpha", "beta"] }))).toBe("chroot alpha beta");
  });
  it("has no default lint diagnostics", () => {
    expect(lint(spec()).diagnostics).toEqual([]);
  });
  it("describes the command", () => {
    expect(describeSpec(spec())).toContain("Run commands with a changed root directory");
  });
  it("preset shell", () => {
    expect(line(getPreset("shell")!.apply(spec()))).toBe("chroot /mnt /bin/bash");
  });
  it("preset as-user", () => {
    expect(line(getPreset("as-user")!.apply(spec()))).toBe(
      "chroot --userspec 1000:1000 /mnt /bin/bash",
    );
  });
});
