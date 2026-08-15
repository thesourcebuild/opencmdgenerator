import { describe, expect, it } from "vitest";
import { buildArgv, createSpec, describeSpec, getPreset, lint, renderOneLine, type CrontabSpec } from "@cmdgen/crontab";

const line = (spec: CrontabSpec) => renderOneLine(buildArgv(spec), { shell: spec.shell });

const spec = (partial: Partial<CrontabSpec> = {}): CrontabSpec => ({
  ...createSpec({ id: "test-spec" }),
  ...partial,
});

describe("action/user rendering", () => {
  it("renders the list action (also the default)", () => {
    expect(line(spec({ action: "list" }))).toBe("crontab -l");
    expect(line(spec())).toBe("crontab -l");
  });

  it("renders the edit action", () => {
    expect(line(spec({ action: "edit" }))).toBe("crontab -e");
  });

  it("renders the remove action", () => {
    expect(line(spec({ action: "remove" }))).toBe("crontab -r");
  });

  it("renders -u user before the action flag", () => {
    expect(line(spec({ action: "list", user: "alice" }))).toBe("crontab -u alice -l");
    expect(line(spec({ action: "remove", user: "alice" }))).toBe("crontab -u alice -r");
  });

  it("trims whitespace from user, and omits -u entirely when blank", () => {
    expect(line(spec({ action: "list", user: "  alice  " }))).toBe("crontab -u alice -l");
    expect(line(spec({ action: "list", user: "   " }))).toBe("crontab -l");
  });
});

describe("lint", () => {
  it("CRN001 fires for remove, and is destructive", () => {
    const s = spec({ action: "remove" });
    expect(lint(s).diagnostics.map((d) => d.code)).toContain("CRN001");
    expect(lint(s).isDestructive).toBe(true);
  });

  it("CRN001 does not fire for list or edit", () => {
    expect(lint(spec({ action: "list" })).diagnostics.map((d) => d.code)).not.toContain("CRN001");
    expect(lint(spec({ action: "edit" })).diagnostics.map((d) => d.code)).not.toContain("CRN001");
  });

  it("CRN001's fix switches the action to 'list'", () => {
    const s = spec({ action: "remove" });
    const fix = lint(s).diagnostics.find((d) => d.code === "CRN001")!.fix!;
    expect(fix.apply(s).action).toBe("list");
    expect(lint(fix.apply(s)).diagnostics.map((d) => d.code)).not.toContain("CRN001");
  });

  it("a plain list has no diagnostics", () => {
    expect(lint(spec({ action: "list" })).diagnostics).toEqual([]);
  });
});

describe("presets", () => {
  it("'List current user's crontab' is crontab -l", () => {
    expect(line(getPreset("list-current-crontab")!.apply(spec()))).toBe("crontab -l");
  });

  it("'Edit current user's crontab' is crontab -e", () => {
    expect(line(getPreset("edit-current-crontab")!.apply(spec()))).toBe("crontab -e");
  });

  it("'Remove entire crontab' is crontab -r and is flagged destructive", () => {
    const s = getPreset("remove-current-crontab")!.apply(spec());
    expect(line(s)).toBe("crontab -r");
    expect(lint(s).isDestructive).toBe(true);
  });

  it("'List another user's crontab' is crontab -u alice -l", () => {
    expect(line(getPreset("list-another-users-crontab")!.apply(spec()))).toBe("crontab -u alice -l");
  });
});

describe("describeSpec", () => {
  it("describes list for the current user", () => {
    expect(describeSpec(spec({ action: "list" }))).toBe("List the current user's crontab.");
  });

  it("describes edit", () => {
    expect(describeSpec(spec({ action: "edit" }))).toBe("Open the current user's crontab in an editor.");
  });

  it("describes remove", () => {
    expect(describeSpec(spec({ action: "remove" }))).toBe(
      "Remove the current user's entire crontab, wiping every scheduled job.",
    );
  });

  it("describes a specific user's crontab", () => {
    expect(describeSpec(spec({ action: "list", user: "alice" }))).toBe("List alice's crontab.");
  });
});
