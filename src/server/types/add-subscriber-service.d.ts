declare interface AddSubscriberService {
  addSubscriber(email: string, keywords: string[]): Promise<void>;
}
