declare interface OAuthConfig {
  readonly audience: string;
  readonly enabled: boolean;
  readonly issuer: string;
  readonly secretKey: string;
}
