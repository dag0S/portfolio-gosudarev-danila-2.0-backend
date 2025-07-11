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
                    email: "admin@mail.ru",
                    firstName: "Admin",
                    lastName: "Admin",
                    password: yield bcrypt_1.default.hash("12345rR!", salt),
                    role: client_1.Role.ADMIN,
                },
            ],
        });
        // Создание тэгов
        const tags = yield prisma_client_1.prisma.tag.createMany({
            data: [
                { name: "HTML" },
                { name: "CSS" },
                { name: "JavaScript" },
                { name: "SASS" },
                { name: "TypeScript" },
                { name: "NodeJS" },
                { name: "ExpressJS" },
                { name: "React" },
                { name: "NextJS" },
                { name: "Redux Toolkit" },
                { name: "Zustand" },
                { name: "zod" },
                { name: "Figma" },
                { name: "Photoshop" },
                { name: "Prisma" },
                { name: "PostgreSQL" },
                { name: "Docker" },
                { name: "Tailwind" },
                { name: "Antd" },
                { name: "shadcn" },
                { name: "Vite" },
                { name: "Webpack" },
                { name: "Gulp" },
            ],
        });
        const createdGenres = yield prisma_client_1.prisma.tag.findMany();
        const users = yield prisma_client_1.prisma.user.findMany();
        // Создание книг
        const projects = [
            {
                title: "Аукцион для стримеров",
                author: "Адитья Бхаргава",
                tags: [
                    "NextJS",
                    "React",
                    "Redux Toolkit",
                    "Figma",
                    "Tailwind",
                    "shadcn",
                    "TypeScript",
                    "JavaScript",
                    "HTML",
                ],
                description: "Этот сайт представляет собой учебную копию pointauc.com, и создан исключительно для обучения. Он разработан с использованиемследующих технологий: React, Redux Toolkit, NextJS, Typescript, React Hook Form и Framer Motion. Полный исходный код можно найти врепозитории на GitHub по ссылке. Этот сайт предназначен для взаимодействия между стримером и его аудиторией, позволяя им совместно принимать решения во время стрима. Будь то выбор фильма, сериала или игры для развлечения.",
                views: 122,
                imageURL: "project-1.jpg",
            },
        ];
        for (const project of projects) {
            const tagsToConnect = createdGenres
                .filter((t) => project.tags.includes(t.name))
                .map((t) => ({ id: t.id }));
            yield prisma_client_1.prisma.project.create({
                data: {
                    title: project.title,
                    tags: { connect: tagsToConnect },
                    description: project.description,
                    imageURL: project.imageURL,
                    views: project.views,
                    authorId: users[0].id,
                },
            });
        }
    });
}
// Удаление данных
function down() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_client_1.prisma.$executeRaw `TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
        yield prisma_client_1.prisma.$executeRaw `TRUNCATE TABLE "Project" RESTART IDENTITY CASCADE`;
        yield prisma_client_1.prisma.$executeRaw `TRUNCATE TABLE "Tag" RESTART IDENTITY CASCADE`;
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
