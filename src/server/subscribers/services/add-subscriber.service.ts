import crypto from "crypto";
import APP_URL from "@server/utils/app-url";
import { MailServiceImpl } from "@server/mail/mail.service";
import { SubscribeValidationMailFactory } from "@server/mail/messages/subscribe-validation-mail.factory";
import { SubscribersRepositoryImpl } from "../subscribers.repository";

export class AddSubscriberServiceImpl implements AddSubscriberService {
  constructor(
    private readonly mailService: MailService = new MailServiceImpl(),
    private readonly mailFactory = new SubscribeValidationMailFactory(),
    private readonly repository: SubscribersRepository = new SubscribersRepositoryImpl()
  ) {}

  private async sendValidationMail(
    email: string,
    keywords: string[],
    validationLink: string,
    unsubscribeLink: string
  ) {
    const message = await this.mailFactory.getMessage(
      email,
      keywords,
      validationLink,
      unsubscribeLink
    );
    try {
      await this.mailService.sendMessage(message);
    } catch (error) {
      console.error(error);
    }
  }

  async addSubscriber(email: string, keywords: string[]) {
    const count = await this.repository.countByEmail(email);
    if (count > 0) {
      return;
    }

    const verificationToken = crypto.randomUUID();
    const unsubscriptionToken = crypto.randomUUID();
    const acknowledged = await this.repository.insertOne({
      email,
      keywords,
      createdAt: new Date(),
      verificationToken,
      unsubscriptionToken,
    });

    if (!acknowledged) throw new Error("Falha ao cadastrar o e-mail!");
    const validationLink = `${APP_URL}/welcome/${verificationToken}`;
    const unsubscribeLink = `${APP_URL}/goodbye/${unsubscriptionToken}`;
    await this.sendValidationMail(
      email,
      keywords,
      validationLink,
      unsubscribeLink
    );
  }
}
