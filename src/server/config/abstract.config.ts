export abstract class AbstractConfigFromEnv {
  constructor(env: NodeJS.ProcessEnv, required?: string[]) {
    if (!!required) {
      this.inspectRequiredOptions(env, required);
    }
  }

  protected inspectRequiredOptions(env: NodeJS.ProcessEnv, required: string[]) {
    const missing = required.filter((it) => !env[it]).join(", ");
    if (!!missing) {
      throw new Error(
        `Please define the ${missing} environment variable(s) inside .env.local`
      );
    }
  }
}
