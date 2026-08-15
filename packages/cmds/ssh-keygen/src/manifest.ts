import type { CommandManifest } from "@cmdgen/engine";

export const SSH_KEYGEN_MANIFEST: CommandManifest = {
  id: "ssh-keygen",
  label: "ssh-keygen",
  category: "Network",
  tags: ["Network", "SSH", "Keys"],
  summary: "Generate a new SSH key pair, or export the public key from an existing private key. Purely local — never connects anywhere.",
  platforms: ["linux"],
  shells: ["posix"],
};
