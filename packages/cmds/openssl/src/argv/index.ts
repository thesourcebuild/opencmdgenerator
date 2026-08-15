import type { Arg, Argv } from "@cmdgen/engine";
import type { OpensslSpec } from "../spec";
import { buildVerifyArgv } from "./verify";
import { buildEncArgv, buildPkeyutlArgv, buildRsautlArgv } from "./enc";
import { buildDgstArgv, buildMacArgv } from "./digest";
import {
  buildDhparamArgv,
  buildDsaArgv,
  buildDsaparamArgv,
  buildEcArgv,
  buildEcparamArgv,
  buildGendsaArgv,
  buildGenpkeyArgv,
  buildGenrsaArgv,
  buildPkeyArgv,
  buildPkeyparamArgv,
  buildRsaArgv,
} from "./keygen";
import { buildCaArgv, buildCrl2pkcs7Argv, buildCrlArgv, buildReqArgv, buildX509Argv } from "./cert";
import { buildKdfArgv, buildPasswdArgv, buildPkcs12Argv, buildPkcs7Argv, buildPkcs8Argv } from "./pkcs";
import { buildPrimeArgv, buildRandArgv, buildSClientArgv, buildSServerArgv, buildSTimeArgv, buildSessIdArgv } from "./tls";
import { buildCmpArgv, buildCmsArgv, buildEchArgv, buildFipsinstallArgv, buildOcspArgv, buildTsArgv } from "./pki";
import { buildConfigutlArgv, buildSkeyutlArgv, buildSmimeArgv, buildSpkacArgv, buildSrpArgv, buildStoreutlArgv } from "./smime";
import {
  buildAsn1parseArgv,
  buildCiphersArgv,
  buildErrstrArgv,
  buildHelpArgv,
  buildInfoArgv,
  buildListArgv,
  buildNseqArgv,
  buildRehashArgv,
  buildVersionArgv,
} from "./diag";

export type { Arg, Argv };

/**
 * Top-level dispatch on `spec.subcommand`, delegating to one `argv/<category>.ts`
 * function per subcommand — each producing real openssl argv shape (leading
 * subcommand token handled here, everything after it produced by the
 * delegate). Mirrors `@cmdgen/git`'s `argv/index.ts`.
 */
export function buildArgv(spec: OpensslSpec): Argv {
  const args: Arg[] = [{ text: spec.subcommand, role: "value" }];

  switch (spec.subcommand) {
    case "genrsa":
      args.push(...buildGenrsaArgv(spec));
      break;
    case "genpkey":
      args.push(...buildGenpkeyArgv(spec));
      break;
    case "gendsa":
      args.push(...buildGendsaArgv(spec));
      break;
    case "rsa":
      args.push(...buildRsaArgv(spec));
      break;
    case "dsa":
      args.push(...buildDsaArgv(spec));
      break;
    case "ec":
      args.push(...buildEcArgv(spec));
      break;
    case "pkey":
      args.push(...buildPkeyArgv(spec));
      break;
    case "dhparam":
      args.push(...buildDhparamArgv(spec));
      break;
    case "ecparam":
      args.push(...buildEcparamArgv(spec));
      break;
    case "dsaparam":
      args.push(...buildDsaparamArgv(spec));
      break;
    case "pkeyparam":
      args.push(...buildPkeyparamArgv(spec));
      break;
    case "req":
      args.push(...buildReqArgv(spec));
      break;
    case "ca":
      args.push(...buildCaArgv(spec));
      break;
    case "x509":
      args.push(...buildX509Argv(spec));
      break;
    case "crl":
      args.push(...buildCrlArgv(spec));
      break;
    case "crl2pkcs7":
      args.push(...buildCrl2pkcs7Argv(spec));
      break;
    case "verify":
      args.push(...buildVerifyArgv(spec));
      break;
    case "enc":
      args.push(...buildEncArgv(spec));
      break;
    case "rsautl":
      args.push(...buildRsautlArgv(spec));
      break;
    case "pkeyutl":
      args.push(...buildPkeyutlArgv(spec));
      break;
    case "dgst":
      args.push(...buildDgstArgv(spec));
      break;
    case "mac":
      args.push(...buildMacArgv(spec));
      break;
    case "pkcs12":
      args.push(...buildPkcs12Argv(spec));
      break;
    case "pkcs7":
      args.push(...buildPkcs7Argv(spec));
      break;
    case "pkcs8":
      args.push(...buildPkcs8Argv(spec));
      break;
    case "passwd":
      args.push(...buildPasswdArgv(spec));
      break;
    case "kdf":
      args.push(...buildKdfArgv(spec));
      break;
    case "rand":
      args.push(...buildRandArgv(spec));
      break;
    case "prime":
      args.push(...buildPrimeArgv(spec));
      break;
    case "s_client":
      args.push(...buildSClientArgv(spec));
      break;
    case "s_server":
      args.push(...buildSServerArgv(spec));
      break;
    case "s_time":
      args.push(...buildSTimeArgv(spec));
      break;
    case "sess_id":
      args.push(...buildSessIdArgv(spec));
      break;
    case "ocsp":
      args.push(...buildOcspArgv(spec));
      break;
    case "ts":
      args.push(...buildTsArgv(spec));
      break;
    case "cmp":
      args.push(...buildCmpArgv(spec));
      break;
    case "cms":
      args.push(...buildCmsArgv(spec));
      break;
    case "smime":
      args.push(...buildSmimeArgv(spec));
      break;
    case "spkac":
      args.push(...buildSpkacArgv(spec));
      break;
    case "srp":
      args.push(...buildSrpArgv(spec));
      break;
    case "storeutl":
      args.push(...buildStoreutlArgv(spec));
      break;
    case "skeyutl":
      args.push(...buildSkeyutlArgv(spec));
      break;
    case "configutl":
      args.push(...buildConfigutlArgv(spec));
      break;
    case "asn1parse":
      args.push(...buildAsn1parseArgv(spec));
      break;
    case "ciphers":
      args.push(...buildCiphersArgv(spec));
      break;
    case "errstr":
      args.push(...buildErrstrArgv(spec));
      break;
    case "info":
      args.push(...buildInfoArgv(spec));
      break;
    case "list":
      args.push(...buildListArgv(spec));
      break;
    case "version":
      args.push(...buildVersionArgv(spec));
      break;
    case "help":
      args.push(...buildHelpArgv(spec));
      break;
    case "rehash":
      args.push(...buildRehashArgv(spec));
      break;
    case "nseq":
      args.push(...buildNseqArgv(spec));
      break;
    case "fipsinstall":
      args.push(...buildFipsinstallArgv(spec));
      break;
    case "ech":
      args.push(...buildEchArgv(spec));
      break;
  }

  return { binary: "openssl", args };
}
