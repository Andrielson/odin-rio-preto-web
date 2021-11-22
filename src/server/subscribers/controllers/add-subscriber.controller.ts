import { NextApiHandler } from "next";
import { Guard } from "@server/types/guard";
import processRestApiHandlers from "@server/functions/process-rest-api-handlers";
import recaptchaGuardFactory from "../guards/recaptcha.guard";
import addSubscriberServiceFactory from "../services/add-subscriber.service";
import AddSubscriberValidatorFactory from "../validators/add-subscriber-request-validator";

export default function addSubscriberController(
  guard: Guard = recaptchaGuardFactory(),
  service: AddSubscriberService = addSubscriberServiceFactory(),
  validator: RequestValidator<CreateSubscriptionRequest> = AddSubscriberValidatorFactory()
): NextApiHandler {
  const POST: NextApiHandler = async (req, res) => {
    const canActivate = await guard.canActivate(req);
    if (!canActivate) {
      return res.status(401).end();
    }

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

    return res.status(201).end();
  };
  return processRestApiHandlers({ POST });
}
