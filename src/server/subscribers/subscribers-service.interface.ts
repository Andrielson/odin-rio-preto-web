export interface SubscribersService {
  addSubscriber: (email: string, keywords: string[]) => Promise<void>;
}
