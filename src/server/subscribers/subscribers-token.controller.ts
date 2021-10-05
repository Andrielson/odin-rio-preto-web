import { NextApiHandler } from "next";
import { processRestApiHandlers } from "../common/process-api-handlers";
import { Subscriber } from "./subscriber.interface";
import { SubscribersService } from "./subscribers-service.interface";
import { SubscribersServiceImpl } from "./subscribers.service";

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
  const DELETE: NextApiHandler<string> = async (request, response) => {
    const token = request.query.token as string;
    return response.send(token);
  };
  return processRestApiHandlers({ DELETE, PATCH });
}
