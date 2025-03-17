import { Role } from "@prisma/client";
import { NextFunction, Response } from "express";

import { CustomRequestMiddleware } from "../types/CustomReqMiddleware";

export const checkRole = (roles: Role[]) => {
  return (req: CustomRequestMiddleware, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    next();
  };
};
