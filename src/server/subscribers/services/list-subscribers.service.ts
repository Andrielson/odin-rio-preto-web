import subscribersRepositoryFactory from "../subscribers.repository";

export default function listSubscribersServiceFactory(
  repository: SubscribersRepository = subscribersRepositoryFactory()
): ListSubscribersService {
  const listSubscribers = async () => {
    return await repository.findAllVerified();
  };
  return { listSubscribers };
}
