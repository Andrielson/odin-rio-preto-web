import { Transporter } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import nodeMailerTransporter from "./node-mailer-transporter";
import { MailMessage } from "./types/mail-message.interface";
import { MailService } from "./types/mail-service.interface";

export function MailServiceImpl(
  transporter: Transporter = nodeMailerTransporter
): MailService {
  const sendMessage = async (message: MailMessage) => {
    const from: Mail.Address = {
      address: "boletim@riopreto.diario.tk",
      name: "Boletim Diário Oficial",
    };
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
