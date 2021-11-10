export class MailConfigFromEnv implements MailConfig {
  private readonly required = [
    "MAIL_FROM_ADDRESS",
    "MAIL_FROM_NAME",
    "MAIL_MAILTO_UNSUBSCRIBE",
  ];
  readonly fromAddress: string;
  readonly fromName: string;
  readonly mailToUnsubscribe: string;

  constructor(env: NodeJS.ProcessEnv = process.env) {
    const missing = this.required.filter((it) => !env[it]).join(", ");
    if (!!missing) {
      throw new Error(
        `Please define the ${missing} environment variable(s) inside .env.local`
      );
    }
    this.fromAddress = env.MAIL_FROM_ADDRESS!;
    this.fromName = env.MAIL_FROM_NAME!;
    this.mailToUnsubscribe = env.MAIL_MAILTO_UNSUBSCRIBE!;
  }
}
