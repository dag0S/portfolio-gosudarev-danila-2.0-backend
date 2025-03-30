import { Request, Response } from "express";
import path from "path";
import fs from "fs";

import { prisma } from "../prisma/prisma-client";
import { CreateBookDto } from "../dtos/CreateBook.dto";

/**
 * @route GET /api/books
 * @desc Получение всех книг
 * @access Public
 */
export const getAll = async (req: Request, res: Response): Promise<any> => {
  try {
    const books = await prisma.book.findMany();

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить книги",
    });
  }
};

/**
 * @route GET /api/books/:id
 * @desc Получение одной книги по id
 * @access Public
 */
export const getOne = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: {
        id,
      },
      include: {
        genres: {},
        author: {},
      },
    });

    if (!book) {
      return res.status(404).json({
        message: "Не удалось найти книгу",
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить книгу",
    });
  }
};

/**
 * @route POST /api/books
 * @desc Создание книги
 * @access Private
 */
export const create = async (
  req: Request<{}, {}, CreateBookDto>,
  res: Response
): Promise<any> => {
  try {
    const { copies, description, title, authorId } = req.body;
    let bookCoverURL = null;

    if (!copies || !description || !title || !authorId) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
      });
    }

    if (req.file) {
      const { filename } = req.file;
      bookCoverURL = filename;
    }

    const book = await prisma.book.create({
      data: {
        title,
        copies: +copies,
        description,
        authorId,
        bookCoverURL,
      },
    });

    if (!book) {
      return res.status(500).json({ message: "Не удалось создать книгу" });
    }

    return res.status(201).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
};

/**
 * @route PUT /api/books/:id
 * @desc Обновление книги
 * @access Private
 */
export const edit = async (
  req: Request<{ id: string }, {}, CreateBookDto>,
  res: Response
): Promise<any> => {
  try {
    const { authorId, copies, description, title } = req.body;
    const { id } = req.params;

    if (!authorId || !copies || !description || !title) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
      });
    }

    await prisma.book.update({
      where: {
        id,
      },
      data: {
        title,
        authorId,
        copies,
        description,
      },
    });

    return res.status(204).json({ message: "Книгу успешно отредактирована" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось отредактировать книгу",
    });
  }
};

/**
 * @route DELETE /api/books/:id
 * @desc Удаление книги
 * @access Private
 */
export const remove = async (
  req: Request<{ id: string }, {}, CreateBookDto>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return res.status(404).json({ message: "Книга не найдена" });
    }

    if (book.bookCoverURL) {
      const filePath = path.join(
        __dirname,
        `../static/books/${book.bookCoverURL}`
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Файл не найден" });
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ message: "Ошибка удаления файла" });
        }
      });
    }

    await prisma.book.delete({
      where: {
        id,
      },
    });

    return res.status(204).json({ message: "Книгу успешно удалена" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить книгу",
    });
  }
};
