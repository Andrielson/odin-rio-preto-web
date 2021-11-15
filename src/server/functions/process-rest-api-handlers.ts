import { NextApiHandler } from "next";

export default function processRestApiHandlers(handlers: {
  [k: string]: NextApiHandler;
}): NextApiHandler {
  const allowedMethods = Object.keys(handlers);
  const default405 = { Allow: allowedMethods.sort().join() };

  return (request, response) => {
    const requestMethod = String(request.method).toUpperCase();

    return allowedMethods.map((m) => m.toUpperCase()).includes(requestMethod)
      ? handlers[requestMethod](request, response)
      : response.writeHead(405, default405).end();
  };
}
