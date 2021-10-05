import * as crypto from "node:crypto";
import { CryptoService } from "./crypto-service.interface";

const algorithm = "aes-256-cbc";
const password = String(process.env.CRYPTO_HEX_KEY);
const passwordBuffer = Buffer.from(password, "hex");
const salt = crypto.randomBytes(16).toString("hex");
const iv = crypto.randomBytes(16).toString("hex");

const generateKey = (salt: string) =>
  new Promise<Buffer>((resolve, reject) =>
    crypto.scrypt(
      passwordBuffer,
      Buffer.from(salt, "hex"),
      32,
      (err, derivedKey) => {
        if (!!err) reject(err);
        resolve(derivedKey);
      }
    )
  );

const createCipheriv = async (iv: string, salt: string) => {
  const key = await generateKey(salt);
  return crypto.createCipheriv(algorithm, key, Buffer.from(iv, "hex"));
};

const createDecipheriv = async (iv: string, salt: string) => {
  const key = await generateKey(salt);
  return crypto.createDecipheriv(algorithm, key, Buffer.from(iv, "hex"));
};

interface CryptoWrapper {
  iv: string;
  salt: string;
  value: string;
}

export function CryptoServiceImpl(): CryptoService {
  const encrypt = async (message: string) => {
    const cipher = await createCipheriv(iv, salt);
    let encryptedBuffer = cipher.update(message);
    encryptedBuffer = Buffer.concat([encryptedBuffer, cipher.final()]);
    const value = encryptedBuffer.toString("hex");
    const resultWrapper: CryptoWrapper = { iv, salt, value };
    return Buffer.from(JSON.stringify(resultWrapper)).toString("base64");
  };

  const decrypt = async (text: string) => {
    const wrapper: CryptoWrapper = JSON.parse(
      Buffer.from(text, "base64").toString("utf-8")
    );
    const { iv, salt, value } = wrapper;
    const decipher = await createDecipheriv(iv, salt);
    let decryptedBuffer = decipher.update(Buffer.from(value, "hex"));
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
