import { getDatabaseCollection } from "../db/mongo";
import { Subscriber } from "./subscriber.interface";
import { SubscribersRepository } from "./subscribers-repository.interface";

export function SubscribersRepositoryImpl(): SubscribersRepository {
  const getCollection = getDatabaseCollection<Subscriber>("subscribers");

  const countByEmail = async (email: string) => {
    const collection = await getCollection;
    return collection.countDocuments({ email });
  };
  const insertOne = async (subscriber: Subscriber) => {
    const collection = await getCollection;
    const { acknowledged } = await collection.insertOne(subscriber);
    return acknowledged;
  };

  return {
    countByEmail,
    insertOne,
  };
}
