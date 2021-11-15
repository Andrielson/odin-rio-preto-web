import checkRequiredOptionsFromEnv from "@server/functions/check-required-options-from-env";

export default function cryptoConfigFromEnvFactory(
  env: NodeJS.ProcessEnv = process.env
): CryptoConfig {
  const required = ["CRYPTO_CIPHER_KEY", "CRYPTO_CIPHER_KEY_ENCODING"];
  checkRequiredOptionsFromEnv(env, required);

  const cipherKeyEncoding = env.CRYPTO_CIPHER_KEY_ENCODING as BufferEncoding;
  const cipherKey = Buffer.from(
    String(env.CRYPTO_CIPHER_KEY),
    cipherKeyEncoding
  );
  const cipherAlgorithm = env.CRYPTO_CIPHER_ALGORITHM ?? "aes-128-cbc";
  const cipherDelimiter = env.CRYPTO_CIPHER_DELIMITER ?? "|";
  const cipherEncoding = (env.CRYPTO_CIPHER_ENCODING ??
    "base64") as BufferEncoding;
  const hashAlgorithm = env.CRYPTO_HASH_ALGORITHM ?? "sha256";

  return {
    cipherKey,
    cipherKeyEncoding,
    cipherAlgorithm,
    cipherDelimiter,
    cipherEncoding,
    hashAlgorithm,
  };
}
