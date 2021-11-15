//https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.js
import { MongoClient } from "mongodb";
import mongodbConfigFactory from "@server/config/mongodb.config";

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default function mongodbConnectionFactory(
  config = mongodbConfigFactory()
) {
  let clientPromise: Promise<MongoClient>;
  if (config.nodeEnv === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(config.uri).connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    clientPromise = new MongoClient(config.uri).connect();
  }

  const getCollection = async <T>(collectionName: string) => {
    const client = await clientPromise;
    return client.db().collection<T>(collectionName);
  };

  return {
    client: clientPromise,
    getCollection,
  };
}
