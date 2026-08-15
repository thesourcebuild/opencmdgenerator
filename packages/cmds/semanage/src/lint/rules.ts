import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { SemanageSpec } from "../spec";
import { splitPortTarget } from "../argv";

const noTarget: LintRule<SemanageSpec> = {
  code: "SEM001",
  check(spec) {
    if (spec.action === "list" || spec.target.trim() !== "") return [];
    const diagnostic: Diagnostic<SemanageSpec> = {
      code: "SEM001",
      level: "error",
      message: spec.objectType === "port" ? "No port given." : "No file context pattern given.",
      field: "target",
    };
    return [diagnostic];
  },
};

/**
 * Real semanage requires `-t <type>` for both add and modify — without it,
 * the tool rejects the invocation outright. delete and list never use
 * `type`, so this only fires for the two actions where it matters.
 */
const noTypeForAddOrModify: LintRule<SemanageSpec> = {
  code: "SEM002",
  check(spec) {
    if (spec.action !== "add" && spec.action !== "modify") return [];
    if (spec.type.trim() !== "") return [];
    const diagnostic: Diagnostic<SemanageSpec> = {
      code: "SEM002",
      level: "error",
      message: `No SELinux type given — ${spec.action} requires -t.`,
      field: "type",
    };
    return [diagnostic];
  },
};

/**
 * A `port` target needs an explicit protocol — real `semanage port` always
 * requires `-p tcp` or `-p udp` alongside the port number. No mechanical
 * `fix`: picking tcp vs. udp is a real decision this app can't make for the
 * user, same reasoning as `@cmdgen/iptables`'s `IPTABLES001`.
 */
const portTargetMissingProtocol: LintRule<SemanageSpec> = {
  code: "SEM003",
  check(spec) {
    if (spec.objectType !== "port" || spec.action === "list") return [];
    const target = spec.target.trim();
    if (target === "") return []; // SEM001 already covers this case.
    const { proto } = splitPortTarget(target);
    if (proto !== "") return [];
    const diagnostic: Diagnostic<SemanageSpec> = {
      code: "SEM003",
      level: "error",
      message: `"${target}" is missing a protocol — semanage port needs a PORT/PROTO pair, e.g. "8080/tcp".`,
      field: "target",
    };
    return [diagnostic];
  },
};

/**
 * Deleting a policy customization can affect any running service that
 * depended on it (a port no longer labeled for a daemon to bind, a path no
 * longer labeled for a service to read/write) — always fires, with no
 * `fix`, same reasoning as `@cmdgen/rm`'s `alwaysIrreversible`: this is
 * purely informational, since removing the rule is the whole point of a
 * delete action.
 */
const deleteRemovesPolicyCustomization: LintRule<SemanageSpec> = {
  code: "SEM004",
  check(spec) {
    if (spec.action !== "delete") return [];
    const diagnostic: Diagnostic<SemanageSpec> = {
      code: "SEM004",
      level: "destructive",
      message: "This removes a SELinux policy customization, which may affect any running service that depended on it.",
      detail:
        spec.objectType === "port"
          ? "A daemon that binds this port under this label may start being denied by SELinux once the custom rule is gone."
          : "Files under this path lose their custom label and fall back to the default context, which may deny a service that expected the customization.",
      field: "target",
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<SemanageSpec>[] = [
  noTarget,
  noTypeForAddOrModify,
  portTargetMissingProtocol,
  deleteRemovesPolicyCustomization,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
