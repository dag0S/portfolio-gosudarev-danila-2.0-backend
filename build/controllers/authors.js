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
exports.removeAuthor = exports.editAuthor = exports.createAuthor = exports.getAuthors = void 0;
const prisma_client_1 = require("../prisma/prisma-client");
const logAction_1 = require("../utils/logAction");
/**
 * @route GET /api/authors
 * @desc Получение всех авторов
 * @access Public
 */
const getAuthors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authors = yield prisma_client_1.prisma.author.findMany({
            orderBy: {
                name: "asc",
            },
        });
        if (!authors) {
            throw new Error();
        }
        return res.status(200).json(authors);
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить авторов",
        });
    }
});
exports.getAuthors = getAuthors;
/**
 * @route POST /api/authors
 * @desc Создание автора
 * @access Private
 */
const createAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Заполните обязательные поля",
            });
        }
        const author = yield prisma_client_1.prisma.author.create({
            data: {
                name,
            },
        });
        if (!author) {
            throw new Error();
        }
        yield (0, logAction_1.logAction)(userId, `Добавление автора: ${author.name}`, "POST");
        return res.status(200).json({ message: "Автор успешно создан" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось создать автора",
        });
    }
});
exports.createAuthor = createAuthor;
/**
 * @route PUT /api/authors/:id
 * @desc Обновление автора
 * @access Private
 */
const editAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedAuthor = yield prisma_client_1.prisma.author.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });
        yield (0, logAction_1.logAction)(userId, `Редактирование автора: ${updatedAuthor.name}`, "PUT");
        return res.status(200).json({ message: "Автор успешно отредактирован" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось отредактировать автора",
        });
    }
});
exports.editAuthor = editAuthor;
/**
 * @route DELETE /api/authors/:id
 * @desc Удаление автора
 * @access Private
 */
const removeAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { id } = req.params;
        const deletedAuthor = yield prisma_client_1.prisma.author.delete({
            where: {
                id,
            },
        });
        yield (0, logAction_1.logAction)(userId, `Удаление автора: ${deletedAuthor.name}`, "DELETE");
        return res.status(200).json({ message: "Автор успешно удален" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить автора",
        });
    }
});
exports.removeAuthor = removeAuthor;
