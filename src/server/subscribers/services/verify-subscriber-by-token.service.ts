import { SubscribersRepositoryImpl } from "../subscribers.repository";

export class VerifySubscriberByTokenServiceImpl
  implements VerifySubscriberByTokenService
{
  constructor(
    private readonly repository: SubscribersRepository = new SubscribersRepositoryImpl()
  ) {}

  async verifyByToken(token: string) {
    const result = await this.repository.findOneAndRemoveVerificationToken(
      token
    );
    if (!result) throw new Error("Token inválido!");
  }
}
