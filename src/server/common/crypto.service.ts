import crypto from "crypto";
import { CryptoService } from "./crypto-service.interface";

const CIPHER_ALGORITHM = process.env.CRYPTO_CIPHER_ALGORITHM ?? "aes-128-cbc";
const CIPHER_DELIMITER = process.env.CRYPTO_CIPHER_DELIMITER ?? "|";
const CIPHER_ENCODING = (process.env.CRYPTO_CIPHER_ENCODING ??
  "base64") as BufferEncoding;
const CIPHER_KEY_LENGTH = Number(process.env.CRYPTO_CIPHER_KEY_LENGTH ?? "16");
const HASH_ALGORITHM = process.env.CRYPTO_HASH_ALGORITHM ?? "sha256";

if (!process.env.CRYPTO_CIPHER_PASSWORD_HEX)
  throw new Error(
    "Please define the CRYPTO_CIPHER_PASSWORD_KEY environment variable inside .env.local"
  );
const password = Buffer.from(
  String(process.env.CRYPTO_CIPHER_PASSWORD_HEX),
  "hex"
);

const generateKey = (salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) =>
    crypto.scrypt(password, salt, CIPHER_KEY_LENGTH, (err, derivedKey) => {
      if (!!err) reject(err);
      resolve(derivedKey);
    })
  );

const createCipheriv = async () => {
  const salt = crypto.randomBytes(24);
  const iv = crypto.randomBytes(16);
  const key = await generateKey(salt);
  const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, iv);
  return { cipher, iv, salt };
};

const createDecipheriv = async (iv: Buffer, salt: Buffer) => {
  const key = await generateKey(salt);
  return crypto.createDecipheriv(CIPHER_ALGORITHM, key, iv);
};

export function CryptoServiceImpl(): CryptoService {
  const encrypt = async (message: string) => {
    const { cipher, iv, salt } = await createCipheriv();
    let value = cipher.update(message, "utf-8");
    value = Buffer.concat([value, cipher.final()]);
    return [iv, salt, value]
      .map((it) => it.toString(CIPHER_ENCODING))
      .join(CIPHER_DELIMITER);
  };

  const decrypt = async (text: string) => {
    const [iv, salt, value] = text
      .split(CIPHER_DELIMITER)
      .map((it) => Buffer.from(it, CIPHER_ENCODING));
    const decipher = await createDecipheriv(iv, salt);
    let decryptedBuffer = decipher.update(value);
    decryptedBuffer = Buffer.concat([decryptedBuffer, decipher.final()]);
    return decryptedBuffer.toString("utf-8");
  };

  const digest = (text: string) => {
    const hash = crypto.createHash(HASH_ALGORITHM);
    hash.update(text);
    return Promise.resolve(hash.digest("hex"));
  };

  return { encrypt, decrypt, digest };
}
