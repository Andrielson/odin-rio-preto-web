import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { OAuthConfigFromEnv } from "@server/config/oauth.config";
import { Guard } from "@server/types/guard";

export class SubscribersGuard implements Guard {
  constructor(
    private readonly config: OAuthConfig = new OAuthConfigFromEnv()
  ) {}

  async canActivate(request: NextApiRequest) {
    const { audience, enabled, issuer, secretKey } = this.config;

    if (!enabled) return true;

    const authorizationHeader = request.headers.authorization ?? "Bearer token";
    const token = authorizationHeader.split(" ")[1];

    try {
      jwt.verify(token, secretKey, { audience, issuer });
    } catch (error) {
      return false;
    }

    return true;
  }
}
