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
exports.checkUserBookStatus = exports.removeBorrowing = exports.returnBook = exports.borrowABook = exports.getBorrowingByUserId = exports.getBorrowings = void 0;
const prisma_client_1 = require("../prisma/prisma-client");
const logAction_1 = require("../utils/logAction");
/**
 * @route GET /api/borrowings
 * @desc Получение всех книг взятых в аренду
 * @access Private
 */
const getBorrowings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const borrowings = yield prisma_client_1.prisma.borrowing.findMany();
        if (!borrowings) {
            throw new Error();
        }
        return res.status(200).json(borrowings);
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить список книг взятых в аренду",
        });
    }
});
exports.getBorrowings = getBorrowings;
/**
 * @route GET /api/borrowings/:userId
 * @desc Получение книг взятых в аренду конкретным пользователем по userId
 * @access Private
 */
const getBorrowingByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // @ts-ignore
        if (userId !== req.user.id) {
            throw new Error();
        }
        const borrowings = yield prisma_client_1.prisma.borrowing.findMany({
            where: {
                userId,
                returnedAt: null,
            },
            include: {
                book: {},
            },
        });
        if (!borrowings) {
            return res.status(500).json({
                message: "Аренды не существует",
            });
        }
        yield (0, logAction_1.logAction)(userId, "Получение списка книг, взятых в аренду", "GET");
        return res.status(200).json(borrowings);
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить список книг взятых в аренду",
        });
    }
});
exports.getBorrowingByUserId = getBorrowingByUserId;
/**
 * @route POST /api/borrowings
 * @desc Взять в аренду книгу
 * @access Private
 */
const borrowABook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId, userId } = req.body;
        if (!bookId || !userId) {
            return res.status(400).json({
                message: "Не достаточно данных, чтобы взять книгу в аренду",
            });
        }
        const existingBorrow = yield prisma_client_1.prisma.borrowing.findFirst({
            where: {
                bookId,
                userId,
                returnedAt: null,
            },
        });
        if (existingBorrow) {
            return res.status(409).json({
                message: "Вы уже взяли эту книгу в аренду",
            });
        }
        const book = yield prisma_client_1.prisma.book.findUnique({
            where: {
                id: bookId,
            },
            select: {
                id: true,
                copies: true,
                title: true,
            },
        });
        if (!book) {
            throw new Error();
        }
        if (book.copies <= 0) {
            return res.status(500).json({
                message: "Невозможно взять книгу в аренду, так как все копии книги закочились",
            });
        }
        yield prisma_client_1.prisma.book.update({
            where: {
                id: book.id,
            },
            data: {
                copies: {
                    decrement: 1,
                },
            },
        });
        const borrowing = yield prisma_client_1.prisma.borrowing.create({
            data: {
                bookId,
                userId,
                dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            },
        });
        if (!borrowing) {
            throw new Error();
        }
        yield (0, logAction_1.logAction)(userId, `Взятие в аренду книги: ${book.title}`, "POST");
        return res.status(200).json({ message: "Книга взята в аренду" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось взять в аренду книгу",
        });
    }
});
exports.borrowABook = borrowABook;
/**
 * @route PUT /api/borrowings/:id
 * @desc Вернуть книгу
 * @access Private
 */
const returnBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { id } = req.params;
        const deletedBorrowing = yield prisma_client_1.prisma.borrowing.update({
            where: { id },
            data: {
                returnedAt: new Date(),
            },
        });
        const book = yield prisma_client_1.prisma.book.update({
            where: {
                id: deletedBorrowing.bookId,
            },
            data: {
                copies: {
                    increment: 1,
                },
            },
        });
        yield (0, logAction_1.logAction)(userId, `Возврат книги, взятой в аренду: ${book.title}`, "PUT");
        return res.status(200).json({ message: "Вы успешно вернули книгу" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось вернуть книги",
        });
    }
});
exports.returnBook = returnBook;
/**
 * @route DELETE /api/borrowings/:id
 * @desc Удалить аренду книги
 * @access Private
 */
const removeBorrowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { id } = req.params;
        const deletedBorrowing = yield prisma_client_1.prisma.borrowing.delete({
            where: { id },
        });
        const book = yield prisma_client_1.prisma.book.update({
            where: {
                id: deletedBorrowing.bookId,
            },
            data: {
                copies: {
                    increment: 1,
                },
            },
        });
        yield (0, logAction_1.logAction)(userId, `Удаление аренды книги: ${book.title}`, "DELETE");
        return res.status(200).json({ message: "Аренда книги успешно удалена" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить аренду книги",
        });
    }
});
exports.removeBorrowing = removeBorrowing;
/**
 * @route GET /api/borrowings/check?bookId=XXX&userId=YYY
 * @desc Проверка: взята ли конкретная книга у пользователя
 * @access Private
 */
const checkUserBookStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId, userId } = req.query;
        if (!bookId || !userId) {
            return res.status(400).json({ message: "bookId и userId обязательны" });
        }
        const existing = yield prisma_client_1.prisma.borrowing.findFirst({
            where: {
                bookId,
                userId,
                returnedAt: null,
            },
        });
        return res
            .status(200)
            .json({ hasBorrowed: !!existing, borrowingId: existing === null || existing === void 0 ? void 0 : existing.id });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось проверить взята ли в аренду книга у пользователя",
        });
    }
});
exports.checkUserBookStatus = checkUserBookStatus;
