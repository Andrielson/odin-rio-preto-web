import crypto from "crypto";
import cryptoConfigFromEnvFactory from "@server/config/crypto.config";

export default function cryptoServiceFactory(
  config: CryptoConfig = cryptoConfigFromEnvFactory()
): CryptoService {
  const createCipheriv = () => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      config.cipherAlgorithm,
      config.cipherKey,
      iv
    );
    return { cipher, iv };
  };

  const createDecipheriv = (iv: Buffer) => {
    return crypto.createDecipheriv(
      config.cipherAlgorithm,
      config.cipherKey,
      iv
    );
  };

  const encrypt = async (message: string) => {
    const { cipher, iv } = createCipheriv();
    let value = cipher.update(message, "utf-8");
    value = Buffer.concat([value, cipher.final()]);
    return [iv, value]
      .map((it) => it.toString(config.cipherEncoding))
      .join(config.cipherDelimiter);
  };

  const decrypt = async (text: string) => {
    const [iv, value] = text
      .split(config.cipherDelimiter)
      .map((it) => Buffer.from(it, config.cipherEncoding));
    const decipher = createDecipheriv(iv);
    let decryptedBuffer = decipher.update(value);
    decryptedBuffer = Buffer.concat([decryptedBuffer, decipher.final()]);
    return decryptedBuffer.toString("utf-8");
  };

  const digest = async (text: string) => {
    const hash = crypto.createHash(config.hashAlgorithm);
    hash.update(text);
    return hash.digest("hex");
  };

  return {
    encrypt,
    decrypt,
    digest,
  };
}
