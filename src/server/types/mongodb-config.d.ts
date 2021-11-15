declare interface MongodbConfig {
  readonly uri: string;
  readonly nodeEnv: "development" | "production" | "test";
}
