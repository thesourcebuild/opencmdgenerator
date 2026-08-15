import type { CommandManifest } from "@cmdgen/engine";

export const FFMPEG_MANIFEST: CommandManifest = {
  id: "ffmpeg",
  label: "ffmpeg",
  category: "Media",
  tags: ["Media", "Video", "Audio", "Conversion"],
  summary: "Transcode, trim, or remux audio/video — a practical common subset of ffmpeg's enormous option surface.",
  platforms: ["darwin", "linux", "win32"],
  // Real ffmpeg is genuinely cross-platform (official static builds for all three) — same justification this repo already applies to curl/tar.
  shells: ["posix", "cmd", "powershell"],
};
