import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import jwt from "jsonwebtoken";

import { RegisterAuthDto } from "../dtos/RegisterAuth.dto";
import { prisma } from "../prisma/prisma-client";
import { LoginAuthDto } from "../dtos/LoginAuth.dto";
import { JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN } from "../const/cookieName";
import { generateTokens } from "../utils/generateTokens";

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

const isProd = process.env.NODE_ENV === "production";

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

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie(JWT_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: isProd,
      domain: process.env.COOKIE_DOMAIN,
      sameSite: isProd ? "none" : "lax",
      maxAge: 10 * 60 * 1000,
    });

    res.cookie(JWT_REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: isProd,
      domain: process.env.COOKIE_DOMAIN,
      sameSite: isProd ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({ message: "Пользователь зарегистрирован" });
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

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie(JWT_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: isProd,
      domain: process.env.COOKIE_DOMAIN,
      sameSite: isProd ? "none" : "lax",
      maxAge: 10 * 60 * 1000,
    });

    res.cookie(JWT_REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: isProd,
      domain: process.env.COOKIE_DOMAIN,
      sameSite: isProd ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Пользователь успешно зашел в систему" });
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

    res.clearCookie(JWT_ACCESS_TOKEN, {
      httpOnly: true,
      secure: isProd,
      domain: process.env.COOKIE_DOMAIN,
      sameSite: isProd ? "none" : "lax",
    });
    res.clearCookie(JWT_REFRESH_TOKEN, {
      httpOnly: true,
      secure: isProd,
      domain: process.env.COOKIE_DOMAIN,
      sameSite: isProd ? "none" : "lax",
    });

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
    const accessToken = req.cookies[JWT_ACCESS_TOKEN];

    if (!accessToken) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }

    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET) as {
      id: string;
      role: Role;
    };

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

/**
 * @route POST /api/auth/refresh
 * @desc Получение нового токена доступа (access token) с помощью токена обновления (refresh token)
 * @access Public
 */
export const refresh = async (req: Request, res: Response): Promise<any> => {
  try {
    const refreshToken = req.cookies[JWT_REFRESH_TOKEN];

    if (!refreshToken) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      id: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).json({ message: "Пользователь не найден" });
    }

    const { accessToken } = generateTokens(user);

    res.cookie(JWT_ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: isProd,
      domain: process.env.COOKIE_DOMAIN,
      sameSite: isProd ? "none" : "lax",
      maxAge: 10 * 60 * 1000,
    });

    return res.status(200).json({ message: "Токен доступа обновлен" });
  } catch (error) {
    return res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
};
