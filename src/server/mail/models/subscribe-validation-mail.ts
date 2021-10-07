import { MailMessage } from "@server/mail/types/mail-message.interface";

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

const htmlfile = `
<html>
<head>
<title>Confirme sua inscrição</title>
</head>
<body>
<h1>Boletim do Diário Oficial - São José do Rio Preto/SP</h1>
<ul>
<li><a href="%VALIDATION_LINK%">Welcome!</a></li>
<li><a href="%UNSUBSCRIBE_LINK%">Goodbye!</a></li>
</ul>
</body>
</html>
`;
const textfile = `
Boletim do Diário Oficial - São José do Rio Preto/SP

Welcome: %VALIDATION_LINK%
Goodbye: %UNSUBSCRIBE_LINK%
`;
const subject = "Confirme sua inscrição";

export function SubscribeValidationMail(
  to: string,
  validationLink: string,
  unsubscribeLink: string
): MailMessage {
  const html = getContentFromFile(htmlfile, validationLink, unsubscribeLink);
  const text = getContentFromFile(textfile, validationLink, unsubscribeLink);
  return { html, subject, text, to };
}
