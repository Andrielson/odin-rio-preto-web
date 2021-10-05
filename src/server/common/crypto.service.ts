import crypto from "crypto";
import { CryptoService } from "./crypto-service.interface";

if (!process.env.CRYPTO_HEX_KEY)
  throw new Error(
    "Please define the CRYPTO_HEX_KEY environment variable inside .env.local"
  );
const password = Buffer.from(String(process.env.CRYPTO_HEX_KEY), "hex");
const algorithm = "aes-256-cbc";
const delimiter = "/";
const encoding: BufferEncoding = "base64url";

const generateKey = (salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) =>
    crypto.scrypt(password, salt, 32, (err, derivedKey) => {
      if (!!err) reject(err);
      resolve(derivedKey);
    })
  );

const createCipheriv = async () => {
  const salt = crypto.randomBytes(24);
  const iv = crypto.randomBytes(16);
  const key = await generateKey(salt);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return { cipher, iv, salt };
};

const createDecipheriv = async (iv: Buffer, salt: Buffer) => {
  const key = await generateKey(salt);
  return crypto.createDecipheriv(algorithm, key, iv);
};

export function CryptoServiceImpl(): CryptoService {
  const encrypt = async (message: string) => {
    const { cipher, iv, salt } = await createCipheriv();
    let value = cipher.update(message);
    value = Buffer.concat([value, cipher.final()]);
    return [iv, salt, value].map((it) => it.toString(encoding)).join(delimiter);
  };

  const decrypt = async (text: string) => {
    const [iv, salt, value] = text
      .split(delimiter)
      .map((it) => Buffer.from(it, encoding));
    const decipher = await createDecipheriv(iv, salt);
    let decryptedBuffer = decipher.update(value);
    decryptedBuffer = Buffer.concat([decryptedBuffer, decipher.final()]);
    return decryptedBuffer.toString("utf-8");
  };

  const digest = (text: string) => {
    const hash = crypto.createHash("sha256");
    hash.update(text);
    return Promise.resolve(hash.digest("hex"));
  };

  return { encrypt, decrypt, digest };
}
