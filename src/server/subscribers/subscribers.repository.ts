import mongodbConnectionFactory from "@server/db/mongo";
import cryptoServiceFactory from "@server/security/crypto.service";
import { SubscribersDocument } from "@server/types/subscribers-document";

export default function subscribersRepositoryFactory(
  crypto: CryptoService = cryptoServiceFactory(),
  db = mongodbConnectionFactory()
): SubscribersRepository {
  const getCollection = () =>
    db.getCollection<SubscribersDocument>("subscribers");

  const mapFromDocument = async (doc: SubscribersDocument) => {
    const email = await crypto.decrypt(doc.encryptedEmail);
    const sub: Subscriber = {
      email,
      createdAt: doc.createdAt,
      keywords: doc.keywords,
      unsubscriptionToken: doc.unsubscriptionToken,
    };
    if (!!doc.verificationToken) sub.verificationToken = doc.verificationToken;
    return sub;
  };

  const mapToDocument = async (sub: Subscriber) => {
    const { email } = sub;
    const encryptedEmail = await crypto.encrypt(email);
    const emailHash = await crypto.digest(email);
    const doc: SubscribersDocument = {
      emailHash,
      encryptedEmail,
      createdAt: sub.createdAt,
      keywords: sub.keywords,
      unsubscriptionToken: sub.unsubscriptionToken,
    };
    if (!!sub.verificationToken) doc.verificationToken = sub.verificationToken;
    return doc;
  };

  const countByEmail = async (email: string) => {
    const collection = await getCollection();
    const emailHash = await crypto.digest(email);
    return collection.countDocuments({ emailHash });
  };

  const insertOne = async (subscriber: Subscriber) => {
    const collection = await getCollection();
    const document = await mapToDocument(subscriber);
    const { acknowledged } = await collection.insertOne(document);
    return acknowledged;
  };

  const findAll = async () => {
    const collection = await getCollection();
    const documents = await collection.find().toArray();
    return Promise.all(documents.map(mapFromDocument));
  };

  const findAllVerified = async () => {
    const collection = await getCollection();
    const documents = await collection
      .find({ verificationToken: { $exists: false } })
      .toArray();
    return Promise.all(documents.map(mapFromDocument));
  };

  const findOneAndRemoveVerificationToken = async (
    verificationToken: string
  ) => {
    const collection = await getCollection();
    const { value } = await collection.findOneAndUpdate(
      { verificationToken },
      { $unset: { verificationToken: "" } }
    );
    return !!value;
  };

  const findOneAndDeleteByToken = async (unsubscriptionToken: string) => {
    const collection = await getCollection();
    const { value } = await collection.findOneAndDelete({
      unsubscriptionToken,
    });
    return !!value;
  };

  return {
    countByEmail,
    insertOne,
    findAll,
    findAllVerified,
    findOneAndDeleteByToken,
    findOneAndRemoveVerificationToken,
  };
}
