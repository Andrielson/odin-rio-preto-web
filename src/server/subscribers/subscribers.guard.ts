import { NextApiRequest } from "next";
import * as jwt from "jsonwebtoken";
import { Guard } from "@server/types/guard";

export function SubscribersGuard(): Guard {
  const canActivate = (req: NextApiRequest) => {
    const authorizationHeader = req.headers.authorization ?? "Bearer token";
    const token = authorizationHeader.split(" ")[1];
    try {
      jwt.verify(token, "25nOkcpvLorpsSBrV1LmTbAslWbojrkZ", {
        audience: "https://riopreto.diario.tk/api",
        issuer: "https://dev-1tg5qqmy.us.auth0.com/",
      });
    } catch (error) {
      return Promise.reject(false);
    }
    return Promise.resolve(true);
  };
  return {
    canActivate,
  };
}
