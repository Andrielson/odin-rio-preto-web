import { AbstractController } from "@server/controllers/abstract.controller";
import { AddSubscriberServiceImpl } from "../services/add-subscriber.service";
import { AddSubscriberValidator } from "../validators/add-subscriber-request-validator";

export class AddSubscriberController extends AbstractController {
  constructor(
    service: AddSubscriberService = new AddSubscriberServiceImpl(),
    validator: RequestValidator<CreateSubscriptionRequest> = new AddSubscriberValidator()
  ) {
    super();
    this.configurePostHandler(service, validator);
  }

  private configurePostHandler(
    service: AddSubscriberService,
    validator: RequestValidator<CreateSubscriptionRequest>
  ) {
    this.handlers.POST = async (req, res) => {
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
  }
}
