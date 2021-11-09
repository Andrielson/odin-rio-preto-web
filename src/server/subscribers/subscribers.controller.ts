import { NextApiHandler } from "next";
import { processRestApiHandlers } from "@server/common/process-api-handlers";
import { createSubscriberRequestValidator } from "@server/subscribers/dto/create-subscriber-request-validator";
import { SubscribersServiceImpl } from "@server/subscribers/subscribers.service";
import { SubscribersGuard } from "./subscribers.guard";
import { Guard } from "src/types/guard";
import APP_URL from "@server/utils/app-url";

const mapToSubscriberDto = ({
  email,
  keywords,
  unsubscriptionToken,
}: Subscriber): SubscriberDto => ({
  email,
  keywords,
  unsubscribeLink: `${APP_URL}/goodbye/${unsubscriptionToken}`,
});

export function SubscribersController(
  subscribersGuard: Guard = SubscribersGuard(),
  service: SubscribersService = SubscribersServiceImpl()
): NextApiHandler {
  const GET: NextApiHandler<SubscriberDto[]> = async (req, res) => {
    const canActivate = await subscribersGuard.canActivate(req);
    if (!canActivate) {
      return res.status(401).end();
    }
    const subscribers = await service.listSubscribers();
    return subscribers.length > 0
      ? res.json(subscribers.map(mapToSubscriberDto))
      : res.status(204).end();
  };
  const POST: NextApiHandler<any> = async (req, res) => {
    let validatedBody: CreateSubscriptionRequest;
    try {
      validatedBody = createSubscriberRequestValidator(req.body);
    } catch (error: any) {
      const { message } = error;
      return res.status(422).json({ message });
    }
    const { email, keywords } = validatedBody;

    try {
      await service.addSubscriber(email, keywords);
    } catch (error) {
      return res.status(500).send(error);
    }

    return res.status(202).end();
  };

  return processRestApiHandlers({ GET, POST });
}
