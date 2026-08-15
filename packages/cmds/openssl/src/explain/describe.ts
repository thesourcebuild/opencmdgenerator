import type { OpensslSpec } from "../spec";

function capitalize(value: string): string {
  return value.length === 0 ? value : value.charAt(0).toUpperCase() + value.slice(1);
}

export function describeSpec(spec: OpensslSpec): string {
  switch (spec.subcommand) {
    case "genrsa":
      return `Generate a new ${spec.bits}-bit RSA private key${spec.outputFile.trim() ? ` to ${spec.outputFile.trim()}` : ""}.`;
    case "genpkey":
      return `Generate a new ${spec.algorithm} private key${spec.outputFile.trim() ? ` to ${spec.outputFile.trim()}` : ""}.`;
    case "gendsa":
      return `Generate a new DSA private key from ${spec.paramFile.trim() || "SOME_PARAM_FILE"}.`;
    case "rsa":
      return `Process the RSA key in ${spec.inFile.trim() || "SOME_KEY_FILE"}.`;
    case "dsa":
      return `Process the DSA key in ${spec.inFile.trim() || "SOME_KEY_FILE"}.`;
    case "ec":
      return `Process the EC key in ${spec.inFile.trim() || "SOME_KEY_FILE"}.`;
    case "pkey":
      return `Process the key in ${spec.inFile.trim() || "SOME_KEY_FILE"}.`;
    case "dhparam":
      return `Generate ${spec.bits}-bit Diffie-Hellman parameters.`;
    case "ecparam":
      return `Work with EC parameters for curve ${spec.curveName.trim() || "SOME_CURVE"}.`;
    case "dsaparam":
      return `Generate ${spec.bits}-bit DSA parameters.`;
    case "pkeyparam":
      return `Process the key parameters in ${spec.inFile.trim() || "SOME_PARAM_FILE"}.`;
    case "req":
      return spec.subject.trim()
        ? `Create a certificate signing request for ${spec.subject.trim()}.`
        : "Create a certificate signing request.";
    case "ca":
      return `Sign the certificate request in ${spec.inFile.trim() || "SOME_CSR"} as a CA.`;
    case "x509":
      return `Process the certificate in ${spec.inFile.trim() || "SOME_CERT"}.`;
    case "crl":
      return `Process the certificate revocation list in ${spec.inFile.trim() || "SOME_CRL"}.`;
    case "crl2pkcs7":
      return `Bundle ${spec.crlFile.trim() || "a CRL"} and certificates into a PKCS#7 file.`;
    case "verify":
      return `Verify ${spec.certFiles.length > 0 ? spec.certFiles.join(", ") : "a certificate"} against a trust chain.`;
    case "enc":
      return spec.inputMode === "text"
        ? `${spec.cipher || "Encrypt/decrypt"} ${spec.text.trim() || "input"} (piped in as stdin).`
        : `${spec.cipher || "Encrypt/decrypt"} ${spec.inFile.trim() || "input"}.`;
    case "rsautl":
      return `Perform an RSA operation on ${spec.inFile.trim() || "input"} using ${spec.keyFile.trim() || "SOME_KEY"}.`;
    case "pkeyutl":
      return `Perform a public-key operation on ${spec.inFile.trim() || "input"} using ${spec.keyFile.trim() || "SOME_KEY"}.`;
    case "dgst":
      return `Compute the ${spec.algorithm || "digest"} hash of ${spec.files.length > 0 ? spec.files.join(", ") : "input"}.`;
    case "mac":
      return `Compute a ${spec.macType} over ${spec.inFile.trim() || "input"}.`;
    case "pkcs12":
      return "Package or extract a PKCS#12 (.p12/.pfx) container.";
    case "pkcs7":
      return `Process the PKCS#7 file ${spec.inFile.trim() || "SOME_FILE"}.`;
    case "pkcs8":
      return `Process the PKCS#8 key in ${spec.inFile.trim() || "SOME_KEY"}.`;
    case "passwd":
      return "Hash one or more passwords.";
    case "kdf":
      return `Derive a ${spec.keyLength}-byte key using ${spec.kdfName}.`;
    case "rand":
      return `Generate ${spec.numBytes} random bytes.`;
    case "prime":
      return spec.number.trim() ? `Check whether ${spec.number.trim()} is prime.` : "Check or generate a prime number.";
    case "s_client":
      return `Open a diagnostic TLS connection to ${spec.connectTarget.trim() || "SOME_HOST:PORT"}.`;
    case "s_server":
      return `Run a diagnostic TLS server on ${spec.acceptPort.trim() || "the default port"}.`;
    case "s_time":
      return `Benchmark TLS connection time to ${spec.connectTarget.trim() || "SOME_HOST:PORT"}.`;
    case "sess_id":
      return `Process the TLS session in ${spec.inFile.trim() || "SOME_SESSION_FILE"}.`;
    case "ocsp":
      return `Check certificate revocation status via OCSP${spec.url.trim() ? ` against ${spec.url.trim()}` : ""}.`;
    case "ts":
      return `${spec.action === "query" ? "Create a timestamp request for" : spec.action === "reply" ? "Create a timestamp reply for" : "Verify the timestamp on"} ${spec.inFile.trim() || "SOME_FILE"}.`;
    case "cmp":
      return `Speak the Certificate Management Protocol with ${spec.server.trim() || "SOME_SERVER"}.`;
    case "cms":
      return `${capitalize(spec.action)} ${spec.inFile.trim() || "input"} as CMS.`;
    case "smime":
      return `${capitalize(spec.action)} ${spec.inFile.trim() || "input"} as S/MIME.`;
    case "spkac":
      return "Process a signed public key and challenge (SPKAC).";
    case "srp":
      return `Manage the SRP entry for ${spec.username.trim() || "SOME_USER"}.`;
    case "storeutl":
      return `List objects from ${spec.uri.trim() || "SOME_URI"}.`;
    case "skeyutl":
      return "Manage an opaque symmetric key.";
    case "configutl":
      return `Validate the config file ${spec.configFile.trim() || "SOME_CONFIG"}.`;
    case "asn1parse":
      return `Parse the ASN.1 structure of ${spec.inFile.trim() || "input"}.`;
    case "ciphers":
      return `List ciphers matching "${spec.filter}".`;
    case "errstr":
      return `Decode the OpenSSL error code ${spec.errorCode.trim() || "SOME_CODE"}.`;
    case "info":
      return spec.query.trim() ? `Print openssl's ${spec.query.trim()} configuration value.` : "Print openssl build/configuration information.";
    case "list":
      return `List openssl's ${spec.what}.`;
    case "version":
      return "Print the openssl version.";
    case "help":
      return spec.topic.trim() ? `Show help for ${spec.topic.trim()}.` : "Show top-level openssl help.";
    case "rehash":
      return `Rebuild the certificate hash symlinks in ${spec.dir.trim() || "the default directory"}.`;
    case "nseq":
      return `Convert the Netscape certificate sequence in ${spec.inFile.trim() || "SOME_FILE"}.`;
    case "fipsinstall":
      return "Install and self-test the FIPS provider.";
    case "ech":
      return `Generate Encrypted Client Hello (ECH) keys/config${spec.publicName.trim() ? ` for ${spec.publicName.trim()}` : ""}.`;
  }
}
