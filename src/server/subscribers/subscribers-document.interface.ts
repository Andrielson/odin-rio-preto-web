import { ObjectId } from "bson";

export interface SubscribersDocument {
  id?: ObjectId;
  emailHash: string;
  encryptedEmail: string;
  keywords: string[];
  createdAt: Date;
  verified: boolean;
}
