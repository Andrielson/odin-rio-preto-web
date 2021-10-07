import { createTransport } from "nodemailer";

function getAuthOptions() {
  const user = process.env.NODEMAILER_SMTP_USER as string;
  const pass = process.env.NODEMAILER_SMTP_PASS as string;
  return { auth: { user, pass } };
}

const defaultOptions = ["NODEMAILER_SMTP_USER", "NODEMAILER_SMTP_PASS"];
const wellKnownOptions = [...defaultOptions, "NODEMAILER_WELL_KNOWN"];
const providersOptions = [
  ...defaultOptions,
  "NODEMAILER_SMTP_HOST",
  "NODEMAILER_SMTP_PORT",
  "NODEMAILER_SMTP_SECURE",
];

let options: NodeMailerOptions;
if (wellKnownOptions.every((it) => !!process.env[it])) {
  const service = process.env.NODEMAILER_WELL_KNOWN as string;
  options = { service, ...getAuthOptions() };
} else if (providersOptions.every((it) => !!process.env[it])) {
  const host = process.env.NODEMAILER_SMTP_HOST as string;
  const port = process.env.NODEMAILER_SMTP_PORT as string;
  const secure = String(process.env.NODEMAILER_SMTP_SECURE) === "true";
  options = { host, port, secure, ...getAuthOptions() };
} else {
  const missing = providersOptions.filter((it) => !process.env[it]).join(", ");
  throw new Error(
    `Please define the ${missing} environment variable(s) inside .env.local`
  );
}

options.pool =
  !!process.env.NODEMAILER_SMTP_POOL &&
  process.env.NODEMAILER_SMTP_POOL === "true";

console.log({ options });

export default createTransport(options as any);

interface NodeMailerOptions {
  service?: string;
  host?: string;
  port?: string;
  secure?: boolean;
  pool?: boolean;
  auth: {
    user: string;
    pass: string;
  };
}
