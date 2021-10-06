import { NextApiHandler } from "next";
import { processRestApiHandlers } from "../../../server/common/process-api-handlers";
import { SubscribersServiceImpl } from "../../../server/subscribers/subscribers.service";
import { SubscribersService } from "../../../server/subscribers/types/subscribers-service.interface";

export const UnsubscribeHandler = (
  service: SubscribersService = SubscribersServiceImpl()
): NextApiHandler => {
  const GET: NextApiHandler<any> = async (request, response) => {
    const token = request.query.token as string;
    try {
      await service.unsubscribeByToken(token);
    } catch (err) {
      return response.status(400).send(err);
    }
    return response.redirect(`/goodbye?t=${token}`).end();
  };
  return processRestApiHandlers({ GET });
};

export default UnsubscribeHandler();
