import type { CurlSpec } from "../spec";
import { flagBool, flagString, validUrls } from "../pure";

function methodOf(spec: CurlSpec): string {
  const explicit = flagString(spec, "request");
  if (explicit) return explicit.toUpperCase();
  if (flagBool(spec, "head")) return "HEAD";
  if (spec.dataEntries.some((e) => e.value.trim() !== "") || spec.formEntries.some((e) => e.value.trim() !== "")) return "POST";
  if (flagString(spec, "uploadFile")) return "PUT";
  return "GET";
}

function targetPhrase(spec: CurlSpec): string {
  const urls = validUrls(spec);
  if (urls.length === 0) return "no URL";
  if (urls.length === 1) return `"${urls[0]}"`;
  return `${urls.length} URLs`;
}

/**
 * SMTP has no HTTP-style method at all — `--upload-file` there supplies the
 * message body for a mail transaction, not a resource to PUT, so the
 * generic `methodOf`/"uploading" phrasing below would be actively
 * misleading ("PUT ... uploading email.txt" implies an HTTP semantic that
 * doesn't exist for mail). Described on its own terms instead.
 */
function smtpSendPhrase(spec: CurlSpec): string | undefined {
  if (!validUrls(spec).some((u) => /^smtps?:\/\//.test(u))) return undefined;
  const from = flagString(spec, "mailFrom");
  const rcpt = flagString(spec, "mailRcpt");
  if (!from && !rcpt) return undefined;
  const parts = ["Send an email"];
  if (from) parts.push(`from ${from}`);
  if (rcpt) parts.push(`to ${rcpt}`);
  return parts.join(" ");
}

/** A prose sentence describing what the command does — the primary confirmation surface for a request this complex. */
export function describeSpec(spec: CurlSpec): string {
  const parts: string[] = [smtpSendPhrase(spec) ?? `${methodOf(spec)} ${targetPhrase(spec)}`];

  const headerCount = spec.headers.map((h) => h.trim()).filter((h) => h !== "").length;
  if (headerCount > 0) parts.push(`sending ${headerCount} extra header${headerCount === 1 ? "" : "s"}`);

  const dataCount = spec.dataEntries.filter((e) => e.value.trim() !== "").length;
  if (dataCount > 0) parts.push(`with a ${dataCount > 1 ? `${dataCount}-part ` : ""}data body`);

  const formCount = spec.formEntries.filter((e) => e.value.trim() !== "").length;
  if (formCount > 0) parts.push(`with a ${formCount}-field multipart form`);

  const uploadFile = flagString(spec, "uploadFile");
  if (uploadFile) parts.push(`uploading "${uploadFile}"`);

  if (flagBool(spec, "location")) parts.push("following redirects");

  const user = flagString(spec, "user");
  if (user) parts.push(`authenticating as ${user.split(":")[0]}`);
  else if (flagBool(spec, "netrc") || flagBool(spec, "netrcOptional")) parts.push("authenticating via .netrc");

  const proxy = flagString(spec, "proxy");
  if (proxy) parts.push(`via proxy ${proxy}`);

  if (flagBool(spec, "insecure")) parts.push("without verifying the server's TLS certificate");

  const output = flagString(spec, "output");
  if (output) parts.push(`saving the response to "${output}"`);
  else if (flagBool(spec, "remoteName")) parts.push("saving under the remote file's own name");

  return `${parts.join(", ")}.`;
}
