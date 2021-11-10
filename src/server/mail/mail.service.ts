import { createTransport, Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { MailConfigFromEnv } from "@server/config/mail.config";
import { NodemailerConfigFromEnv } from "@server/config/nodemailer.config";

export class MailServiceImpl implements MailService {
  private readonly from: Mail.Address;
  private readonly headers: Mail.Headers;
  private readonly transporter: Transporter;

  constructor(
    mailConfig: MailConfig = new MailConfigFromEnv(),
    config = new NodemailerConfigFromEnv()
  ) {
    this.transporter = createTransport(config as any);
    this.from = {
      address: mailConfig.fromAddress,
      name: mailConfig.fromName,
    };

    this.headers = {
      key: "List-Unsubscribe",
      value: `mailto:${mailConfig.mailToUnsubscribe}?subject=unsubscribe`,
    };
  }

  async sendMessage(message: MailMessage) {
    try {
      await this.transporter.sendMail({
        ...message,
        from: this.from,
        headers: this.headers,
      });
      console.info("Email enviado!");
    } catch (error) {
      console.error("Falha no envio do email!");
      console.error(error);
    }
  }
}
