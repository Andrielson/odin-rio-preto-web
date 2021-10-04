import { Subscriber } from "./subscriber.interface";

export interface SubscribersRepository {
  countByEmail: (email: string) => Promise<number>;
  insertOne: (subscription: Subscriber) => Promise<boolean>;
}
