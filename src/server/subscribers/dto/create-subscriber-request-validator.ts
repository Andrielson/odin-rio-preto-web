import Joi from "joi";
import { CreateSubscriptionRequest } from "./create-subscriber-request";

export function createSubscriberRequestValidator(
  requestBody: any
): CreateSubscriptionRequest {
  const schema = Joi.object<CreateSubscriptionRequest>({
    email: Joi.string().email().required(),
    keywords: Joi.array()
      .items(Joi.string())
      .unique((a: string, b: string) => a.toLowerCase() === b.toLowerCase())
      .required(),
  });
  const validation = schema.validate(requestBody);
  if (!!validation.error) {
    throw validation.error;
  }
  return validation.value;
}
