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
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_client_1 = require("./prisma-client");
// Генерация данных
function up() {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        // Создание пользователей
        yield prisma_client_1.prisma.user.createMany({
            data: [
                {
                    email: "reader@mail.ru",
                    firstName: "Reader",
                    lastName: "Reader",
                    password: yield bcrypt_1.default.hash("12345rR!", salt),
                    role: client_1.Role.READER,
                },
                {
                    email: "librarian@mail.ru",
                    firstName: "Librarian",
                    lastName: "Librarian",
                    password: yield bcrypt_1.default.hash("12345rR!", salt),
                    role: client_1.Role.LIBRARIAN,
                },
                {
                    email: "admin@mail.ru",
                    firstName: "Admin",
                    lastName: "Admin",
                    password: yield bcrypt_1.default.hash("12345rR!", salt),
                    role: client_1.Role.ADMIN,
                },
            ],
        });
        // Создание авторов
        const authors = yield prisma_client_1.prisma.author.createMany({
            data: [
                { name: "Мартин Фаулер" },
                { name: "Роберт К. Мартин" },
                { name: "Эрик Эванс" },
                { name: "Кент Бек" },
                { name: "Сэм Ньюмэн" },
                { name: "Дэвид Флэнаган" },
                { name: "Юваль Ной Харари" },
                { name: "Жерар Месзарош" },
                { name: "Никита Прокопов" },
                { name: "Джонатан Бака" },
            ],
        });
        // Создание жанров
        const genres = yield prisma_client_1.prisma.genre.createMany({
            data: [
                { name: "Разработка ПО" },
                { name: "Архитектура программных систем" },
                { name: "Чистый код и рефакторинг" },
                { name: "Микросервисная архитектура" },
                { name: "Тестирование и TDD" },
                { name: "Алгоритмы и структуры данных" },
                { name: "Языки программирования" },
                { name: "DevOps и автоматизация" },
                { name: "Кибербезопасность" },
                { name: "Менеджмент в IT" },
            ],
        });
        const createdAuthors = yield prisma_client_1.prisma.author.findMany();
        const createdGenres = yield prisma_client_1.prisma.genre.findMany();
        // Создание книг
        const books = [
            {
                title: "Чистый код",
                author: "Роберт К. Мартин",
                genres: ["Чистый код и рефакторинг"],
                description: "Описание",
                copies: 10,
                bookCoverURL: "/imgs/books/book-1.webp",
            },
            {
                title: "Чистая архитектура",
                author: "Роберт К. Мартин",
                genres: ["Архитектура программных систем"],
                description: "Описание",
                copies: 10,
                bookCoverURL: "/imgs/books/book-1.webp",
            },
            {
                title: "Рефакторинг",
                author: "Мартин Фаулер",
                genres: ["Чистый код и рефакторинг"],
                description: "Описание",
                copies: 10,
                bookCoverURL: "/imgs/books/book-1.webp",
            },
            {
                title: "DDD: проектирование сложных программных систем",
                author: "Эрик Эванс",
                genres: ["Архитектура программных систем"],
                description: "Описание",
                copies: 10,
                bookCoverURL: "/imgs/books/book-1.webp",
            },
            {
                title: "TDD на практике",
                author: "Кент Бек",
                genres: ["Тестирование и TDD"],
                description: "Описание",
                copies: 10,
                bookCoverURL: "/imgs/books/book-1.webp",
            },
            {
                title: "Микросервисная архитектура",
                author: "Сэм Ньюмэн",
                genres: ["Микросервисная архитектура", "DevOps и автоматизация"],
                description: "Описание",
                copies: 10,
                bookCoverURL: "/imgs/books/book-1.webp",
            },
            {
                title: "JavaScript. Подробное руководство",
                author: "Дэвид Флэнаган",
                genres: ["Языки программирования"],
                description: "Описание",
                copies: 10,
                bookCoverURL: "/imgs/books/book-1.webp",
            },
            {
                title: "Грокаем алгоритмы",
                author: "Джонатан Бака",
                genres: ["Алгоритмы и структуры данных"],
                description: "Описание",
                copies: 10,
                bookCoverURL: "/imgs/books/book-1.webp",
            },
            {
                title: "Кибербезопасность для разработчиков",
                author: "Никита Прокопов",
                genres: ["Кибербезопасность"],
                description: "Описание",
                copies: 10,
                bookCoverURL: "/imgs/books/book-1.webp",
            },
            {
                title: "Менеджмент в IT",
                author: "Юваль Ной Харари",
                genres: ["Менеджмент в IT"],
                description: "Описание",
                copies: 10,
                bookCoverURL: "/imgs/books/book-1.webp",
            },
        ];
        for (const book of books) {
            const author = createdAuthors.find((a) => a.name === book.author);
            if (!author) {
                console.warn(`Автор "${book.author}" не найден!`);
                continue;
            }
            const genresToConnect = createdGenres
                .filter((g) => book.genres.includes(g.name))
                .map((g) => ({ id: g.id }));
            yield prisma_client_1.prisma.book.create({
                data: {
                    title: book.title,
                    authorId: author.id,
                    genres: { connect: genresToConnect },
                    description: book.description,
                    copies: book.copies,
                },
            });
        }
    });
}
// Удаление данных
function down() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_client_1.prisma.$executeRaw `TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
        yield prisma_client_1.prisma.$executeRaw `TRUNCATE TABLE "Book" RESTART IDENTITY CASCADE`;
        yield prisma_client_1.prisma.$executeRaw `TRUNCATE TABLE "Borrowing" RESTART IDENTITY CASCADE`;
        yield prisma_client_1.prisma.$executeRaw `TRUNCATE TABLE "Author" RESTART IDENTITY CASCADE`;
        yield prisma_client_1.prisma.$executeRaw `TRUNCATE TABLE "Genre" RESTART IDENTITY CASCADE`;
        yield prisma_client_1.prisma.$executeRaw `TRUNCATE TABLE "Log" RESTART IDENTITY CASCADE`;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield down();
            yield up();
        }
        catch (e) {
            console.error(e);
        }
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_client_1.prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma_client_1.prisma.$disconnect();
    process.exit(1);
}));
