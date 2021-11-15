import APP_URL from "@server/constants/app-url";
import checkRequiredOptionsFromEnv from "../functions/check-required-options-from-env";

export default function mailMessageConfigFromEnvFactory(
  env: NodeJS.ProcessEnv = process.env,
  appUrl: string = APP_URL
): MailFactoryConfig {
  const required = ["MAIL_ASSETS_URL", "MAIL_TEMPLATES_URL"];
  checkRequiredOptionsFromEnv(env, required);

  const assetsUrl = env.MAIL_ASSETS_URL!;
  const templatesUrl = env.MAIL_TEMPLATES_URL!;

  return {
    appUrl,
    assetsUrl,
    templatesUrl,
  };
}
