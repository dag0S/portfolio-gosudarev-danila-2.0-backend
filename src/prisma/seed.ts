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
        email: "reader@mail.ru",
        firstName: "Reader",
        lastName: "Reader",
        password: await bcrypt.hash("123123", salt),
        role: Role.READER,
      },
      {
        email: "librarian@mail.ru",
        firstName: "Librarian",
        lastName: "Librarian",
        password: await bcrypt.hash("123123", salt),
        role: Role.LIBRARIAN,
      },
      {
        email: "admin@mail.ru",
        firstName: "Admin",
        lastName: "Admin",
        password: await bcrypt.hash("123123", salt),
        role: Role.ADMIN,
      },
    ],
  });

  // Создание авторов
  const authors = await prisma.author.createMany({
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
  const genres = await prisma.genre.createMany({
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

  const createdAuthors = await prisma.author.findMany();
  const createdGenres = await prisma.genre.findMany();

  // Создание книг
  const books = [
    {
      title: "Чистый код",
      author: "Роберт К. Мартин",
      genres: ["Чистый код и рефакторинг"],
      description: "Описание",
      copies: 10,
    },
    {
      title: "Чистая архитектура",
      author: "Роберт К. Мартин",
      genres: ["Архитектура программных систем"],
      description: "Описание",
      copies: 10,
    },
    {
      title: "Рефакторинг",
      author: "Мартин Фаулер",
      genres: ["Чистый код и рефакторинг"],
      description: "Описание",
      copies: 10,
    },
    {
      title: "DDD: проектирование сложных программных систем",
      author: "Эрик Эванс",
      genres: ["Архитектура программных систем"],
      description: "Описание",
      copies: 10,
    },
    {
      title: "TDD на практике",
      author: "Кент Бек",
      genres: ["Тестирование и TDD"],
      description: "Описание",
      copies: 10,
    },
    {
      title: "Микросервисная архитектура",
      author: "Сэм Ньюмэн",
      genres: ["Микросервисная архитектура", "DevOps и автоматизация"],
      description: "Описание",
      copies: 10,
    },
    {
      title: "JavaScript. Подробное руководство",
      author: "Дэвид Флэнаган",
      genres: ["Языки программирования"],
      description: "Описание",
      copies: 10,
    },
    {
      title: "Грокаем алгоритмы",
      author: "Джонатан Бака",
      genres: ["Алгоритмы и структуры данных"],
      description: "Описание",
      copies: 10,
    },
    {
      title: "Кибербезопасность для разработчиков",
      author: "Никита Прокопов",
      genres: ["Кибербезопасность"],
      description: "Описание",
      copies: 10,
    },
    {
      title: "Менеджмент в IT",
      author: "Юваль Ной Харари",
      genres: ["Менеджмент в IT"],
      description: "Описание",
      copies: 10,
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

    await prisma.book.create({
      data: {
        title: book.title,
        authorId: author.id,
        genres: { connect: genresToConnect },
        description: book.description,
        copies: book.copies,
      },
    });
  }
}

// Удаление данных
async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Book" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Borrowing" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Author" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Genre" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Log" RESTART IDENTITY CASCADE`;
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
