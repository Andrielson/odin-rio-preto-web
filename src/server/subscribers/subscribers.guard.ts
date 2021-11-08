import { NextApiRequest } from "next";
import * as jwt from "jsonwebtoken";
import { Guard } from "@server/types/guard";

const missing = ["OAUTH_AUDIENCE", "OAUTH_ISSUER", "OAUTH_SECRET_KEY"]
  .filter((it) => !process.env[it])
  .join(", ");
if (!!missing) {
  throw new Error(
    `Please define the ${missing} environment variable(s) inside .env.local`
  );
}

const secretKey = process.env.OAUTH_SECRET_KEY!;
const audience = process.env.OAUTH_AUDIENCE;
const issuer = process.env.OAUTH_ISSUER;

const verifyToken = (token: string) =>
  jwt.verify(token, secretKey, { audience, issuer });

export function SubscribersGuard(): Guard {
  const canActivate = (req: NextApiRequest) => {
    const authorizationHeader = req.headers.authorization ?? "Bearer token";
    const token = authorizationHeader.split(" ")[1];
    try {
      verifyToken(token);
    } catch (error) {
      return Promise.reject(false);
    }
    return Promise.resolve(true);
  };
  return {
    canActivate,
  };
}
