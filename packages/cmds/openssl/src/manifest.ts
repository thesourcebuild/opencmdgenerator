import type { CommandManifest } from "@cmdgen/engine";

export const OPENSSL_MANIFEST: CommandManifest = {
  id: "openssl",
  label: "openssl",
  category: "Cryptography",
  tags: ["openssl", "tls", "ssl", "crypto", "certificate", "encrypt", "hash", "key"],
  summary: "Generate keys and certificates, encrypt/decrypt, hash, and test TLS connections.",
  platforms: ["linux", "darwin", "win32"],
  // openssl.exe is a real cross-platform binary — bundled with Git for
  // Windows and natively packaged on Linux/macOS — and works identically
  // from cmd.exe and PowerShell, same justification as curl/tar/git's shells list.
  shells: ["posix", "cmd", "powershell"],
};
