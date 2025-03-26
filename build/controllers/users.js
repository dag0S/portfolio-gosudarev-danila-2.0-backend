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
exports.deleteUser = exports.editUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_client_1 = require("../prisma/prisma-client");
/**
 * @route GET /api/users
 * @desc Получение спика пользователей
 * @access Private
 */
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_client_1.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarURL: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!users) {
            throw new Error();
        }
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить список пользователей",
        });
    }
});
exports.getUsers = getUsers;
/**
 * @route GET /api/users/:id
 * @desc Получение пользователя по id
 * @access Private
 */
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield prisma_client_1.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarURL: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return res.status(500).json({
                message: "Пользователя не существует",
            });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось получить пользователя",
        });
    }
});
exports.getUserById = getUserById;
/**
 * @route POST /api/users
 * @desc Создание пользователя
 * @access Private
 */
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, password, role, avatarURL } = req.body;
        if (!email || !firstName || !lastName || !password || !role) {
            return res.status(400).json({
                message: "Пожалуйста, заполните обязательные поля",
            });
        }
        const registeredUser = yield prisma_client_1.prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (registeredUser) {
            return res.status(400).json({
                message: "Пользователь, с таким email уже существует",
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield prisma_client_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                avatarURL,
                role,
                password: hashPassword,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "Не удалось создать пользователя",
            });
        }
        return res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatarURL: user.avatarURL,
            role: user.role,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось создать пользователя",
        });
    }
});
exports.createUser = createUser;
/**
 * @route PUT /api/users/:id
 * @desc Редактирование пользователя
 * @access Private
 */
const editUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, newPassword, role, avatarURL } = req.body;
        const { id } = req.params;
        if (!email || !firstName || !lastName || !role) {
            return res.status(400).json({
                message: "Заполните обязательные поля",
            });
        }
        if (newPassword) {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashPassword = yield bcrypt_1.default.hash(newPassword, salt);
            yield prisma_client_1.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    email,
                    firstName,
                    lastName,
                    role,
                    avatarURL,
                    password: hashPassword,
                },
            });
        }
        else {
            yield prisma_client_1.prisma.user.update({
                where: {
                    id,
                },
                data: {
                    email,
                    firstName,
                    lastName,
                    role,
                    avatarURL,
                },
            });
        }
        return res
            .status(204)
            .json({ message: "Пользователь успешно отредактирована" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось отредактировать пользователя",
        });
    }
});
exports.editUser = editUser;
/**
 * @route DELETE /api/users/:id
 * @desc Удаление пользователя
 * @access Private
 */
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma_client_1.prisma.user.delete({
            where: {
                id,
            },
        });
        return res.status(204).json({ message: "Пользователь успешно удалена" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Не удалось удалить пользователя",
        });
    }
});
exports.deleteUser = deleteUser;
