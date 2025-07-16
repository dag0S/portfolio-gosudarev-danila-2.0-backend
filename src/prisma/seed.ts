import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

import { prisma } from "./prisma-client";

// Генерация данных
async function up() {
  const salt = await bcrypt.genSalt(10);

  // Создание пользователей
  await prisma.user.createMany({
    data: [
      {
        email: "admin@mail.ru",
        firstName: "Admin",
        lastName: "Admin",
        password: await bcrypt.hash("12345rR!", salt),
        role: Role.ADMIN,
      },
    ],
  });

  // Создание тэгов
  const tags = await prisma.tag.createMany({
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
      { name: "Ant Design" },
      { name: "shadcn" },
      { name: "Vite" },
      { name: "Webpack" },
      { name: "Gulp" },
      { name: "React Hook Form" },
      { name: "JSONPlaceholder" },
    ],
  });

  const createdGenres = await prisma.tag.findMany();

  const users = await prisma.user.findMany();

  // Создание проектов
  const projects = [
    {
      title: "Аукцион для стримеров",
      tags: [
        "NextJS",
        "React",
        "Redux Toolkit",
        "Tailwind",
        "shadcn",
        "TypeScript",
        "JavaScript",
        "React Hook Form",
        "zod",
      ],
      description:
        "Этот сайт представляет собой учебную копию pointauc.com, и создан исключительно для обучения. Он разработан с использованиемследующих технологий: React, Redux Toolkit, NextJS, Typescript, React Hook Form и Framer Motion. Полный исходный код можно найти врепозитории на GitHub по ссылке. Этот сайт предназначен для взаимодействия между стримером и его аудиторией, позволяя им совместно принимать решения во время стрима. Будь то выбор фильма, сериала или игры для развлечения.",
      views: 41,
      imageURL: "project-1.jpg",
      linkLiveDemo: "https://auction-for-streamers.netlify.app/ru",
      linkFrontendCode: "https://github.com/dag0S/auction-for-streamers",
      linkBackendCode: null,
    },
    {
      title: "TASK-1",
      tags: [
        "React",
        "Zustand",
        "Ant Design",
        "TypeScript",
        "JavaScript",
        "Vite",
        "JSONPlaceholder",
      ],
      description:
        "Это одностраничное приложение (SPA), разработанное на стеке React, TypeScript, Zustand с использованием UI-библиотеки Ant Design. Приложение использует JSONPlaceholder API для загрузки данных о пользователях, постах и альбомах. Реализованы: клиентская фильтрация, пагинация, адаптивная верстка, смена темы, управление состоянием и асинхронными запросами.",
      views: 31,
      imageURL: "project-2.jpg",
      linkLiveDemo: "https://dag0s.github.io/task-1/",
      linkFrontendCode: "https://github.com/dag0S/task-1",
      linkBackendCode: null,
    },
    {
      title: "Lib Space",
      tags: [
        "NextJS",
        "React",
        "TypeScript",
        "JavaScript",
        "Redux Toolkit",
        "React Hook Form",
        "Tailwind",
        "shadcn",
        "ExpressJS",
        "NodeJS",
        "Prisma",
        "PostgreSQL",
      ],
      description:
        'Lib Space - курсовая работа на тему "Модель ААА и её имплементация в WEB-приложении". Приложение из себя представляет онлайн библиотеку ВУЗа, где авторизованные пользователи могу брать книги в аренду. В приложении реализованы основные компоненты модели ААА, а именно аутентификация, авторизация и учёт. В приложении есть три роли пользователей: читатели (могу брать книги в аренду), библиотекари (управляют книгами, жанрами и авторами, следят за арендами пользователей) и администраторы (управляют пользователями, следят за их действиями).',
      views: 71,
      imageURL: "project-3.jpg",
      linkLiveDemo: null,
      linkFrontendCode: "https://github.com/dag0S/libspace_frontend",
      linkBackendCode: "https://github.com/dag0S/libspace_backend",
    },
  ];

  for (const project of projects) {
    const tagsToConnect = createdGenres
      .filter((t) => project.tags.includes(t.name))
      .map((t) => ({ id: t.id }));

    await prisma.project.create({
      data: {
        title: project.title,
        tags: { connect: tagsToConnect },
        description: project.description,
        imageURL: project.imageURL,
        views: project.views,
        authorId: users[0].id,
        linkLiveDemo: project.linkLiveDemo,
        linkFrontendCode: project.linkFrontendCode,
        linkBackendCode: project.linkBackendCode,
      },
    });
  }
}

// Удаление данных
async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "users" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "projects" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "tags" RESTART IDENTITY CASCADE`;
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
