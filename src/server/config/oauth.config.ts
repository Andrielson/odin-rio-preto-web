import { AbstractConfigFromEnv } from "./abstract.config";

const required = ["OAUTH_SECRET_KEY", "OAUTH_AUDIENCE", "OAUTH_ISSUER"];

export class OAuthConfigFromEnv
  extends AbstractConfigFromEnv
  implements OAuthConfig
{
  readonly audience: string;
  readonly enabled: boolean;
  readonly issuer: string;
  readonly secretKey: string;

  constructor(env: NodeJS.ProcessEnv = process.env) {
    super(env, required);
    this.secretKey = env.OAUTH_SECRET_KEY!;
    this.audience = env.OAUTH_AUDIENCE!;
    this.issuer = env.OAUTH_ISSUER!;
    this.enabled = !env.OAUTH_ENABLED || env.OAUTH_ENABLED !== "false";
  }
}
