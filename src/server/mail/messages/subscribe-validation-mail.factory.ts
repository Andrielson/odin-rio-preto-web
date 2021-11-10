import { MailMessageConfigFromEnv } from "@server/config/mail-message.config";
import { MailFactory } from "../mail.factory";

export class SubscribeValidationMailFactory extends MailFactory {
  constructor(config: MailFactoryConfig = new MailMessageConfigFromEnv()) {
    super(config);
  }

  private getContentFromFile(
    template: string,
    keywordsList: string[],
    validationLink: string,
    unsubscribeLink: string
  ) {
    const templateWithKeywords = template.replace(
      /%KEYWORDS%/g,
      keywordsList.join("\n")
    );

    const templateWithValidationLink = templateWithKeywords.replace(
      /%VALIDATION_LINK%/g,
      validationLink
    );

    const templateWithUnsubscribeLink = templateWithValidationLink.replace(
      /%UNSUBSCRIBE_LINK%/g,
      unsubscribeLink
    );

    const templateWithAssetsUrl = templateWithUnsubscribeLink.replace(
      /%MAIL_ASSETS_URL%/g,
      this.config.assetsUrl
    );

    return templateWithAssetsUrl.replace(/%APP_URL%/g, this.config.appUrl);
  }

  async getMessage(
    to: string,
    keywords: string[],
    validationLink: string,
    unsubscribeLink: string
  ): Promise<MailMessage> {
    const subject = "Confirme sua inscrição";
    const htmlfile = await this.getMailTemplate("subscribe-validation.xhtml");
    const textfile = await this.getMailTemplate("subscribe-validation.txt");

    const html = this.getContentFromFile(
      htmlfile,
      keywords.map((k) => `<li>${k === "*" ? "Todas as publicações" : k}</li>`),
      validationLink,
      unsubscribeLink
    );

    const text = this.getContentFromFile(
      textfile,
      keywords.map((k) => `• ${k === "*" ? "Todas as publicações" : k}`),
      validationLink,
      unsubscribeLink
    );

    return { html, subject, text, to };
  }
}
