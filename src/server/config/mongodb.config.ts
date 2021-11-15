import checkRequiredOptionsFromEnv from "@server/functions/check-required-options-from-env";

export default function mongodbConfigFactory(
  env: NodeJS.ProcessEnv = process.env
): MongodbConfig {
  const required = ["MONGODB_URI", "NODE_ENV"];
  checkRequiredOptionsFromEnv(env, required);
  const uri = env.MONGODB_URI!;
  const nodeEnv = env.NODE_ENV;

  return { nodeEnv, uri };
}
