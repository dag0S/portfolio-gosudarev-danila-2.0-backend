import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

import { COOKIE_NAME } from "../const/cookieName";
import { CustomRequestMiddleware } from "../types/CustomReqMiddleware";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const isAuthenticated = async (
  req: CustomRequestMiddleware,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: Role };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Ошибка авторизации" });
  }
};
