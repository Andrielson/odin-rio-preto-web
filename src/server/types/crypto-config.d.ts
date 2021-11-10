declare interface CryptoConfig {
  readonly cipherKey: Buffer;
  readonly cipherKeyEncoding: BufferEncoding;
  readonly cipherAlgorithm: string;
  readonly cipherDelimiter: string;
  readonly cipherEncoding: BufferEncoding;
  readonly hashAlgorithm: string;
}
