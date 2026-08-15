import type { FlagCatalogue } from "@cmdgen/engine";
import type { OpensslSubcommand } from "../spec";
import { VERIFY_CATALOGUE } from "./verify";
import { ENC_CATALOGUE, PKEYUTL_CATALOGUE, RSAUTL_CATALOGUE } from "./enc";
import { DGST_CATALOGUE, MAC_CATALOGUE } from "./digest";
import {
  DHPARAM_CATALOGUE,
  DSAPARAM_CATALOGUE,
  DSA_CATALOGUE,
  ECPARAM_CATALOGUE,
  EC_CATALOGUE,
  GENDSA_CATALOGUE,
  GENPKEY_CATALOGUE,
  GENRSA_CATALOGUE,
  PKEYPARAM_CATALOGUE,
  PKEY_CATALOGUE,
  RSA_CATALOGUE,
} from "./keygen";
import { CA_CATALOGUE, CRL2PKCS7_CATALOGUE, CRL_CATALOGUE, REQ_CATALOGUE, X509_CATALOGUE } from "./cert";
import { KDF_CATALOGUE, PASSWD_CATALOGUE, PKCS12_CATALOGUE, PKCS7_CATALOGUE, PKCS8_CATALOGUE } from "./pkcs";
import { PRIME_CATALOGUE, RAND_CATALOGUE, SESS_ID_CATALOGUE, S_CLIENT_CATALOGUE, S_SERVER_CATALOGUE, S_TIME_CATALOGUE } from "./tls";
import { CMP_CATALOGUE, CMS_CATALOGUE, ECH_CATALOGUE, FIPSINSTALL_CATALOGUE, OCSP_CATALOGUE, TS_CATALOGUE } from "./pki";
import {
  CONFIGUTL_CATALOGUE,
  SKEYUTL_CATALOGUE,
  SMIME_CATALOGUE,
  SPKAC_CATALOGUE,
  SRP_CATALOGUE,
  STOREUTL_CATALOGUE,
} from "./smime";
import {
  ASN1PARSE_CATALOGUE,
  CIPHERS_CATALOGUE,
  ERRSTR_CATALOGUE,
  HELP_CATALOGUE,
  INFO_CATALOGUE,
  LIST_CATALOGUE,
  NSEQ_CATALOGUE,
  REHASH_CATALOGUE,
  VERSION_CATALOGUE,
} from "./diag";

/**
 * Every openssl subcommand has its OWN small flag catalogue rather than one
 * flat catalogue with a 54-way `availableOn` tag — this is the one place
 * that maps `subcommand` to the right one, used by both `argv/index.ts` and
 * the UI's `<FlagsForm>` calls. Mirrors `@cmdgen/git`'s `catalogue/index.ts`.
 */
export function catalogueFor(subcommand: OpensslSubcommand): FlagCatalogue {
  switch (subcommand) {
    case "genrsa":
      return GENRSA_CATALOGUE;
    case "genpkey":
      return GENPKEY_CATALOGUE;
    case "gendsa":
      return GENDSA_CATALOGUE;
    case "rsa":
      return RSA_CATALOGUE;
    case "dsa":
      return DSA_CATALOGUE;
    case "ec":
      return EC_CATALOGUE;
    case "pkey":
      return PKEY_CATALOGUE;
    case "dhparam":
      return DHPARAM_CATALOGUE;
    case "ecparam":
      return ECPARAM_CATALOGUE;
    case "dsaparam":
      return DSAPARAM_CATALOGUE;
    case "pkeyparam":
      return PKEYPARAM_CATALOGUE;
    case "req":
      return REQ_CATALOGUE;
    case "ca":
      return CA_CATALOGUE;
    case "x509":
      return X509_CATALOGUE;
    case "crl":
      return CRL_CATALOGUE;
    case "crl2pkcs7":
      return CRL2PKCS7_CATALOGUE;
    case "verify":
      return VERIFY_CATALOGUE;
    case "enc":
      return ENC_CATALOGUE;
    case "rsautl":
      return RSAUTL_CATALOGUE;
    case "pkeyutl":
      return PKEYUTL_CATALOGUE;
    case "dgst":
      return DGST_CATALOGUE;
    case "mac":
      return MAC_CATALOGUE;
    case "pkcs12":
      return PKCS12_CATALOGUE;
    case "pkcs7":
      return PKCS7_CATALOGUE;
    case "pkcs8":
      return PKCS8_CATALOGUE;
    case "passwd":
      return PASSWD_CATALOGUE;
    case "kdf":
      return KDF_CATALOGUE;
    case "rand":
      return RAND_CATALOGUE;
    case "prime":
      return PRIME_CATALOGUE;
    case "s_client":
      return S_CLIENT_CATALOGUE;
    case "s_server":
      return S_SERVER_CATALOGUE;
    case "s_time":
      return S_TIME_CATALOGUE;
    case "sess_id":
      return SESS_ID_CATALOGUE;
    case "ocsp":
      return OCSP_CATALOGUE;
    case "ts":
      return TS_CATALOGUE;
    case "cmp":
      return CMP_CATALOGUE;
    case "cms":
      return CMS_CATALOGUE;
    case "smime":
      return SMIME_CATALOGUE;
    case "spkac":
      return SPKAC_CATALOGUE;
    case "srp":
      return SRP_CATALOGUE;
    case "storeutl":
      return STOREUTL_CATALOGUE;
    case "skeyutl":
      return SKEYUTL_CATALOGUE;
    case "configutl":
      return CONFIGUTL_CATALOGUE;
    case "asn1parse":
      return ASN1PARSE_CATALOGUE;
    case "ciphers":
      return CIPHERS_CATALOGUE;
    case "errstr":
      return ERRSTR_CATALOGUE;
    case "info":
      return INFO_CATALOGUE;
    case "list":
      return LIST_CATALOGUE;
    case "version":
      return VERSION_CATALOGUE;
    case "help":
      return HELP_CATALOGUE;
    case "rehash":
      return REHASH_CATALOGUE;
    case "nseq":
      return NSEQ_CATALOGUE;
    case "fipsinstall":
      return FIPSINSTALL_CATALOGUE;
    case "ech":
      return ECH_CATALOGUE;
  }
}
