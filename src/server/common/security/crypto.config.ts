export class CryptoConfigFromEnv implements CryptoConfig {
  private readonly required = [
    "CRYPTO_CIPHER_KEY",
    "CRYPTO_CIPHER_KEY_ENCODING",
  ];
  readonly cipherKey: Buffer;
  readonly cipherKeyEncoding: BufferEncoding;
  readonly cipherAlgorithm: string;
  readonly cipherDelimiter: string;
  readonly cipherEncoding: BufferEncoding;
  readonly hashAlgorithm: string;

  constructor(env: NodeJS.ProcessEnv = process.env) {
    const missing = this.required.filter((it) => !env[it]).join(", ");
    if (!!missing) {
      throw new Error(
        `Please define the ${missing} environment variable(s) inside .env.local`
      );
    }
    this.cipherKeyEncoding = env.CRYPTO_CIPHER_KEY_ENCODING as BufferEncoding;
    this.cipherKey = Buffer.from(
      String(env.CRYPTO_CIPHER_KEY),
      this.cipherKeyEncoding
    );
    this.cipherAlgorithm = env.CRYPTO_CIPHER_ALGORITHM ?? "aes-128-cbc";
    this.cipherDelimiter = env.CRYPTO_CIPHER_DELIMITER ?? "|";
    this.cipherEncoding = (env.CRYPTO_CIPHER_ENCODING ??
      "base64") as BufferEncoding;
    this.hashAlgorithm = env.CRYPTO_HASH_ALGORITHM ?? "sha256";
  }
}
