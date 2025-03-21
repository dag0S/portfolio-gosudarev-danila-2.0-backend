import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";

import { RegisterAuthDto } from "../dtos/RegisterAuth.dto";
import { prisma } from "../prisma/prisma-client";
import { LoginAuthDto } from "../dtos/LoginAuth.dto";
import { COOKIE_NAME } from "../const/cookieName";

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * @route POST /api/auth/register
 * @desc Регистрация
 * @access Public
 */
export const register = async (
  req: Request<{}, {}, RegisterAuthDto>,
  res: Response
): Promise<any> => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({
        message: "Пожалуйста, заполните обязательные поля",
      });
    }

    const registeredUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (registeredUser) {
      return res.status(400).json({
        message: "Пользователь с таким email уже существует",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashPassword,
        role: Role.READER,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Не удалось создать пользователя",
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "15M",
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    return res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarURL: user.avatarURL,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
};

/**
 * @route POST /api/auth/login
 * @desc Логин
 * @access Public
 */
export const login = async (
  req: Request<{}, {}, LoginAuthDto>,
  res: Response
): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Пожалуйста, заполните обязательные поля",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "15M",
    });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatarURL: user.avatarURL,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
};

/**
 * @route POST /api/auth/logout
 * @desc Выход из системы
 * @access Public
 */
export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie(COOKIE_NAME);

    return res.json({ message: "Вы вышли из системы" });
  } catch (error) {
    return res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
};

/**
 * @route GET /api/auth/me
 * @desc Получение данных о пользователе с помощью токена
 * @access Private
 */
export const me = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarURL: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
};
