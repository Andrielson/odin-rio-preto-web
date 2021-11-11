declare interface RemoveSubscriberByTokenService {
  removeByToken(token: string): Promise<void>;
}
