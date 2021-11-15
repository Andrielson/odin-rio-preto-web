import Joi from "joi";

export default function AddSubscriberValidatorFactory(): RequestValidator<CreateSubscriptionRequest> {
  const validate = (requestBody: any): CreateSubscriptionRequest => {
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
  };
  return { validate };
}
