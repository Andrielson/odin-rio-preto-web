import { SubscribersRepositoryImpl } from "../subscribers.repository";

export class RemoveSubscriberByTokenServiceImpl
  implements RemoveSubscriberByTokenService
{
  constructor(
    private readonly repository: SubscribersRepository = new SubscribersRepositoryImpl()
  ) {}

  async removeByToken(token: string) {
    const result = await this.repository.findOneAndDeleteByToken(token);
    if (!result) throw new Error("Token inválido!");
  }
}
