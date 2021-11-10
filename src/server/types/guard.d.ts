import { NextApiRequest } from "next";

declare interface Guard {
  canActivate(request: NextApiRequest): Promise<boolean>;
}
