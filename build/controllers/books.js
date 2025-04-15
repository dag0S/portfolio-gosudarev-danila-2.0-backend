"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.edit = exports.create = exports.getOne = exports.getAllInfo = exports.getAll = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const prisma_client_1 = require("../prisma/prisma-client");
const logAction_1 = require("../utils/logAction");
/**
 * @route GET /api/books
 * @desc Получение всех книг
 * @access Public
 */
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchBy, sortBy, authors, genres } = req.query;
        const genresIdArr = genres === null || genres === void 0 ? void 0 : genres.split(",");
        const authorsIdArr = authors === null || authors === void 0 ? void 0 : authors.split(",");
        const booksWhere = {};
        const booksOrderBy = {};
        if (sortBy) {
            booksOrderBy[sortBy] = "desc";
        }
        else {
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
        const books = yield prisma_client_1.prisma.book.findMany({
            where: booksWhere,
            orderBy: booksOrderBy,
        });
        return res.status(200).json(books);
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить книги",
        });
    }
});
exports.getAll = getAll;
/**
 * @route GET /api/books/info
 * @desc Получение всех книг с полной информацией
 * @access Private
 */
const getAllInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield prisma_client_1.prisma.book.findMany({
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить книги с полной информацией",
        });
    }
});
exports.getAllInfo = getAllInfo;
/**
 * @route GET /api/books/:id
 * @desc Получение одной книги по id
 * @access Public
 */
const getOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const book = yield prisma_client_1.prisma.book.findUnique({
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
        const updatedBook = yield prisma_client_1.prisma.book.update({
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить книгу",
        });
    }
});
exports.getOne = getOne;
/**
 * @route POST /api/books
 * @desc Создание книги
 * @access Private
 */
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const book = yield prisma_client_1.prisma.book.create({
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
        yield (0, logAction_1.logAction)(userId, `Добавление книги: ${book.title}`, "POST");
        return res.status(201).json(book);
    }
    catch (error) {
        return res.status(500).json({
            message: "Что-то пошло не так",
        });
    }
});
exports.create = create;
/**
 * @route PUT /api/books/:id
 * @desc Обновление книги
 * @access Private
 */
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedBook = yield prisma_client_1.prisma.book.update({
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
        yield (0, logAction_1.logAction)(userId, `Редактирование книги: ${updatedBook.title}`, "PUT");
        return res.status(204).json({ message: "Книгу успешно отредактирована" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось отредактировать книгу",
        });
    }
});
exports.edit = edit;
/**
 * @route DELETE /api/books/:id
 * @desc Удаление книги
 * @access Private
 */
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { id } = req.params;
        const book = yield prisma_client_1.prisma.book.findUnique({
            where: { id },
        });
        if (!book) {
            return res.status(404).json({ message: "Книга не найдена" });
        }
        if (book.bookCoverURL) {
            const filePath = path_1.default.join(__dirname, `../static/books/${book.bookCoverURL}`);
            if (!fs_1.default.existsSync(filePath)) {
                return res.status(404).json({ message: "Файл не найден" });
            }
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    return res.status(500).json({ message: "Ошибка удаления файла" });
                }
            });
        }
        const deletedBook = yield prisma_client_1.prisma.book.delete({
            where: {
                id,
            },
        });
        yield (0, logAction_1.logAction)(userId, `Удаление книги: ${deletedBook.title}`, "DELETE");
        return res.status(204).json({ message: "Книгу успешно удалена" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить книгу",
        });
    }
});
exports.remove = remove;
