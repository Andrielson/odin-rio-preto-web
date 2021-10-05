import { CryptoService } from "../common/crypto-service.interface";
import { CryptoServiceImpl } from "../common/crypto.service";
import { getDatabaseCollection } from "../db/mongo";
import { Subscriber } from "./subscriber.interface";
import { SubscribersDocument } from "./subscribers-document.interface";
import { SubscribersRepository } from "./subscribers-repository.interface";

export function SubscribersRepositoryImpl(
  crypto: CryptoService = CryptoServiceImpl()
): SubscribersRepository {
  const getCollection =
    getDatabaseCollection<SubscribersDocument>("subscribers");

  const mapFromDocument = async (
    document: SubscribersDocument
  ): Promise<Subscriber> => {
    const { createdAt, encryptedEmail, keywords, verified } = document;
    const email = await crypto.decrypt(encryptedEmail);
    return { createdAt, email, keywords, verified };
  };

  const mapToDocument = async (
    subscriber: Subscriber
  ): Promise<SubscribersDocument> => {
    const { createdAt, email, keywords, verified } = subscriber;
    const encryptedEmail = await crypto.encrypt(email);
    const emailHash = await crypto.digest(email);
    return { createdAt, emailHash, encryptedEmail, keywords, verified };
  };

  const countByEmail = async (email: string) => {
    const collection = await getCollection;
    const emailHash = await crypto.digest(email);
    return collection.countDocuments({ emailHash });
  };
  const insertOne = async (subscriber: Subscriber) => {
    const collection = await getCollection;
    const document = await mapToDocument(subscriber);
    const { acknowledged } = await collection.insertOne(document);
    return acknowledged;
  };

  const findAll = async () => {
    const collection = await getCollection;
    const documents = await collection.find().toArray();
    return Promise.all(documents.map(mapFromDocument));
  };

  return {
    countByEmail,
    insertOne,
    findAll,
  };
}
