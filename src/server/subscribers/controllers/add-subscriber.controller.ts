import { NextApiHandler } from "next";
import processRestApiHandlers from "@server/functions/process-rest-api-handlers";
import addSubscriberServiceFactory from "../services/add-subscriber.service";
import AddSubscriberValidatorFactory from "../validators/add-subscriber-request-validator";

export default function addSubscriberController(
  service: AddSubscriberService = addSubscriberServiceFactory(),
  validator: RequestValidator<CreateSubscriptionRequest> = AddSubscriberValidatorFactory()
): NextApiHandler {
  const POST: NextApiHandler = async (req, res) => {
    let validatedBody: CreateSubscriptionRequest;
    try {
      validatedBody = validator.validate(req.body);
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
  return processRestApiHandlers({ POST });
}
