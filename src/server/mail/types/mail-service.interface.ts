import { MailMessage } from "./mail-message.interface";

export interface MailService {
  sendMessage(message: MailMessage): Promise<void>;
}
