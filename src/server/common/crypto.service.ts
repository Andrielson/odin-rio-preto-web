import crypto from "crypto";
import { CryptoService } from "./crypto-service.interface";

if (!process.env.CRYPTO_CIPHER_KEY)
  throw new Error(
    "Please define the CRYPTO_CIPHER_KEY environment variable inside .env.local"
  );

if (!process.env.CRYPTO_CIPHER_KEY_ENCODING)
  throw new Error(
    "Please define the CRYPTO_CIPHER_KEY_ENCODING environment variable inside .env.local"
  );

const CIPHER_KEY_ENCODING = process.env
  .CRYPTO_CIPHER_KEY_ENCODING as BufferEncoding;
const CIPHER_KEY = Buffer.from(
  String(process.env.CRYPTO_CIPHER_KEY),
  CIPHER_KEY_ENCODING
);

const CIPHER_ALGORITHM = process.env.CRYPTO_CIPHER_ALGORITHM ?? "aes-128-cbc";
const CIPHER_DELIMITER = process.env.CRYPTO_CIPHER_DELIMITER ?? "|";
const CIPHER_ENCODING = (process.env.CRYPTO_CIPHER_ENCODING ??
  "base64") as BufferEncoding;
const HASH_ALGORITHM = process.env.CRYPTO_HASH_ALGORITHM ?? "sha256";

const createCipheriv = () => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, CIPHER_KEY, iv);
  return { cipher, iv };
};

const createDecipheriv = (iv: Buffer) => {
  return crypto.createDecipheriv(CIPHER_ALGORITHM, CIPHER_KEY, iv);
};

export function CryptoServiceImpl(): CryptoService {
  const encrypt = async (message: string) => {
    const { cipher, iv } = createCipheriv();
    let value = cipher.update(message, "utf-8");
    value = Buffer.concat([value, cipher.final()]);
    return [iv, value]
      .map((it) => it.toString(CIPHER_ENCODING))
      .join(CIPHER_DELIMITER);
  };

  const decrypt = async (text: string) => {
    const [iv, value] = text
      .split(CIPHER_DELIMITER)
      .map((it) => Buffer.from(it, CIPHER_ENCODING));
    const decipher = createDecipheriv(iv);
    let decryptedBuffer = decipher.update(value);
    decryptedBuffer = Buffer.concat([decryptedBuffer, decipher.final()]);
    return decryptedBuffer.toString("utf-8");
  };

  const digest = async (text: string) => {
    const hash = crypto.createHash(HASH_ALGORITHM);
    hash.update(text);
    return hash.digest("hex");
  };

  return { encrypt, decrypt, digest };
}
