export interface AlgorithmVariant {
  value: string;
  label: string;
}

export interface AlgorithmFamily {
  id: string;
  label: string;
  variants: readonly AlgorithmVariant[];
}

/** Real `openssl dgst`'s own "Message Digest commands" listing (`openssl help`), grouped by algorithm family. */
export const DIGEST_FAMILIES: readonly AlgorithmFamily[] = [
  {
    id: "sha2",
    label: "SHA-2",
    variants: [
      { value: "sha224", label: "SHA-224" },
      { value: "sha256", label: "SHA-256" },
      { value: "sha384", label: "SHA-384" },
      { value: "sha512", label: "SHA-512" },
      { value: "sha512-224", label: "SHA-512/224" },
      { value: "sha512-256", label: "SHA-512/256" },
    ],
  },
  {
    id: "sha3",
    label: "SHA-3",
    variants: [
      { value: "sha3-224", label: "SHA3-224" },
      { value: "sha3-256", label: "SHA3-256" },
      { value: "sha3-384", label: "SHA3-384" },
      { value: "sha3-512", label: "SHA3-512" },
    ],
  },
  {
    id: "sha1",
    label: "SHA-1",
    variants: [{ value: "sha1", label: "SHA-1" }],
  },
  {
    id: "shake",
    label: "SHAKE",
    variants: [
      { value: "shake128", label: "SHAKE128" },
      { value: "shake256", label: "SHAKE256" },
    ],
  },
  {
    id: "blake2",
    label: "BLAKE2",
    variants: [
      { value: "blake2b512", label: "BLAKE2b-512" },
      { value: "blake2s256", label: "BLAKE2s-256" },
    ],
  },
  {
    id: "md",
    label: "MD",
    variants: [
      { value: "md5", label: "MD5" },
      { value: "md4", label: "MD4" },
    ],
  },
  {
    id: "ripemd",
    label: "RIPEMD",
    variants: [{ value: "rmd160", label: "RIPEMD-160" }],
  },
  {
    id: "sm3",
    label: "SM3",
    variants: [{ value: "sm3", label: "SM3" }],
  },
  {
    id: "mdc2",
    label: "MDC2",
    variants: [{ value: "mdc2", label: "MDC2" }],
  },
];

