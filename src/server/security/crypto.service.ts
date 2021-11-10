import crypto from "crypto";
import { CryptoConfigFromEnv } from "../config/crypto.config";

export class CryptoServiceImpl implements CryptoService {
  constructor(
    private readonly config: CryptoConfig = new CryptoConfigFromEnv()
  ) {}

  private createCipheriv() {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      this.config.cipherAlgorithm,
      this.config.cipherKey,
      iv
    );
    return { cipher, iv };
  }

  private createDecipheriv(iv: Buffer) {
    return crypto.createDecipheriv(
      this.config.cipherAlgorithm,
      this.config.cipherKey,
      iv
    );
  }

  async encrypt(message: string) {
    const { cipher, iv } = this.createCipheriv();
    let value = cipher.update(message, "utf-8");
    value = Buffer.concat([value, cipher.final()]);
    return [iv, value]
      .map((it) => it.toString(this.config.cipherEncoding))
      .join(this.config.cipherDelimiter);
  }

  async decrypt(text: string) {
    const [iv, value] = text
      .split(this.config.cipherDelimiter)
      .map((it) => Buffer.from(it, this.config.cipherEncoding));
    const decipher = this.createDecipheriv(iv);
    let decryptedBuffer = decipher.update(value);
    decryptedBuffer = Buffer.concat([decryptedBuffer, decipher.final()]);
    return decryptedBuffer.toString("utf-8");
  }

  async digest(text: string) {
    const hash = crypto.createHash(this.config.hashAlgorithm);
    hash.update(text);
    return hash.digest("hex");
  }
}
