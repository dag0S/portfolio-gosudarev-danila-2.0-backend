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
exports.refresh = exports.me = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_1 = require("../prisma/prisma-client");
const cookieName_1 = require("../const/cookieName");
const generateTokens_1 = require("../utils/generateTokens");
const logAction_1 = require("../utils/logAction");
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
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
        yield (0, logAction_1.logAction)(user.id, "Регистрация нового пользователя", "POST");
        const { accessToken, refreshToken } = (0, generateTokens_1.generateTokens)(user);
        res.cookie(cookieName_1.JWT_ACCESS_TOKEN, accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 10 * 60 * 1000,
        });
        res.cookie(cookieName_1.JWT_REFRESH_TOKEN, refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({ message: "Пользователь зарегистрирован" });
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
        yield (0, logAction_1.logAction)(user.id, "Вход в аккаунт", "POST");
        const { accessToken, refreshToken } = (0, generateTokens_1.generateTokens)(user);
        res.cookie(cookieName_1.JWT_ACCESS_TOKEN, accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 10 * 60 * 1000,
        });
        res.cookie(cookieName_1.JWT_REFRESH_TOKEN, refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res
            .status(200)
            .json({ message: "Пользователь успешно зашел в систему" });
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
        // @ts-ignore
        const userId = req.user.id;
        yield (0, logAction_1.logAction)(userId, "Выход из аккаунта", "POST");
        res.clearCookie(cookieName_1.JWT_ACCESS_TOKEN);
        res.clearCookie(cookieName_1.JWT_REFRESH_TOKEN);
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
        const accessToken = req.cookies[cookieName_1.JWT_ACCESS_TOKEN];
        if (!accessToken) {
            return res.status(401).json({ message: "Вы не авторизованы" });
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, JWT_ACCESS_SECRET);
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
/**
 * @route POST /api/auth/refresh
 * @desc Получение нового токена доступа (access token) с помощью токена обновления (refresh token)
 * @access Public
 */
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies[cookieName_1.JWT_REFRESH_TOKEN];
        if (!refreshToken) {
            return res.status(401).json({ message: "Вы не авторизованы" });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = yield prisma_client_1.prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return res.status(403).json({ message: "Пользователь не найден" });
        }
        yield (0, logAction_1.logAction)(user.id, "Обновление токена доступа", "POST");
        const { accessToken } = (0, generateTokens_1.generateTokens)(user);
        res.cookie(cookieName_1.JWT_ACCESS_TOKEN, accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 10 * 60 * 1000,
        });
        return res.status(200).json({ message: "Токен доступа обновлен" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Что-то пошло не так",
        });
    }
});
exports.refresh = refresh;
