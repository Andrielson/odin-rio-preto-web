declare interface SubscribersService {
  addSubscriber(email: string, keywords: string[]): Promise<void>;
  listSubscribers(): Promise<Subscriber[]>;
  verifyByToken(token: string): Promise<void>;
  unsubscribeByToken(token: string): Promise<void>;
}
