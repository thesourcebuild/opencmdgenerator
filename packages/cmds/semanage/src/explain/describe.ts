import type { SemanageObjectType, SemanageSpec } from "../spec";

const OBJECT_LABEL: Record<SemanageObjectType, string> = {
  fcontext: "file context rule",
  port: "port label",
};

const PLACEHOLDER: Record<SemanageObjectType, string> = {
  fcontext: "SOME_PATH_PATTERN",
  port: "SOME_PORT/PROTO",
};

/**
 * Real semanage's full subcommand surface is much larger than this — it also
 * covers login, user, boolean, module, interface, node, dontaudit, and more,
 * each with its own further options. This app deliberately scopes down to
 * just fcontext and port, the two most common object types in everyday
 * sysadmin use, and says so explicitly here rather than silently pretending
 * to be a complete semanage — same "be upfront about the scope limit"
 * precedent as this app's git support explicitly limiting itself to 10
 * categories rather than every git subcommand.
 */
const SCOPE_NOTE = "(Scoped to semanage's two most common object types — fcontext and port; its full surface also covers users, logins, booleans, modules, and more.)";

export function describeSpec(spec: SemanageSpec): string {
  const target = spec.target.trim() || PLACEHOLDER[spec.objectType];
  const type = spec.type.trim();

  let sentence: string;
  switch (spec.action) {
    case "list":
      sentence = `List every ${OBJECT_LABEL[spec.objectType]}.`;
      break;
    case "delete":
      sentence = `Delete the ${OBJECT_LABEL[spec.objectType]} for ${target}.`;
      break;
    case "modify":
      sentence = `Modify the ${OBJECT_LABEL[spec.objectType]} for ${target}${type !== "" ? ` to type '${type}'` : ""}.`;
      break;
    case "add":
    default:
      sentence = `Add a ${OBJECT_LABEL[spec.objectType]} for ${target}${type !== "" ? ` with type '${type}'` : ""}.`;
      break;
  }

  return `${sentence} ${SCOPE_NOTE}`;
}
