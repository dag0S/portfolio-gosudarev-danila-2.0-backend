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
exports.me = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = require("../prisma/prisma-client");
const cookieName_1 = require("../const/cookieName");
const JWT_SECRET = process.env.JWT_SECRET;
/**
 * @route POST /api/auth/register
 * @desc Регистрация
 * @access Public
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, password } = req.body;
        if (!email || !firstName || !lastName || !password) {
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
                message: "Пользователь с таким email уже существует",
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield prisma_client_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashPassword,
                role: client_1.Role.READER,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "Не удалось создать пользователя",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: "15M",
        });
        res.cookie(cookieName_1.COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
        });
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
            message: "Что-то пошло не так",
        });
    }
});
exports.register = register;
/**
 * @route POST /api/auth/login
 * @desc Логин
 * @access Public
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Пожалуйста, заполните обязательные поля",
            });
        }
        const user = yield prisma_client_1.prisma.user.findFirst({
            where: {
                email,
            },
        });
        const isPasswordCorrect = user && (yield bcrypt_1.default.compare(password, user.password));
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({
                message: "Неверный логин или пароль",
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: "15M",
        });
        res.cookie(cookieName_1.COOKIE_NAME, token, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
        });
        return res.status(200).json({
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
            message: "Что-то пошло не так",
        });
    }
});
exports.login = login;
/**
 * @route POST /api/auth/logout
 * @desc Выход из системы
 * @access Public
 */
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie(cookieName_1.COOKIE_NAME);
        return res.json({ message: "Вы вышли из системы" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Что-то пошло не так",
        });
    }
});
exports.logout = logout;
/**
 * @route GET /api/auth/me
 * @desc Получение данных о пользователе с помощью токена
 * @access Private
 */
const me = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies[cookieName_1.COOKIE_NAME];
        if (!token) {
            return res.status(401).json({ message: "Вы не авторизованы" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield prisma_client_1.prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarURL: true,
                role: true,
            },
        });
        if (!user) {
            return res.status(401).json({ message: "Пользователь не найден" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({
            message: "Что-то пошло не так",
        });
    }
});
exports.me = me;
