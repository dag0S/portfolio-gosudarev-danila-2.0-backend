import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";

import { JWT_ACCESS_TOKEN } from "../const/cookieName";
import { CustomRequestMiddleware } from "../types/CustomReqMiddleware";
import { prisma } from "../prisma/prisma-client";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

export const isAuthenticated = async (
  req: CustomRequestMiddleware,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const accessToken = req.cookies[JWT_ACCESS_TOKEN];

    if (!accessToken) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }

    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET) as { id: string; role: Role };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Ошибка авторизации" });
  }
};
