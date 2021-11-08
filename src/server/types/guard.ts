import { NextApiRequest } from "next";

export interface Guard {
  canActivate(request: NextApiRequest): Promise<boolean>;
}
