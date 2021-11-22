import checkRequiredOptionsFromEnv from "@server/functions/check-required-options-from-env";

export default function recaptchaPageConfigFromEnvFactory(
  env: NodeJS.ProcessEnv
): RecaptchaPageConfig {
  const required = ["NEXT_PUBLIC_RECAPTCHA_SITE_KEY"];
  checkRequiredOptionsFromEnv(env, required);
  const siteKey = env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;

  return { siteKey };
}
