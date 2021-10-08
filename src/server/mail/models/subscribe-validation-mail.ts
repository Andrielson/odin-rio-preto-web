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
  console.log({ htmlfile });
  const textfile = await getMailTemplate("subscribe-validation.txt");
  console.log({ textfile });
  const html = getContentFromFile(htmlfile, validationLink, unsubscribeLink);
  console.log({ html });
  const text = getContentFromFile(textfile, validationLink, unsubscribeLink);
  console.log({ text });
  return { html, subject, text, to };
}
