import { Request, Response } from "express";

import { prisma } from "../prisma/prisma-client";
import { logAction } from "../utils/logAction";

/**
 * @route GET /api/logs
 * @desc Получение всех логов
 * @access Private
 */
export const getLogs = async (req: Request, res: Response): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const logs = await prisma.log.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!logs) {
      throw new Error();
    }

    await logAction(userId, "Получение всех логов", "GET");

    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить логи пользователей",
    });
  }
};

/**
 * @route GET /api/logs/:id
 * @desc Получение всех конкретного пользователя по id
 * @access Private
 */
export const getLogsById = async (
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
    });

    if (!user) {
      throw new Error();
    }

    const logs = await prisma.log.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!logs) {
      throw new Error();
    }

    await logAction(userId, "Получение логов конкретного пользователя", "GET");

    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить логи пользователя по id",
    });
  }
};

/**
 * @route DELETE /api/logs/:id
 * @desc Удаление log
 * @access Private
 */
export const removeLog = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    // @ts-ignore
    const userId = req.user.id;
    const { id } = req.params;

    await prisma.log.delete({
      where: {
        id,
      },
    });

    await logAction(userId, "Удаление конкретного лога", "DELETE");

    return res.status(200).json({ message: "Log успешно удален" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить log",
    });
  }
};
