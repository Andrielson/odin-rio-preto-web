import { Subscriber } from "./subscriber.interface";

export interface SubscribersRepository {
  countByEmail(email: string): Promise<number>;
  insertOne(subscription: Subscriber): Promise<boolean>;
  findAll(): Promise<Subscriber[]>;
  findAllVerified(): Promise<Subscriber[]>;
  findOneAndRemoveVerificationToken(token: string): Promise<boolean>;
  findOneAndDeleteByToken(token: string): Promise<boolean>;
}