/** Real `openssl enc`'s own "Cipher commands" listing (`openssl help`), grouped by cipher family. `base64` is deliberately excluded — it's not an encryption cipher, and this app already models it as enc's own `-a/--base64` catalogue flag. */
export const CIPHER_FAMILIES: readonly AlgorithmFamily[] = [
  {
    id: "aes",
    label: "AES",
    variants: [
      { value: "aes-128-cbc", label: "AES-128-CBC" },
      { value: "aes-128-ecb", label: "AES-128-ECB" },
      { value: "aes-192-cbc", label: "AES-192-CBC" },
      { value: "aes-192-ecb", label: "AES-192-ECB" },
      { value: "aes-256-cbc", label: "AES-256-CBC" },
      { value: "aes-256-ecb", label: "AES-256-ECB" },
    ],
  },
  {
    id: "aria",
    label: "ARIA",
    variants: [
      { value: "aria-128-cbc", label: "ARIA-128-CBC" },
      { value: "aria-128-cfb", label: "ARIA-128-CFB" },
      { value: "aria-128-cfb1", label: "ARIA-128-CFB1" },
      { value: "aria-128-cfb8", label: "ARIA-128-CFB8" },
      { value: "aria-128-ctr", label: "ARIA-128-CTR" },
      { value: "aria-128-ecb", label: "ARIA-128-ECB" },
      { value: "aria-128-ofb", label: "ARIA-128-OFB" },
      { value: "aria-192-cbc", label: "ARIA-192-CBC" },
      { value: "aria-192-cfb", label: "ARIA-192-CFB" },
      { value: "aria-192-cfb1", label: "ARIA-192-CFB1" },
      { value: "aria-192-cfb8", label: "ARIA-192-CFB8" },
      { value: "aria-192-ctr", label: "ARIA-192-CTR" },
      { value: "aria-192-ecb", label: "ARIA-192-ECB" },
      { value: "aria-192-ofb", label: "ARIA-192-OFB" },
      { value: "aria-256-cbc", label: "ARIA-256-CBC" },
      { value: "aria-256-cfb", label: "ARIA-256-CFB" },
      { value: "aria-256-cfb1", label: "ARIA-256-CFB1" },
      { value: "aria-256-cfb8", label: "ARIA-256-CFB8" },
      { value: "aria-256-ctr", label: "ARIA-256-CTR" },
      { value: "aria-256-ecb", label: "ARIA-256-ECB" },
      { value: "aria-256-ofb", label: "ARIA-256-OFB" },
    ],
  },
  {
    id: "bf",
    label: "Blowfish",
    variants: [
      { value: "bf-cbc", label: "BF-CBC" },
      { value: "bf", label: "BF (alias of BF-CBC)" },
      { value: "bf-cfb", label: "BF-CFB" },
      { value: "bf-ecb", label: "BF-ECB" },
      { value: "bf-ofb", label: "BF-OFB" },
    ],
  },
  {
    id: "camellia",
    label: "Camellia",
    variants: [
      { value: "camellia-128-cbc", label: "Camellia-128-CBC" },
      { value: "camellia-128-ecb", label: "Camellia-128-ECB" },
      { value: "camellia-192-cbc", label: "Camellia-192-CBC" },
      { value: "camellia-192-ecb", label: "Camellia-192-ECB" },
      { value: "camellia-256-cbc", label: "Camellia-256-CBC" },
      { value: "camellia-256-ecb", label: "Camellia-256-ECB" },
    ],
  },
  {
    id: "cast",
    label: "CAST",
    variants: [
      { value: "cast5-cbc", label: "CAST5-CBC" },
      { value: "cast-cbc", label: "CAST-CBC (alias of CAST5-CBC)" },
      { value: "cast", label: "CAST (alias of CAST5-CBC)" },
      { value: "cast5-cfb", label: "CAST5-CFB" },
      { value: "cast5-ecb", label: "CAST5-ECB" },
      { value: "cast5-ofb", label: "CAST5-OFB" },
    ],
  },
  {
    id: "des",
    label: "DES",
    variants: [
      { value: "des-cbc", label: "DES-CBC" },
      { value: "des", label: "DES (alias of DES-CBC)" },
      { value: "des-cfb", label: "DES-CFB" },
      { value: "des-ecb", label: "DES-ECB" },
      { value: "des-ofb", label: "DES-OFB" },
      { value: "des-ede", label: "DES-EDE (2-key 3DES, ECB)" },
      { value: "des-ede-cbc", label: "DES-EDE-CBC" },
      { value: "des-ede-cfb", label: "DES-EDE-CFB" },
      { value: "des-ede-ofb", label: "DES-EDE-OFB" },
      { value: "des-ede3", label: "DES-EDE3 (3-key 3DES, ECB)" },
      { value: "des-ede3-cbc", label: "DES-EDE3-CBC" },
      { value: "des3", label: "DES3 (alias of DES-EDE3-CBC)" },
      { value: "des-ede3-cfb", label: "DES-EDE3-CFB" },
      { value: "des-ede3-ofb", label: "DES-EDE3-OFB" },
      { value: "desx", label: "DESX" },
    ],
  },
  {
    id: "idea",
    label: "IDEA",
    variants: [
      { value: "idea-cbc", label: "IDEA-CBC" },
      { value: "idea", label: "IDEA (alias of IDEA-CBC)" },
      { value: "idea-cfb", label: "IDEA-CFB" },
      { value: "idea-ecb", label: "IDEA-ECB" },
      { value: "idea-ofb", label: "IDEA-OFB" },
    ],
  },
  {
    id: "rc2",
    label: "RC2",
    variants: [
      { value: "rc2-cbc", label: "RC2-CBC" },
      { value: "rc2", label: "RC2 (alias of RC2-CBC)" },
      { value: "rc2-40-cbc", label: "RC2-40-CBC" },
      { value: "rc2-64-cbc", label: "RC2-64-CBC" },
      { value: "rc2-cfb", label: "RC2-CFB" },
      { value: "rc2-ecb", label: "RC2-ECB" },
      { value: "rc2-ofb", label: "RC2-OFB" },
    ],
  },
  {
    id: "rc4",
    label: "RC4",
    variants: [
      { value: "rc4", label: "RC4" },
      { value: "rc4-40", label: "RC4-40" },
    ],
  },
  {
    id: "seed",
    label: "SEED",
    variants: [
      { value: "seed-cbc", label: "SEED-CBC" },
      { value: "seed", label: "SEED (alias of SEED-CBC)" },
      { value: "seed-cfb", label: "SEED-CFB" },
      { value: "seed-ecb", label: "SEED-ECB" },
      { value: "seed-ofb", label: "SEED-OFB" },
    ],
  },
  {
    id: "sm4",
    label: "SM4",
    variants: [
      { value: "sm4-cbc", label: "SM4-CBC" },
      { value: "sm4-cfb", label: "SM4-CFB" },
      { value: "sm4-ctr", label: "SM4-CTR" },
      { value: "sm4-ecb", label: "SM4-ECB" },
      { value: "sm4-ofb", label: "SM4-OFB" },
    ],
  },
];
