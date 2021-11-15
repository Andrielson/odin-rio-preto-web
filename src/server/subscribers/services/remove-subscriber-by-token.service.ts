import subscribersRepositoryFactory from "../subscribers.repository";

export default function removeSubscriberByTokenServiceFactory(
  repository: SubscribersRepository = subscribersRepositoryFactory()
): RemoveSubscriberByTokenService {
  const removeByToken = async (token: string) => {
    const result = await repository.findOneAndDeleteByToken(token);
    if (!result) throw new Error("Token inválido!");
  };
  return { removeByToken };
}
