export interface Subscriber {
  email: string;
  keywords: string[];
  createdAt: Date;
  verificationToken?: string;
  unsubscriptionToken: string;
}
