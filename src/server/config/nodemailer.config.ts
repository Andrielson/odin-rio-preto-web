export class NodemailerConfigFromEnv {
  private readonly defaultOptions = [
    "NODEMAILER_SMTP_USER",
    "NODEMAILER_SMTP_PASS",
  ];
  private readonly wellKnownOptions = [
    ...this.defaultOptions,
    "NODEMAILER_WELL_KNOWN",
  ];
  private readonly providersOptions = [
    ...this.defaultOptions,
    "NODEMAILER_SMTP_HOST",
    "NODEMAILER_SMTP_PORT",
    "NODEMAILER_SMTP_SECURE",
  ];
  readonly service?: string;
  readonly host?: string;
  readonly port?: string;
  readonly secure?: boolean;
  readonly pool?: boolean;
  readonly auth = this.authOptions;

  get authOptions() {
    const user = this.env.NODEMAILER_SMTP_USER!;
    const pass = this.env.NODEMAILER_SMTP_PASS!;
    return { user, pass };
  }

  constructor(private readonly env: NodeJS.ProcessEnv = process.env) {
    if (this.wellKnownOptions.every((it) => !!env[it])) {
      this.service = env.NODEMAILER_WELL_KNOWN!;
    } else if (this.providersOptions.every((it) => !!env[it])) {
      this.host = env.NODEMAILER_SMTP_HOST!;
      this.port = env.NODEMAILER_SMTP_PORT!;
      this.secure = env.NODEMAILER_SMTP_SECURE! === "true";
    } else {
      const missing = this.providersOptions.filter((it) => !env[it]).join(", ");
      throw new Error(
        `Please define the ${missing} environment variable(s) inside .env.local`
      );
    }

    this.pool =
      !!env.NODEMAILER_SMTP_POOL && env.NODEMAILER_SMTP_POOL === "true";
  }
}
