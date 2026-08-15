import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type TagFlagDef = FlagDefGeneric<FlagGroup>;

/**
 * `action` (create/delete/list/verify) is a dedicated spec field, not a flag
 * — same reasoning as `reset`'s `mode` and `tar`'s `mode`. Flags below are
 * gated to the action(s) they are real for via `availableOn`, the same
 * mechanism `tar` uses for its GNU-vs-bsd split (see `../../tar/src/catalogue/flags.ts`),
 * just keyed on `action` instead of a variant.
 */
export const TAG_FLAGS: readonly TagFlagDef[] = [
  {
    id: "annotate",
    short: "-a",
    preferShort: true,
    long: "--annotate",
    group: "options",
    kind: "boolean",
    availableOn: ["create"],
    summary: "Create an annotated tag instead of a lightweight one.",
    detail:
      "An annotated tag is a real object in the git database carrying a tagger name, date and message; a lightweight tag is just a pointer. Prefer annotated for anything you intend to keep or share.",
    order: 10,
  },
  {
    id: "sign",
    short: "-s",
    preferShort: true,
    long: "--sign",
    group: "options",
    kind: "boolean",
    availableOn: ["create"],
    summary: "GPG-sign the tag.",
    detail: "Produces a signature that can be checked later with git tag -v. Requires a configured signing key.",
    order: 20,
  },
  {
    id: "localUser",
    short: "-u",
    preferShort: true,
    long: "--local-user",
    group: "options",
    kind: "text",
    requires: ["sign"],
    availableOn: ["create"],
    arg: { placeholder: "keyid", separator: " " },
    summary: "Sign with this key instead of the configured default.",
    detail: "Only meaningful together with Sign — selects which GPG key produces the signature.",
    order: 30,
  },
  {
    id: "force",
    short: "-f",
    preferShort: true,
    long: "--force",
    group: "options",
    kind: "boolean",
    danger: "destructive",
    availableOn: ["create"],
    summary: "Replace an existing tag's target instead of refusing.",
    detail:
      "Tags are meant to be immutable references. This silently overwrites what an existing tag name pointed to, which can confuse anyone who already fetched the old target.",
    order: 40,
  },
  {
    id: "cleanup",
    long: "--cleanup",
    group: "options",
    kind: "enum",
    availableOn: ["create"],
    options: [
      { value: "none", label: "Default (strip when a message is given)", renders: "" },
      { value: "strip", label: "strip — remove comments and trailing whitespace", renders: "--cleanup=strip" },
      { value: "verbatim", label: "verbatim — keep the message exactly as typed", renders: "--cleanup=verbatim" },
      { value: "whitespace", label: "whitespace — trim only leading/trailing whitespace", renders: "--cleanup=whitespace" },
    ],
    summary: "How the tag message is cleaned up before it is stored.",
    detail: "Same three modes git commit --cleanup supports. Rarely needed outside of scripted or templated tag messages.",
    order: 50,
  },
  {
    id: "file",
    short: "-F",
    preferShort: true,
    long: "--file",
    group: "options",
    kind: "path",
    availableOn: ["create"],
    arg: { placeholder: "message.txt", separator: " " },
    summary: "Read the tag message from this file instead of typing one.",
    detail:
      "Real git only uses one message source at a time — setting this alongside the Message field above is redundant; the field takes precedence here.",
    order: 60,
  },
  {
    id: "sort",
    long: "--sort",
    group: "options",
    kind: "text",
    availableOn: ["list"],
    arg: { placeholder: "-version:refname", separator: "=" },
    summary: "Sort the listed tags by this key instead of alphabetically.",
    detail: "Common choices: version:refname for semver-aware ordering, creatordate for chronological, with a leading - to reverse.",
    order: 70,
  },
  {
    id: "contains",
    long: "--contains",
    group: "options",
    kind: "text",
    availableOn: ["list"],
    arg: { placeholder: "<commit>", separator: " " },
    summary: "Only list tags that contain this commit.",
    detail: "Useful for finding which released version first included a given commit.",
    order: 80,
  },
  {
    id: "pointsAt",
    long: "--points-at",
    group: "options",
    kind: "text",
    availableOn: ["list"],
    arg: { placeholder: "<object>", separator: " " },
    summary: "Only list tags that point at this object.",
    detail: "Narrows the listing to tags pointing exactly at the given commit or object, rather than just containing it.",
    order: 90,
  },
] as const;
export const TAG_CATALOGUE = createFlagCatalogue<FlagGroup>(TAG_FLAGS);
