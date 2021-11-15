import { AbstractController } from "@server/controllers/abstract.controller";
import { Guard } from "@server/types/guard";
import APP_URL from "@server/constants/app-url";
import { ListSubscribersServiceImpl } from "../services/list-subscribers.service";
import { SubscribersGuard } from "../subscribers.guard";

export class ListSubscribersController extends AbstractController {
  constructor(
    guard: Guard = new SubscribersGuard(),
    service: ListSubscribersService = new ListSubscribersServiceImpl()
  ) {
    super();
    this.configureGetHandler(guard, service);
  }

  private configureGetHandler(guard: Guard, service: ListSubscribersService) {
    this.handlers.GET = async (req, res) => {
      const canActivate = await guard.canActivate(req);
      if (!canActivate) {
        return res.status(401).end();
      }
      const subscribers = await service.listSubscribers();
      return subscribers.length > 0
        ? res.json(subscribers.map((it) => this.mapToSubscriberDto(it)))
        : res.status(204).end();
    };
  }

  private mapToSubscriberDto(subscriber: Subscriber) {
    const { email, keywords, unsubscriptionToken } = subscriber;
    return {
      email,
      keywords,
      unsubscribeLink: `${APP_URL}/goodbye/${unsubscriptionToken}`,
    } as SubscriberDto;
  }
}
