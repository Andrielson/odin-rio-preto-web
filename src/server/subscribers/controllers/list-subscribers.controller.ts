import { NextApiHandler } from "next";
import { Guard } from "@server/types/guard";
import APP_URL from "@server/constants/app-url";
import processRestApiHandlers from "@server/functions/process-rest-api-handlers";
import subscribersGuardFactory from "../guards/subscribers.guard";
import listSubscribersServiceFactory from "../services/list-subscribers.service";

export default function listSubscribersController(
  guard: Guard = subscribersGuardFactory(),
  service: ListSubscribersService = listSubscribersServiceFactory()
): NextApiHandler {
  const mapToSubscriberDto = (subscriber: Subscriber) => {
    const { email, keywords, unsubscriptionToken } = subscriber;
    return {
      email,
      keywords,
      unsubscribeLink: `${APP_URL}/goodbye/${unsubscriptionToken}`,
    } as SubscriberDto;
  };
  const GET: NextApiHandler<SubscriberDto[]> = async (req, res) => {
    const canActivate = await guard.canActivate(req);
    if (!canActivate) {
      return res.status(401).end();
    }
    const subscribers = await service.listSubscribers();
    return subscribers.length > 0
      ? res.json(subscribers.map(mapToSubscriberDto))
      : res.status(204).end();
  };

  return processRestApiHandlers({ GET });
}
