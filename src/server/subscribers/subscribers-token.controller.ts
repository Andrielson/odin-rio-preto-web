import { NextApiHandler } from "next";
import { processRestApiHandlers } from "../common/process-api-handlers";
import { SubscribersServiceImpl } from "./subscribers.service";
import { SubscribersService } from "./types/subscribers-service.interface";

export function SubscribersTokenController(
  service: SubscribersService = SubscribersServiceImpl()
): NextApiHandler {
  const PATCH: NextApiHandler<any> = async (request, response) => {
    const token = request.query.token as string;
    try {
      await service.verifyByToken(token);
      return response.status(204).end();
    } catch (err) {
      return response.status(400).send(err);
    }
  };
  const DELETE: NextApiHandler<any> = async (request, response) => {
    const token = request.query.token as string;
    try {
      await service.unsubscribeByToken(token);
      return response.status(204).end();
    } catch (err) {
      return response.status(400).send(err);
    }
  };
  return processRestApiHandlers({ DELETE, PATCH });
}
