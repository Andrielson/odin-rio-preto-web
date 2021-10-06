import { NextApiHandler } from "next";
import { processRestApiHandlers } from "../common/process-api-handlers";
import { SubscribersServiceImpl } from "./subscribers.service";
import { SubscribersService } from "./types/subscribers-service.interface";

export function SubscribersTokenController(
  service: SubscribersService = SubscribersServiceImpl()
): NextApiHandler {
  const DELETE: NextApiHandler<any> = async (request, response) => {
    const token = request.query.token as string;
    try {
      await service.unsubscribeByToken(token);
    } catch (err) {
      return response.status(400).send(err);
    }
    return response.status(204).end();
  };
  const GET: NextApiHandler<void> = (_, r) => r.redirect("/goodbye").end();
  const PATCH: NextApiHandler<any> = async (request, response) => {
    const token = request.query.token as string;
    try {
      await service.verifyByToken(token);
    } catch (err) {
      return response.status(400).send(err);
    }
    return response.status(204).end();
  };
  return processRestApiHandlers({ DELETE, GET, PATCH });
}
