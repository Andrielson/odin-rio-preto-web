export class OAuthConfigFromEnv implements OAuthConfig {
  private readonly required = [
    "OAUTH_SECRET_KEY",
    "OAUTH_AUDIENCE",
    "OAUTH_ISSUER",
  ];
  readonly audience: string;
  readonly enabled: boolean;
  readonly issuer: string;
  readonly secretKey: string;

  constructor(env: NodeJS.ProcessEnv = process.env) {
    const missing = this.required.filter((it) => !env[it]).join(", ");
    if (!!missing) {
      throw new Error(
        `Please define the ${missing} environment variable(s) inside .env.local`
      );
    }
    this.secretKey = env.OAUTH_SECRET_KEY!;
    this.audience = env.OAUTH_AUDIENCE!;
    this.issuer = env.OAUTH_ISSUER!;
    this.enabled = !env.OAUTH_ENABLED || env.OAUTH_ENABLED !== "false";
  }
}
