import { NextApiHandler } from "next";
import { processRestApiHandlers } from "../common/process-api-handlers";
import { CreateSubscriptionRequest } from "./dto/create-subscriber-request";
import { createSubscriberRequestValidator } from "./dto/create-subscriber-request-validator";

export function SubscribersController(): NextApiHandler {
  const GET: NextApiHandler<void> = (_, r) => r.status(204).end();
  const POST: NextApiHandler<any> = (req, res) => {
    let validatedBody: CreateSubscriptionRequest;
    try {
      validatedBody = createSubscriberRequestValidator(req.body);
    } catch (error: any) {
      const { message } = error;
      return res.status(422).json({ message });
    }
    return res.status(202).end();
  };

  return processRestApiHandlers({ GET, POST });
}
