import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import OAuthConfigFromEnvFactory from "@server/config/oauth.config";
import { Guard } from "@server/types/guard";

export default function SubscribersGuardFactory(
  config: OAuthConfig = OAuthConfigFromEnvFactory()
): Guard {
  const canActivate = async (request: NextApiRequest) => {
    const { audience, enabled, issuer, secretKey } = config;

    if (!enabled) return true;

    const authorizationHeader = request.headers.authorization ?? "Bearer token";
    const token = authorizationHeader.split(" ")[1];

    try {
      jwt.verify(token, secretKey, { audience, issuer });
    } catch (error) {
      return false;
    }

    return true;
  };
  return { canActivate };
}
