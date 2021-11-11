import { AbstractConfigFromEnv } from "./abstract.config";

const required = [
  "MAIL_FROM_ADDRESS",
  "MAIL_FROM_NAME",
  "MAIL_MAILTO_UNSUBSCRIBE",
];

export class MailConfigFromEnv
  extends AbstractConfigFromEnv
  implements MailConfig
{
  readonly fromAddress: string;
  readonly fromName: string;
  readonly mailToUnsubscribe: string;

  constructor(env: NodeJS.ProcessEnv = process.env) {
    super(env, required);
    this.fromAddress = env.MAIL_FROM_ADDRESS!;
    this.fromName = env.MAIL_FROM_NAME!;
    this.mailToUnsubscribe = env.MAIL_MAILTO_UNSUBSCRIBE!;
  }
}
