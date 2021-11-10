import { AbstractConfigFromEnv } from "@server/config/abstract.config";

const required = ["MONGODB_URI", "NODE_ENV"];

export class MongodbConfig extends AbstractConfigFromEnv {
  readonly uri: string;
  readonly nodeEnv: "development" | "production" | "test";

  constructor(env: NodeJS.ProcessEnv = process.env) {
    super(env, required);
    this.uri = env.MONGODB_URI!;
    this.nodeEnv = env.NODE_ENV;
  }
}
