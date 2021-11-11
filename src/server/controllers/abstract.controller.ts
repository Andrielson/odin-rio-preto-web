import { NextApiHandler } from "next";

export class AbstractController {
  protected readonly handlers: { [k: string]: NextApiHandler } = {};

  processRestApiHandlers(): NextApiHandler {
    const allowedMethods = Object.keys(this.handlers);
    const default405 = { Allow: allowedMethods.sort().join(", ") };

    return (request, response) => {
      const requestMethod = String(request.method).toUpperCase();

      return allowedMethods.map((m) => m.toUpperCase()).includes(requestMethod)
        ? this.handlers[requestMethod](request, response)
        : response.writeHead(405, default405).end();
    };
  }
}
