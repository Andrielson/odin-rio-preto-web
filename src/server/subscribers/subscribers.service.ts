import crypto from "crypto";
import { SubscribersRepository } from "./subscribers-repository.interface";
import { SubscribersService } from "./subscribers-service.interface";
import { SubscribersRepositoryImpl } from "./subscribers.repository";

export function SubscribersServiceImpl(
  repository: SubscribersRepository = SubscribersRepositoryImpl()
): SubscribersService {
  const addSubscriber = async (email: string, keywords: string[]) => {
    const count = await repository.countByEmail(email);
    if (count > 0) {
      return;
    }

    const acknowledged = await repository.insertOne({
      email,
      keywords,
      createdAt: new Date(),
      verificationToken: crypto.randomUUID(),
      unsubscriptionToken: crypto.randomUUID(),
    });

    if (!acknowledged) throw new Error("Falha ao cadastrar o e-mail!");
  };

  const listSubscribers = () => repository.findAllVerified();

  const verifyByToken = async (token: string) => {
    const result = await repository.findOneAndRemoveVerificationToken(token);
    if (!result) throw new Error("Token inválido!");
  };

  return {
    addSubscriber,
    listSubscribers,
    verifyByToken,
  };
}
