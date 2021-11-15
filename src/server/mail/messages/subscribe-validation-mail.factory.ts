import mailMessageConfigFromEnvFactory from "@server/config/mail-message.config";
import getMailTemplate from "@server/functions/get-mail-template";

export default function subscribeValidationMailFactory(
  config: MailFactoryConfig = mailMessageConfigFromEnvFactory()
) {
  const getContentFromFile = (
    template: string,
    keywordsList: string[],
    validationLink: string,
    unsubscribeLink: string
  ) => {
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
      config.assetsUrl
    );

    return templateWithAssetsUrl.replace(/%APP_URL%/g, config.appUrl);
  };

  const getMessage = async (
    to: string,
    keywords: string[],
    validationLink: string,
    unsubscribeLink: string
  ): Promise<MailMessage> => {
    const subject = "Confirme sua inscrição";
    const htmlfile = await getMailTemplate(
      "subscribe-validation.xhtml",
      config
    );
    const textfile = await getMailTemplate("subscribe-validation.txt", config);

    const html = getContentFromFile(
      htmlfile,
      keywords.map((k) => `<li>${k === "*" ? "Todas as publicações" : k}</li>`),
      validationLink,
      unsubscribeLink
    );

    const text = getContentFromFile(
      textfile,
      keywords.map((k) => `• ${k === "*" ? "Todas as publicações" : k}`),
      validationLink,
      unsubscribeLink
    );

    return { html, subject, text, to };
  };

  return { getMessage };
}
