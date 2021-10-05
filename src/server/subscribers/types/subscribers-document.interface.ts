import { ObjectId } from "bson";

export interface SubscribersDocument {
  _id?: ObjectId;
  emailHash: string;
  encryptedEmail: string;
  keywords: string[];
  createdAt: Date;
  verificationToken?: string;
  unsubscriptionToken: string;
}