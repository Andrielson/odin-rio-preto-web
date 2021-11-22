import { NextApiRequest } from "next";
import { Guard } from "@server/types/guard";
import recaptchaServerConfigFromEnvFactory from "@server/config/recaptcha-server.config";

export default function recaptchaGuardFactory(
  config: RecaptchaServerConfig = recaptchaServerConfigFromEnvFactory()
): Guard {
  const contentType = "application/x-www-form-urlencoded; charset=utf-8";
  const headers = { "Content-Type": contentType };
  const method = "POST";
  const { enabled, secretKey, url } = config;

  const canActivate = async (request: NextApiRequest) => {
    if (!enabled) return true;

    const authorizationHeader = request.headers.authorization ?? "Bearer token";
    const token = authorizationHeader.split(" ")[1];

    const params = new URLSearchParams({
      response: token,
      secret: secretKey,
    });

    if (!!request.socket.remoteAddress) {
      params.append("remoteip", request.socket.remoteAddress);
    }

    const body = params.toString();
    try {
      const response = await fetch(url, { body, headers, method });
      const recaptchaResponse: RecaptchaResponse = await response.json();
      return recaptchaResponse.success && recaptchaResponse.score >= 0.5;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  return { canActivate };
}
