import checkRequiredOptionsFromEnv from "@server/functions/check-required-options-from-env";

export default function OAuthConfigFromEnvFactory(
  env: NodeJS.ProcessEnv = process.env
): OAuthConfig {
  const required = ["OAUTH_SECRET_KEY", "OAUTH_AUDIENCE", "OAUTH_ISSUER"];
  checkRequiredOptionsFromEnv(env, required);

  const secretKey = env.OAUTH_SECRET_KEY!;
  const audience = env.OAUTH_AUDIENCE!;
  const issuer = env.OAUTH_ISSUER!;
  const enabled = !env.OAUTH_ENABLED || env.OAUTH_ENABLED !== "false";

  return {
    audience,
    enabled,
    issuer,
    secretKey,
  };
}
