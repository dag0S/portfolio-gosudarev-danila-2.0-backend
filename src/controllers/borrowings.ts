import { Request, Response } from "express";

import { prisma } from "../prisma/prisma-client";
import { BorrowABookDto } from "../dtos/BorrowABook.dto";

/**
 * @route GET /api/borrowings
 * @desc Получение всех книг взятых в аренду
 * @access Private
 */
export const getBorrowings = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const borrowings = await prisma.borrowing.findMany();

    if (!borrowings) {
      throw new Error();
    }

    return res.status(200).json(borrowings);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить список книг взятых в аренду",
    });
  }
};

/**
 * @route GET /api/borrowings/:id
 * @desc Получение книги взятой в аренду по id
 * @access Private
 */
export const getBorrowingById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const borrowing = await prisma.borrowing.findUnique({
      where: { id },
    });

    if (!borrowing) {
      return res.status(500).json({
        message: "Аренды не существует",
      });
    }

    return res.status(200).json(borrowing);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить список книг взятых в аренду",
    });
  }
};

/**
 * @route POST /api/borrowings
 * @desc Взять в аренду книгу
 * @access Private
 */
export const borrowABook = async (
  req: Request<{}, {}, BorrowABookDto>,
  res: Response
): Promise<any> => {
  try {
    const { bookId, userId } = req.body;

    if (!bookId || !userId) {
      return res.status(400).json({
        message: "Не достаточно данных, чтобы взять книгу в аренду",
      });
    }

    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
      select: {
        id: true,
        copies: true,
      },
    });

    if (!book) {
      throw new Error();
    }

    if (book.copies === 0) {
      return res.status(500).json({
        message:
          "Невозможно взять книгу в аренду, так как все копии книги закочились",
      });
    }

    await prisma.book.update({
      where: {
        id: book.id,
      },
      data: {
        copies: {
          decrement: 1,
        },
      },
    });

    const borrowing = await prisma.borrowing.create({
      data: {
        bookId,
        userId,
        dueDate: new Date(),
      },
    });

    if (!borrowing) {
      throw new Error();
    }

    return res.status(200).json({ message: "Книга взята в аренду" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось взять в аренду книгу",
    });
  }
};

/**
 * @route PUT /api/borrowings/:id
 * @desc Вернуть книгу
 * @access Private
 */
export const returnBook = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const deletedBorrowing = await prisma.borrowing.update({
      where: { id },
      data: {
        returnedAt: new Date(),
      },
    });

    await prisma.book.update({
      where: {
        id: deletedBorrowing.bookId,
      },
      data: {
        copies: {
          increment: 1,
        },
      },
    });

    return res.status(200).json({ message: "Вы успешно вернули книгу" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось вернуть книги",
    });
  }
};

/**
 * @route DELETE /api/borrowings/:id
 * @desc Удалить аренду книги
 * @access Private
 */
export const removeBorrowing = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const deletedBorrowing = await prisma.borrowing.delete({
      where: { id },
    });

    await prisma.book.update({
      where: {
        id: deletedBorrowing.bookId,
      },
      data: {
        copies: {
          increment: 1,
        },
      },
    });

    return res.status(200).json({ message: "Аренда книги успешно удалена" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить аренду книги",
    });
  }
};
