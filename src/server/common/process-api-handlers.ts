import { NextApiHandler } from "next";
import { RestApiHandlers } from "@server/types/rest-api-handlers.type";

export function processRestApiHandlers(
  handlers: RestApiHandlers
): NextApiHandler {
  const allowedMethods = Object.keys(handlers);
  const default405 = { Allow: allowedMethods.sort().join() };

  return (request, response) => {
    const requestMethod = String(request.method).toUpperCase();

    return allowedMethods.map((m) => m.toUpperCase()).includes(requestMethod)
      ? handlers[requestMethod](request, response)
      : response.writeHead(405, default405).end();
  };
}
