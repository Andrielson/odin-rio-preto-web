import { MailMessage } from "@server/mail/types/mail-message.interface";
import { getMailTemplate } from "../utils/get-mail-template";

function getContentFromFile(
  template: string,
  validationLink: string,
  unsubscribeLink: string
) {
  const templateWithValidationLink = template.replace(
    /%VALIDATION_LINK%/g,
    validationLink
  );
  return templateWithValidationLink.replace(
    /%UNSUBSCRIBE_LINK%/g,
    unsubscribeLink
  );
}

const subject = "Confirme sua inscrição";

export async function SubscribeValidationMail(
  to: string,
  validationLink: string,
  unsubscribeLink: string
): Promise<MailMessage> {
  const htmlfile = await getMailTemplate("subscribe-validation.xhtml");
  const textfile = await getMailTemplate("subscribe-validation.txt");
  const html = getContentFromFile(htmlfile, validationLink, unsubscribeLink);
  const text = getContentFromFile(textfile, validationLink, unsubscribeLink);
  return { html, subject, text, to };
}
