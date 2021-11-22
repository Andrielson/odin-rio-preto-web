import checkRequiredOptionsFromEnv from "@server/functions/check-required-options-from-env";

export default function recaptchaServerConfigFromEnvFactory(
  env: NodeJS.ProcessEnv = process.env
): RecaptchaServerConfig {
  const required = ["RECAPTCHA_SECRET_KEY"];
  checkRequiredOptionsFromEnv(env, required);
  const secretKey = env.RECAPTCHA_SECRET_KEY!;
  const enabled = !env.RECAPTCHA_ENABLED || env.RECAPTCHA_ENABLED !== "false";

  return { enabled, secretKey };
}
