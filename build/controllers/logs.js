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
exports.removeLog = exports.getLogsById = exports.getLogs = void 0;
const prisma_client_1 = require("../prisma/prisma-client");
const logAction_1 = require("../utils/logAction");
/**
 * @route GET /api/logs
 * @desc Получение всех логов
 * @access Private
 */
const getLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const logs = yield prisma_client_1.prisma.log.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!logs) {
            throw new Error();
        }
        yield (0, logAction_1.logAction)(userId, "Получение всех логов", "GET");
        return res.status(200).json(logs);
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить логи пользователей",
        });
    }
});
exports.getLogs = getLogs;
/**
 * @route GET /api/logs/:id
 * @desc Получение всех конкретного пользователя по id
 * @access Private
 */
const getLogsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { id } = req.params;
        const user = yield prisma_client_1.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new Error();
        }
        const logs = yield prisma_client_1.prisma.log.findMany({
            where: {
                userId: id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!logs) {
            throw new Error();
        }
        yield (0, logAction_1.logAction)(userId, "Получение логов конкретного пользователя", "GET");
        return res.status(200).json(logs);
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить логи пользователя по id",
        });
    }
});
exports.getLogsById = getLogsById;
/**
 * @route DELETE /api/logs/:id
 * @desc Удаление log
 * @access Private
 */
const removeLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { id } = req.params;
        yield prisma_client_1.prisma.log.delete({
            where: {
                id,
            },
        });
        yield (0, logAction_1.logAction)(userId, "Удаление конкретного лога", "DELETE");
        return res.status(200).json({ message: "Log успешно удален" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить log",
        });
    }
});
exports.removeLog = removeLog;
