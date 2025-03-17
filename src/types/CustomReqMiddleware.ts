import { Role } from "@prisma/client";
import { Request } from "express";

export interface CustomRequestMiddleware extends Request<any> {
  user?: { id: string; role: Role };
}
