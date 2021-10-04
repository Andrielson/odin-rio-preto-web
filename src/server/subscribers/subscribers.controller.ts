import { NextApiHandler } from "next";
import { ProcessRestApiHandlers } from "../common/process-api-handlers";

export function SubscribersController(): NextApiHandler {
  const GET: NextApiHandler<void> = (_, r) => r.status(204).end();
  const POST: NextApiHandler<void> = (_, r) => r.status(202).end();

  return ProcessRestApiHandlers({ GET, POST });
}
