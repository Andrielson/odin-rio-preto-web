import { NextApiHandler } from "next";

export interface RestApiHandlers {
  [k: string]: NextApiHandler;
}
