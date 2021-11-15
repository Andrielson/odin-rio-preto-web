import subscribersRepositoryFactory from "../subscribers.repository";

export default function verifySubscriberByTokenServiceFactory(
  repository: SubscribersRepository = subscribersRepositoryFactory()
): VerifySubscriberByTokenService {
  const verifyByToken = async (token: string) => {
    const result = await repository.findOneAndRemoveVerificationToken(token);
    if (!result) throw new Error("Token inválido!");
  };

  return { verifyByToken };
}
