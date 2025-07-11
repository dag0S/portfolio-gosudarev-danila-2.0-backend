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
      { name: "Antd" },
      { name: "shadcn" },
      { name: "Vite" },
      { name: "Webpack" },
      { name: "Gulp" },
    ],
  });

  const createdGenres = await prisma.tag.findMany();

  const users = await prisma.user.findMany();

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
      description:
        "Этот сайт представляет собой учебную копию pointauc.com, и создан исключительно для обучения. Он разработан с использованиемследующих технологий: React, Redux Toolkit, NextJS, Typescript, React Hook Form и Framer Motion. Полный исходный код можно найти врепозитории на GitHub по ссылке. Этот сайт предназначен для взаимодействия между стримером и его аудиторией, позволяя им совместно принимать решения во время стрима. Будь то выбор фильма, сериала или игры для развлечения.",
      views: 122,
      imageURL: "project-1.jpg",
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
