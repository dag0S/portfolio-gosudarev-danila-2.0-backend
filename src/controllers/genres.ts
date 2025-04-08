import { Request, Response } from "express";

import { prisma } from "../prisma/prisma-client";
import { logAction } from "../utils/logAction";

/**
 * @route GET /api/genres
 * @desc Получение всех жанров
 * @access Public
 */
export const getGenres = async (req: Request, res: Response): Promise<any> => {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        name: "asc",
      },
    });

    if (!genres) {
      throw new Error();
    }

    return res.status(200).json(genres);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить жанры",
    });
  }
};

/**
 * @route POST /api/genres
 * @desc Создание жанра
 * @access Private
 */
export const createGenre = async (
  req: Request<{}, {}, { name: string }>,
  res: Response
): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
      });
    }

    const existingGenre = await prisma.genre.findUnique({
      where: {
        name,
      },
    });

    if (existingGenre) {
      return res.status(400).json({
        message: "Жанр с таким названием уже существует",
      });
    }

    const genre = await prisma.genre.create({
      data: {
        name,
      },
    });

    if (!genre) {
      throw new Error();
    }

    await logAction(userId, `Добавление жанра: ${genre.name}`, "POST");

    return res.status(200).json({ message: "Жанр успешно создан" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось создать жанр",
    });
  }
};

/**
 * @route PUT /api/genres/:id
 * @desc Обновление жанра
 * @access Private
 */
export const editGenre = async (
  req: Request<{ id: string }, {}, { name: string }>,
  res: Response
): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
      });
    }

    const updatedGenre = await prisma.genre.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    await logAction(
      userId,
      `Редактирование жанра: ${updatedGenre.name}`,
      "PUT"
    );

    return res.status(200).json({ message: "Жанр успешно отредактирован" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось отредактировать жанр",
    });
  }
};

/**
 * @route DELETE /api/genres/:id
 * @desc Удаление жанра
 * @access Private
 */
export const removeGenre = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { id } = req.params;

    const deletedGenre = await prisma.genre.delete({
      where: {
        id,
      },
    });

    await logAction(userId, `Удаление жанра: ${deletedGenre.name}`, "DELETE");

    return res.status(200).json({ message: "Жанр успешно удален" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить жанра",
    });
  }
};
