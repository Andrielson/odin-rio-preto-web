import { AbstractConfigFromEnv } from "./abstract.config";

export class NodemailerConfigFromEnv extends AbstractConfigFromEnv {
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
  readonly auth: { user: string; pass: string };
  readonly service?: string;
  readonly host?: string;
  readonly port?: string;
  readonly secure?: boolean;
  readonly pool?: boolean;

  constructor(private readonly env: NodeJS.ProcessEnv = process.env) {
    super(env);
    if (this.wellKnownOptions.every((it) => !!env[it])) {
      this.service = env.NODEMAILER_WELL_KNOWN!;
    } else if (this.providersOptions.every((it) => !!env[it])) {
      this.host = env.NODEMAILER_SMTP_HOST!;
      this.port = env.NODEMAILER_SMTP_PORT!;
      this.secure = env.NODEMAILER_SMTP_SECURE! === "true";
    } else {
      this.inspectRequiredOptions(env, this.providersOptions);
    }

    const user = this.env.NODEMAILER_SMTP_USER!;
    const pass = this.env.NODEMAILER_SMTP_PASS!;
    this.auth = { user, pass };

    this.pool =
      !!env.NODEMAILER_SMTP_POOL && env.NODEMAILER_SMTP_POOL === "true";
  }
}
