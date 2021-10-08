if (!process.env.MAIL_TEMPLATES_URL)
  throw new Error(
    "Please define the MAIL_TEMPLATES_URL environment variable inside .env.local"
  );

const MAIL_TEMPLATES_URL = process.env.MAIL_TEMPLATES_URL;

export async function getMailTemplate(filename: string) {
  const response = await fetch(`${MAIL_TEMPLATES_URL}/${filename}`);
  const template = await response.text();
  return template;
}
