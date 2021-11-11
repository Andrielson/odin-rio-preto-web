export abstract class MailFactory {
  constructor(protected readonly config: MailFactoryConfig) {}

  protected async getMailTemplate(filename: string) {
    const response = await fetch(`${this.config.templatesUrl}/${filename}`);
    const template = await response.text();
    return template;
  }

  abstract getMessage(to: string, ...otherArgs: any): Promise<MailMessage>;
}
