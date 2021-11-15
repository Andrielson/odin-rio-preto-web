import crypto from "crypto";
import APP_URL from "@server/constants/app-url";
import mailServiceFactory from "@server/mail/mail.service";
import subscribeValidationMailFactory from "@server/mail/messages/subscribe-validation-mail.factory";
import subscribersRepositoryFactory from "../subscribers.repository";

export default function addSubscriberServiceFactory(
  mailFactory = subscribeValidationMailFactory(),
  mailService: MailService = mailServiceFactory(),
  repository: SubscribersRepository = subscribersRepositoryFactory()
): AddSubscriberService {
  const sendValidationMail = async (
    email: string,
    keywords: string[],
    validationLink: string,
    unsubscribeLink: string
  ) => {
    const message = await mailFactory.getMessage(
      email,
      keywords,
      validationLink,
      unsubscribeLink
    );
    try {
      await mailService.sendMessage(message);
    } catch (error) {
      console.error(error);
    }
  };

  const addSubscriber = async (email: string, keywords: string[]) => {
    const count = await repository.countByEmail(email);
    if (count > 0) {
      return;
    }

    const verificationToken = crypto.randomUUID();
    const unsubscriptionToken = crypto.randomUUID();
    const acknowledged = await repository.insertOne({
      email,
      keywords,
      createdAt: new Date(),
      verificationToken,
      unsubscriptionToken,
    });

    if (!acknowledged) throw new Error("Falha ao cadastrar o e-mail!");
    const validationLink = `${APP_URL}/welcome/${verificationToken}`;
    const unsubscribeLink = `${APP_URL}/goodbye/${unsubscriptionToken}`;
    await sendValidationMail(email, keywords, validationLink, unsubscribeLink);
  };

  return { addSubscriber };
}
