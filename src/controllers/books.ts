import { Request, Response } from "express";
import path from "path";
import fs from "fs";

import { prisma } from "../prisma/prisma-client";
import { CreateBookDto } from "../dtos/CreateBook.dto";
import { IBookQueryParams } from "../types/types";
import { logAction } from "../utils/logAction";

/**
 * @route GET /api/books
 * @desc Получение всех книг
 * @access Public
 */
export const getAll = async (
  req: Request<{}, {}, {}, IBookQueryParams>,
  res: Response
): Promise<any> => {
  try {
    const { searchBy, sortBy, authors, genres } = req.query;

    const genresIdArr = genres?.split(",");
    const authorsIdArr = authors?.split(",");

    const booksWhere: any = {};
    const booksOrderBy: any = {};

    if (sortBy) {
      booksOrderBy[sortBy] = "desc";
    } else {
      booksOrderBy["views"] = "desc";
    }

    if (searchBy) {
      booksWhere["OR"] = [
        {
          title: {
            contains: searchBy,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchBy,
            mode: "insensitive",
          },
        },
      ];
    }

    if (genres) {
      booksWhere["genres"] = genresIdArr
        ? {
            some: {
              id: {
                in: genresIdArr,
              },
            },
          }
        : undefined;
    }

    if (authors) {
      booksWhere["authorId"] = authorsIdArr
        ? {
            in: authorsIdArr,
          }
        : undefined;
    }

    const books = await prisma.book.findMany({
      where: booksWhere,
      orderBy: booksOrderBy,
    });

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить книги",
    });
  }
};

/**
 * @route GET /api/books/info
 * @desc Получение всех книг с полной информацией
 * @access Private
 */
export const getAllInfo = async (req: Request, res: Response): Promise<any> => {
  try {
    const books = await prisma.book.findMany({
      include: {
        genres: {},
        author: {},
      },
      orderBy: {
        title: "asc",
      },
    });

    if (!books) {
      throw new Error();
    }

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить книги с полной информацией",
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

    const updatedBook = await prisma.book.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        genres: {},
        author: {},
      },
    });

    return res.status(200).json(updatedBook);
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
    // @ts-ignore
    const userId = req.user.id;
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

    await logAction(userId, `Добавление книги: ${book.title}`, "POST");

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
    // @ts-ignore
    const userId = req.user.id;
    const { authorId, copies, description, title } = req.body;
    const { id } = req.params;

    if (!authorId || !copies.toString() || !description || !title) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
      });
    }

    const updatedBook = await prisma.book.update({
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

    await logAction(
      userId,
      `Редактирование книги: ${updatedBook.title}`,
      "PUT"
    );

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
    // @ts-ignore
    const userId = req.user.id;
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

    const deletedBook = await prisma.book.delete({
      where: {
        id,
      },
    });

    await logAction(userId, `Удаление книги: ${deletedBook.title}`, "DELETE");

    return res.status(204).json({ message: "Книгу успешно удалена" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить книгу",
    });
  }
};
