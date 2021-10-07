import type { NextApiHandler } from "next";
import crypto from "crypto";

const url = process.env.VERCEL_URL ?? "unknown";
const uid = crypto.randomUUID();

const handler: NextApiHandler<any> = (_, res) => res.json({ uid, url });

export default handler;
