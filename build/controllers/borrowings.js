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
exports.removeBorrowing = exports.returnBook = exports.borrowABook = exports.getBorrowingById = exports.getBorrowings = void 0;
const prisma_client_1 = require("../prisma/prisma-client");
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
 * @route GET /api/borrowings/:id
 * @desc Получение книги взятой в аренду по id
 * @access Private
 */
const getBorrowingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const borrowing = yield prisma_client_1.prisma.borrowing.findUnique({
            where: { id },
        });
        if (!borrowing) {
            return res.status(500).json({
                message: "Аренды не существует",
            });
        }
        return res.status(200).json(borrowing);
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить список книг взятых в аренду",
        });
    }
});
exports.getBorrowingById = getBorrowingById;
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
        const book = yield prisma_client_1.prisma.book.findUnique({
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
                dueDate: new Date(),
            },
        });
        if (!borrowing) {
            throw new Error();
        }
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
        const { id } = req.params;
        const deletedBorrowing = yield prisma_client_1.prisma.borrowing.update({
            where: { id },
            data: {
                returnedAt: new Date(),
            },
        });
        yield prisma_client_1.prisma.book.update({
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
        const { id } = req.params;
        const deletedBorrowing = yield prisma_client_1.prisma.borrowing.delete({
            where: { id },
        });
        yield prisma_client_1.prisma.book.update({
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить аренду книги",
        });
    }
});
exports.removeBorrowing = removeBorrowing;
