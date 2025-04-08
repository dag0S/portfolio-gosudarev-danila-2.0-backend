import { Request, Response } from "express";

import { prisma } from "../prisma/prisma-client";
import { logAction } from "../utils/logAction";

/**
 * @route GET /api/authors
 * @desc Получение всех авторов
 * @access Public
 */
export const getAuthors = async (req: Request, res: Response): Promise<any> => {
  try {
    const authors = await prisma.author.findMany({
      orderBy: {
        name: "asc",
      },
    });

    if (!authors) {
      throw new Error();
    }

    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить авторов",
    });
  }
};

/**
 * @route POST /api/authors
 * @desc Создание автора
 * @access Private
 */
export const createAuthor = async (
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

    const author = await prisma.author.create({
      data: {
        name,
      },
    });

    if (!author) {
      throw new Error();
    }

    await logAction(userId, `Добавление автора: ${author.name}`, "POST");

    return res.status(200).json({ message: "Автор успешно создан" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось создать автора",
    });
  }
};

/**
 * @route PUT /api/authors/:id
 * @desc Обновление автора
 * @access Private
 */
export const editAuthor = async (
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

    const updatedAuthor = await prisma.author.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    await logAction(
      userId,
      `Редактирование автора: ${updatedAuthor.name}`,
      "PUT"
    );

    return res.status(200).json({ message: "Автор успешно отредактирован" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось отредактировать автора",
    });
  }
};

/**
 * @route DELETE /api/authors/:id
 * @desc Удаление автора
 * @access Private
 */
export const removeAuthor = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { id } = req.params;

    const deletedAuthor = await prisma.author.delete({
      where: {
        id,
      },
    });

    await logAction(userId, `Удаление автора: ${deletedAuthor.name}`, "DELETE");

    return res.status(200).json({ message: "Автор успешно удален" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить автора",
    });
  }
};
