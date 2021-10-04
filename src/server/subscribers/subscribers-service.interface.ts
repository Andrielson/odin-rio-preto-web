import { Subscriber } from "./subscriber.interface";

export interface SubscribersService {
  addSubscriber: (email: string, keywords: string[]) => Promise<void>;
  listSubscribers: () => Promise<Subscriber[]>;
}
