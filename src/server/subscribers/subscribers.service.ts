import crypto from "crypto";
import { MailServiceImpl } from "@server/mail/mail.service";
import { SubscribeValidationMail } from "@server/mail/models/subscribe-validation-mail";
import { SubscribersRepositoryImpl } from "./subscribers.repository";
import APP_URL from "@server/utils/app-url";

export function SubscribersServiceImpl(
  mailService: MailService = MailServiceImpl(),
  repository: SubscribersRepository = new SubscribersRepositoryImpl()
): SubscribersService {
  const sendValidationMail = async (
    email: string,
    keywords: string[],
    validationLink: string,
    unsubscribeLink: string
  ) => {
    const message = await SubscribeValidationMail(
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

  const listSubscribers = () => repository.findAllVerified();

  const verifyByToken = async (token: string) => {
    const result = await repository.findOneAndRemoveVerificationToken(token);
    if (!result) throw new Error("Token inválido!");
  };

  const unsubscribeByToken = async (token: string) => {
    const result = await repository.findOneAndDeleteByToken(token);
    if (!result) throw new Error("Token inválido!");
  };

  return {
    addSubscriber,
    listSubscribers,
    verifyByToken,
    unsubscribeByToken,
  };
}
