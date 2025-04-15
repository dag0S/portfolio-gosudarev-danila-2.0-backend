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
exports.removeGenre = exports.editGenre = exports.createGenre = exports.getGenres = void 0;
const prisma_client_1 = require("../prisma/prisma-client");
const logAction_1 = require("../utils/logAction");
/**
 * @route GET /api/genres
 * @desc Получение всех жанров
 * @access Public
 */
const getGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genres = yield prisma_client_1.prisma.genre.findMany({
            orderBy: {
                name: "asc",
            },
        });
        if (!genres) {
            throw new Error();
        }
        return res.status(200).json(genres);
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить жанры",
        });
    }
});
exports.getGenres = getGenres;
/**
 * @route POST /api/genres
 * @desc Создание жанра
 * @access Private
 */
const createGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Заполните обязательные поля",
            });
        }
        const existingGenre = yield prisma_client_1.prisma.genre.findUnique({
            where: {
                name,
            },
        });
        if (existingGenre) {
            return res.status(400).json({
                message: "Жанр с таким названием уже существует",
            });
        }
        const genre = yield prisma_client_1.prisma.genre.create({
            data: {
                name,
            },
        });
        if (!genre) {
            throw new Error();
        }
        yield (0, logAction_1.logAction)(userId, `Добавление жанра: ${genre.name}`, "POST");
        return res.status(200).json({ message: "Жанр успешно создан" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось создать жанр",
        });
    }
});
exports.createGenre = createGenre;
/**
 * @route PUT /api/genres/:id
 * @desc Обновление жанра
 * @access Private
 */
const editGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedGenre = yield prisma_client_1.prisma.genre.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });
        yield (0, logAction_1.logAction)(userId, `Редактирование жанра: ${updatedGenre.name}`, "PUT");
        return res.status(200).json({ message: "Жанр успешно отредактирован" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось отредактировать жанр",
        });
    }
});
exports.editGenre = editGenre;
/**
 * @route DELETE /api/genres/:id
 * @desc Удаление жанра
 * @access Private
 */
const removeGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { id } = req.params;
        const deletedGenre = yield prisma_client_1.prisma.genre.delete({
            where: {
                id,
            },
        });
        yield (0, logAction_1.logAction)(userId, `Удаление жанра: ${deletedGenre.name}`, "DELETE");
        return res.status(200).json({ message: "Жанр успешно удален" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить жанра",
        });
    }
});
exports.removeGenre = removeGenre;
