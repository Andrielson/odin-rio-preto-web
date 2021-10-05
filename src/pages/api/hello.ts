import type { NextApiHandler } from "next";
import crypto from "crypto";

const handler: NextApiHandler<String> = (_, res) =>
  res.send(crypto.randomUUID());

export default handler;
