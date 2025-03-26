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
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.edit = exports.create = exports.getOne = exports.getAll = void 0;
const prisma_client_1 = require("../prisma/prisma-client");
/**
 * @route GET /api/books
 * @desc Получение всех книг
 * @access Public
 */
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = yield prisma_client_1.prisma.book.findMany();
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
        });
        if (!book) {
            return res.status(404).json({
                message: "Не удалось найти книгу",
            });
        }
        return res.status(200).json(book);
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
        const { copies, description, title, bookCoverURL, authorId } = req.body;
        if (!copies || !description || !title || !authorId) {
            return res.status(400).json({
                message: "Заполните обязательные поля",
            });
        }
        const book = yield prisma_client_1.prisma.book.create({
            data: {
                title,
                copies,
                description,
                bookCoverURL,
                authorId,
            },
        });
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
        const { authorId, copies, description, title, bookCoverURL } = req.body;
        const { id } = req.params;
        if (!authorId || !copies || !description || !title) {
            return res.status(400).json({
                message: "Заполните обязательные поля",
            });
        }
        yield prisma_client_1.prisma.book.update({
            where: {
                id,
            },
            data: {
                title,
                authorId,
                copies,
                description,
                bookCoverURL,
            },
        });
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
        const { id } = req.params;
        yield prisma_client_1.prisma.book.delete({
            where: {
                id,
            },
        });
        return res.status(204).json({ message: "Книгу успешно удалена" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить книгу",
        });
    }
});
exports.remove = remove;
