import http from "http";
import https from "https";

if (!process.env.MAIL_TEMPLATES_URL)
  throw new Error(
    "Please define the MAIL_TEMPLATES_URL environment variable inside .env.local"
  );

const MAIL_TEMPLATES_URL = process.env.MAIL_TEMPLATES_URL;

const httpClient = MAIL_TEMPLATES_URL.startsWith("https://") ? https : http;

export const getMailTemplate = (filename: string) =>
  new Promise<string>((resolve, reject) => {
    const url = `${MAIL_TEMPLATES_URL}/${filename}`;
    const req = httpClient.get(url, (res) => {
      res.setEncoding("utf8");
      res.on("data", (data) => resolve(data));
      res.on("error", (error) => reject(error));
    });
    req.on("error", (error) => reject(error));
  });
