export interface CryptoService {
  encrypt: (text: string) => Promise<string>;
  decrypt: (text: string) => Promise<string>;
  digest: (text: string) => Promise<string>;
}
