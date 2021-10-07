if (!process.env.APP_URL && !process.env.VERCEL_URL)
  throw new Error(
    "Please define the APP_URL environment variable inside .env.local"
  );
const APP_URL = (process.env.APP_URL ?? process.env.VERCEL_URL) as string;
export default APP_URL;
