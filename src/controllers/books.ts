import { Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";

import { prisma } from "../prisma/prisma-client";
import { CreateBookDto } from "../dtos/CreateBook.dto";
import {
  getYandexDiskFileUrl,
  uploadToYandexDisk,
  yandexDiskApi,
} from "../api/yandexDiskApi";

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
      const { buffer, originalname, mimetype } = req.file;
      const uploadPath = `lib_space/books/${uuidV4()}_${originalname}`;

      await uploadToYandexDisk(uploadPath, buffer, mimetype);
      bookCoverURL = await getYandexDiskFileUrl(uploadPath);
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
      const filename = new URL(book.bookCoverURL).searchParams.get("filename");

      await yandexDiskApi.delete(
        `/v1/disk/resources?path=/lib_space/books/${filename}`
      );
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
