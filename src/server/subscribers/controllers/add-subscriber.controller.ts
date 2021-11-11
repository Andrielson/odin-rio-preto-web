import { AbstractController } from "@server/controllers/abstract.controller";
import { createSubscriberRequestValidator } from "@server/subscribers/dto/create-subscriber-request-validator";
import { AddSubscriberServiceImpl } from "../services/add-subscriber.service";

export class AddSubscriberController extends AbstractController {
  constructor(service: AddSubscriberService = new AddSubscriberServiceImpl()) {
    super();
    this.configurePostHandler(service);
  }

  private configurePostHandler(service: AddSubscriberService) {
    this.handlers.POST = async (req, res) => {
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
  }
}
