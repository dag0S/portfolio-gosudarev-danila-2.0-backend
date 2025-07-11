import { Request, Response } from "express";

import { prisma } from "../prisma/prisma-client";

/**
 * @route GET /api/tags
 * @desc Получение всех тэгов
 * @access Public
 */
export const getAll = async (req: Request, res: Response): Promise<any> => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });

    if (!tags) {
      throw new Error();
    }

    return res.status(200).json(tags);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить тэги",
    });
  }
};

/**
 * @route POST /api/tags
 * @desc Создание тэга
 * @access Private
 */
export const create = async (
  req: Request<{}, {}, { name: string }>,
  res: Response
): Promise<any> => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
      });
    }

    const existingTag = await prisma.tag.findUnique({
      where: {
        name,
      },
    });

    if (existingTag) {
      return res.status(400).json({
        message: "Тэг с таким названием уже существует",
      });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
      },
    });

    if (!tag) {
      throw new Error();
    }

    return res.status(200).json({ message: "Тэг успешно создан" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось создать тэг",
    });
  }
};

/**
 * @route PUT /api/tags/:id
 * @desc Обновление тэга
 * @access Private
 */
export const edit = async (
  req: Request<{ id: string }, {}, { name: string }>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
      });
    }

    await prisma.tag.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return res.status(200).json({ message: "Тэг успешно отредактирован" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось отредактировать тэг",
    });
  }
};

/**
 * @route DELETE /api/tags/:id
 * @desc Удаление тэга
 * @access Private
 */
export const remove = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    await prisma.tag.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "Тэг успешно удален" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить тэг",
    });
  }
};
