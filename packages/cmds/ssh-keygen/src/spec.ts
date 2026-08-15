import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/** -t. ed25519 is the modern, safe default — small, fast, and immune to the bit-length questions rsa/ecdsa raise. */
export const SshKeygenKeyType = z.enum(["rsa", "ed25519", "ecdsa"]);
export type SshKeygenKeyType = z.infer<typeof SshKeygenKeyType>;

export const SshKeygenSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  keyType: SshKeygenKeyType.default("ed25519"),
  /** -b. String, not number — kept as free text like other size-ish fields in this app; only meaningful for rsa/ecdsa. Empty means "let ssh-keygen pick its own default". */
  bits: z.string().default(""),
  /** -f. Where to write the new key pair, or which private key file to read from when exportPublicKey (-y) is set. Empty means "ssh-keygen's own default location/prompt". */
  outputFile: z.string().default(""),
  /** -C. Empty means no comment is set explicitly. */
  comment: z.string().default(""),
  /**
   * Whether to pass -N at all. Kept as its own boolean (rather than inferring
   * "set" from `passphrase !== ""`) because an explicitly empty passphrase
   * (-N '') is a real, meaningful, and different state from not passing -N at
   * all: omitting -N makes ssh-keygen prompt interactively; passing -N ''
   * creates a key with NO passphrase, silently, right now.
   */
  setPassphrase: z.boolean().default(false),
  /** Only rendered when `setPassphrase` is true. Empty is a real, valid (if risky) value here — see SKG001. */
  passphrase: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — ssh-keygen is a genuinely single-platform (Linux) entry
   * in this generator. Kept only so the shared render pipeline has a
   * `ShellDialect` to quote with. The UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type SshKeygenSpec = z.infer<typeof SshKeygenSpec>;
