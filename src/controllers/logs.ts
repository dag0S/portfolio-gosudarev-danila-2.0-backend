import { Request, Response } from "express";

import { prisma } from "../prisma/prisma-client";

/**
 * @route GET /api/logs
 * @desc Получение всех логов
 * @access Private
 */
export const getLogs = async (req: Request, res: Response): Promise<any> => {
  try {
    const logs = await prisma.log.findMany();

    if (!logs) {
      throw new Error();
    }

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
    const { id } = req.params;

    const logs = await prisma.log.findMany({
      where: {
        userId: id,
      },
    });

    if (!logs) {
      throw new Error();
    }

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
    const { id } = req.params;

    await prisma.log.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "Log успешно удален" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить log",
    });
  }
};
