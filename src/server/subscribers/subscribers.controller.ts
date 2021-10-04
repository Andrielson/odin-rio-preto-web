import { NextApiHandler } from "next";
import { processRestApiHandlers } from "../common/process-api-handlers";
import { CreateSubscriptionRequest } from "./dto/create-subscriber-request";
import { createSubscriberRequestValidator } from "./dto/create-subscriber-request-validator";
import { SubscribersService } from "./subscribers-service.interface";
import { SubscribersServiceImpl } from "./subscribers.service";

export function SubscribersController(
  service: SubscribersService = SubscribersServiceImpl()
): NextApiHandler {
  const GET: NextApiHandler<void> = (_, r) => r.status(204).end();
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
