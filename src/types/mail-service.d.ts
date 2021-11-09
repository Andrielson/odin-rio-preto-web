declare interface MailService {
  sendMessage(message: MailMessage): Promise<void>;
}
