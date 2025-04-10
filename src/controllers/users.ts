import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { CreateUserDto } from "../dtos/CreateUser.dto";
import { prisma } from "../prisma/prisma-client";
import { EditUserDto } from "../dtos/EditUser.dto";
import { logAction } from "../utils/logAction";

/**
 * @route GET /api/users
 * @desc Получение спика пользователей
 * @access Private
 */
export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarURL: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        lastName: "asc",
      },
    });

    if (!users) {
      throw new Error();
    }

    await logAction(userId, "Получение списка пользователей", "GET");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить список пользователей",
    });
  }
};

/**
 * @route GET /api/users/:id
 * @desc Получение пользователя по id
 * @access Private
 */
export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarURL: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(500).json({
        message: "Пользователя не существует",
      });
    }

    await logAction(
      userId,
      "Получение данных о конкретном пользователе",
      "GET"
    );

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить пользователя",
    });
  }
};

/**
 * @route POST /api/users
 * @desc Создание пользователя
 * @access Private
 */
export const createUser = async (
  req: Request<{}, {}, CreateUserDto>,
  res: Response
): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { email, firstName, lastName, password, role, avatarURL } = req.body;

    if (!email || !firstName || !lastName || !password || !role) {
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
        message: "Пользователь, с таким email уже существует",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        avatarURL,
        role,
        password: hashPassword,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Не удалось создать пользователя",
      });
    }

    await logAction(userId, "Создание нового пользователя", "POST");

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
      message: "Не удалось создать пользователя",
    });
  }
};

/**
 * @route PUT /api/users/:id
 * @desc Редактирование пользователя
 * @access Private
 */
export const editUser = async (
  req: Request<{ id: string }, {}, EditUserDto>,
  res: Response
): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { email, firstName, lastName, newPassword, role, avatarURL } =
      req.body;
    const { id } = req.params;

    if (!email || !firstName || !lastName || !role) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
      });
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: {
          id,
        },
        data: {
          email,
          firstName,
          lastName,
          role,
          avatarURL,
          password: hashPassword,
        },
      });
    } else {
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          email,
          firstName,
          lastName,
          role,
          avatarURL,
        },
      });
    }

    await logAction(userId, "Редактирование данных пользователя", "PUT");

    return res
      .status(204)
      .json({ message: "Пользователь успешно отредактирована" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось отредактировать пользователя",
    });
  }
};

/**
 * @route DELETE /api/users/:id
 * @desc Удаление пользователя
 * @access Private
 */
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { id } = req.params;

    await prisma.user.delete({
      where: {
        id,
      },
    });

    await logAction(userId, "Удаление пользователя", "DELETE");

    return res.status(204).json({ message: "Пользователь успешно удалена" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить пользователя",
    });
  }
};
