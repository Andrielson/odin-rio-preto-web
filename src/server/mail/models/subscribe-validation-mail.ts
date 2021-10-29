import { MailMessage } from "@server/mail/types/mail-message.interface";
import { getMailTemplate } from "../utils/get-mail-template";
import APP_URL from "@server/utils/app-url";

const MAIL_ASSETS_URL = process.env.MAIL_ASSETS_URL ?? `${APP_URL}/assets`;

function getContentFromFile(
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
    MAIL_ASSETS_URL
  );

  return templateWithAssetsUrl.replace(/%APP_URL%/g, APP_URL);
}

const subject = "Confirme sua inscrição";

export async function SubscribeValidationMail(
  to: string,
  keywords: string[],
  validationLink: string,
  unsubscribeLink: string
): Promise<MailMessage> {
  const htmlfile = await getMailTemplate("subscribe-validation.xhtml");
  const textfile = await getMailTemplate("subscribe-validation.txt");

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
  return { subject, html, text, to };
}
