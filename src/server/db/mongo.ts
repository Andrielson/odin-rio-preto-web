//https://github.com/vercel/next.js/blob/canary/examples/with-mongodb/lib/mongodb.js
import { MongoClient } from "mongodb";
import { MongodbConfig } from "@server/config/mongodb.config";

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export class MongodbConnection {
  private readonly clientPromise: Promise<MongoClient>;

  get client() {
    return this.clientPromise;
  }

  constructor(config = new MongodbConfig()) {
    let client: MongoClient;
    if (config.nodeEnv === "development") {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      if (!global._mongoClientPromise) {
        client = new MongoClient(config.uri);
        global._mongoClientPromise = client.connect();
      }
      this.clientPromise = global._mongoClientPromise;
    } else {
      // In production mode, it's best to not use a global variable.
      client = new MongoClient(config.uri);
      this.clientPromise = client.connect();
    }
  }

  async getCollection<T>(collectionName: string) {
    const client = await this.clientPromise;
    return client.db().collection<T>(collectionName);
  }
}
