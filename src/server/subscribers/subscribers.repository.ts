import { getDatabaseCollection } from "@server/db/mongo";
import { CryptoServiceImpl } from "@server/security/crypto.service";
import { SubscribersDocument } from "@server/types/subscribers-document";

export class SubscribersRepositoryImpl implements SubscribersRepository {
  private get getCollection() {
    return getDatabaseCollection<SubscribersDocument>("subscribers");
  }

  constructor(
    private readonly crypto: CryptoService = new CryptoServiceImpl()
  ) {}

  private async mapFromDocument(doc: SubscribersDocument) {
    const email = await this.crypto.decrypt(doc.encryptedEmail);
    const sub: Subscriber = {
      email,
      createdAt: doc.createdAt,
      keywords: doc.keywords,
      unsubscriptionToken: doc.unsubscriptionToken,
    };
    if (!!doc.verificationToken) sub.verificationToken = doc.verificationToken;
    return sub;
  }

  private async mapToDocument(sub: Subscriber) {
    const { email } = sub;
    const encryptedEmail = await this.crypto.encrypt(email);
    const emailHash = await this.crypto.digest(email);
    const doc: SubscribersDocument = {
      emailHash,
      encryptedEmail,
      createdAt: sub.createdAt,
      keywords: sub.keywords,
      unsubscriptionToken: sub.unsubscriptionToken,
    };
    if (!!sub.verificationToken) doc.verificationToken = sub.verificationToken;
    return doc;
  }

  async countByEmail(email: string) {
    const collection = await this.getCollection;
    const emailHash = await this.crypto.digest(email);
    return collection.countDocuments({ emailHash });
  }

  async insertOne(subscriber: Subscriber) {
    const collection = await this.getCollection;
    const document = await this.mapToDocument(subscriber);
    const { acknowledged } = await collection.insertOne(document);
    return acknowledged;
  }

  async findAll() {
    const collection = await this.getCollection;
    const documents = await collection.find().toArray();
    return Promise.all(
      documents.map(async (it) => await this.mapFromDocument(it))
    );
  }

  async findAllVerified() {
    const collection = await this.getCollection;
    const documents = await collection
      .find({ verificationToken: { $exists: false } })
      .toArray();
    return Promise.all(
      documents.map(async (it) => await this.mapFromDocument(it))
    );
  }

  async findOneAndRemoveVerificationToken(verificationToken: string) {
    const collection = await this.getCollection;
    const { value } = await collection.findOneAndUpdate(
      { verificationToken },
      { $unset: { verificationToken: "" } }
    );
    return !!value;
  }

  async findOneAndDeleteByToken(unsubscriptionToken: string) {
    const collection = await this.getCollection;
    const { value } = await collection.findOneAndDelete({
      unsubscriptionToken,
    });
    return !!value;
  }
}
