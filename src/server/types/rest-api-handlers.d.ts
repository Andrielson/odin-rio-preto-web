import { NextApiHandler } from "next";

declare type RestApiHandlers = {
  [k: string]: NextApiHandler;
};
