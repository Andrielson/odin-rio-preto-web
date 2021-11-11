import { SubscribersRepositoryImpl } from "../subscribers.repository";

export class ListSubscribersServiceImpl implements ListSubscribersService {
  constructor(
    private readonly repository: SubscribersRepository = new SubscribersRepositoryImpl()
  ) {}

  listSubscribers() {
    return this.repository.findAllVerified();
  }
}
