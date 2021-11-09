import { ObjectId } from "bson";

declare interface SubscribersDocument {
  _id?: ObjectId;
  emailHash: string;
  encryptedEmail: string;
  keywords: string[];
  createdAt: Date;
  verificationToken?: string;
  unsubscriptionToken: string;
}
