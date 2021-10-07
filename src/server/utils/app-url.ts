let APP_URL: string;

if (!!process.env.APP_URL) APP_URL = process.env.APP_URL;
else if (!!process.env.VERCEL_URL)
  APP_URL = `https://${process.env.VERCEL_URL}`;
else
  throw new Error(
    "Please define the APP_URL environment variable inside .env.local"
  );

export default APP_URL;
