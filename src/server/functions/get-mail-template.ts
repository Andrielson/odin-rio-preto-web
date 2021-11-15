export default async function getMailTemplate(
  filename: string,
  config: MailFactoryConfig
) {
  const response = await fetch(`${config.templatesUrl}/${filename}`);
  const template = await response.text();
  return template;
}
