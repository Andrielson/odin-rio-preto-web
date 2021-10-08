import { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import nodeMailerTransporter from "./node-mailer-transporter";
import { MailMessage } from "./types/mail-message.interface";
import { MailService } from "./types/mail-service.interface";

const missingRequiredVars = [
  "MAIL_FROM_ADDRESS",
  "MAIL_FROM_NAME",
  "MAIL_MAILTO_UNSUBSCRIBE",
]
  .filter((it) => !process.env[it])
  .join(", ");

if (missingRequiredVars.length > 0)
  throw new Error(
    `Please define the ${missingRequiredVars} environment variable(s) inside .env.local`
  );

const from: Mail.Address = {
  address: `${process.env.MAIL_FROM_ADDRESS}`,
  name: `${process.env.MAIL_FROM_NAME}`,
};

const headers: Mail.Headers = {
  key: "List-Unsubscribe",
  value: `mailto:${process.env.MAIL_MAILTO_UNSUBSCRIBE}?subject=unsubscribe`,
};

export function MailServiceImpl(
  transporter: Transporter = nodeMailerTransporter
): MailService {
  const sendMessage = async (message: MailMessage) => {
    try {
      await transporter.sendMail({ ...message, from });
      console.info("Email enviado!");
    } catch (error) {
      console.error("Falha no envio do email!");
      console.error(error);
    }
  };
  return { sendMessage };
}
