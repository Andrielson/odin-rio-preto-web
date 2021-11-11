import APP_URL from "@server/utils/app-url";
import { AbstractConfigFromEnv } from "./abstract.config";

const required = ["MAIL_ASSETS_URL", "MAIL_TEMPLATES_URL"];

export class MailMessageConfigFromEnv
  extends AbstractConfigFromEnv
  implements MailFactoryConfig
{
  readonly assetsUrl: string;
  readonly templatesUrl: string;

  constructor(
    env: NodeJS.ProcessEnv = process.env,
    public readonly appUrl: string = APP_URL
  ) {
    super(env, required);
    this.assetsUrl = env.MAIL_ASSETS_URL!;
    this.templatesUrl = env.MAIL_TEMPLATES_URL!;
  }
}
