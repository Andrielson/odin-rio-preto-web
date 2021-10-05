import { NextApiHandler } from "next";
import { processRestApiHandlers } from "../common/process-api-handlers";
import { CreateSubscriptionRequest } from "./dto/create-subscriber-request";
import { createSubscriberRequestValidator } from "./dto/create-subscriber-request-validator";
import { SubscribersServiceImpl } from "./subscribers.service";
import { Subscriber } from "./types/subscriber.interface";
import { SubscribersService } from "./types/subscribers-service.interface";

type SubscriberDto = Pick<
  Subscriber,
  "email" | "keywords" | "unsubscriptionToken"
>;

const mapToSubscriberDto = ({
  email,
  keywords,
  unsubscriptionToken,
}: Subscriber): SubscriberDto => ({ email, keywords, unsubscriptionToken });

export function SubscribersController(
  service: SubscribersService = SubscribersServiceImpl()
): NextApiHandler {
  const GET: NextApiHandler<SubscriberDto[]> = async (_, r) => {
    const subscribers = await service.listSubscribers();
    return subscribers.length > 0
      ? r.json(subscribers.map(mapToSubscriberDto))
      : r.status(204).end();
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
      service.addSubscriber(email, keywords);
    } catch (error) {
      return res.status(500).json({ error });
    }

    return res.status(202).end();
  };

  return processRestApiHandlers({ GET, POST });
}
