declare interface VerifySubscriberByTokenService {
  verifyByToken(token: string): Promise<void>;
}
