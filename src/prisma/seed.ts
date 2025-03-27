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
        password: await bcrypt.hash("12345rR!", salt),
        role: Role.READER,
      },
      {
        email: "librarian@mail.ru",
        firstName: "Librarian",
        lastName: "Librarian",
        password: await bcrypt.hash("12345rR!", salt),
        role: Role.LIBRARIAN,
      },
      {
        email: "admin@mail.ru",
        firstName: "Admin",
        lastName: "Admin",
        password: await bcrypt.hash("12345rR!", salt),
        role: Role.ADMIN,
      },
    ],
  });

  // Создание авторов
  const authors = await prisma.author.createMany({
    data: [
      { name: "Адитья Бхаргава" },
      { name: "Ришал Харбанс" },
      { name: "Бирюков А. А." },
      { name: "Роберт Мартин" },
      { name: "Платон" },
      { name: "Фридрих Ницше" },
      { name: "А. Ярошенко" },
      { name: "Константин Владимиров" },
      { name: "Никита Прокопов" },
      { name: "Джонатан Бака" },
    ],
  });

  // Создание жанров
  const genres = await prisma.genre.createMany({
    data: [
      { name: "Алгоритмы" },
      { name: "Программирование" },
      { name: "Искусcтвенный интеллект (ИИ)" },
      { name: "Информационная безопасность (ИБ)" },
      { name: "Философия" },
      { name: "C++" },
      { name: "Python" },
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
      title:
        "Грокаем алгоритмы. Иллюстрированное пособие для программистов и любопытствующих",
      author: "Адитья Бхаргава",
      genres: ["Алгоритмы", "Программирование", "Python"],
      description:
        "Иллюстрированное пособие для програмистов и любопытствующих. \nАлгоритмы - это всего лишь пошаговые алгоритмы решения задач, и большинство таких задач уже были кем-то решены, протестированы и проверены. Можно, конечно, погрузится в глубокую философию гениального Кнута, изучить многостраничные фолианты с доказательствами и обоснованиями, но хотите ли вы тратить на это свое время?",
      copies: 36,
      views: 122,
      bookCoverURL: "https://disk.yandex.ru/i/xZOaZNzm-jVeeg",
    },
    {
      title: "Грокаем алгоритмы искусcтвенного интеллекта",
      author: "Ришал Харбанс",
      genres: ["Алгоритмы", "Искусcтвенный интеллект (ИИ)"],
      description:
        "Искусственный интеллект — часть нашей повседневной жизни. Мы встречаемся с его проявлениями, когда занимаемся шопингом в интернет-магазинах, получаем рекомендации «вам может понравиться этот фильм», узнаем медицинские диагнозы… \nЧтобы уверенно ориентироваться в новом мире, необходимо понимать алгоритмы, лежащие в основе ИИ.",
      copies: 23,
      views: 46,
      bookCoverURL: "/imgs/books/book-1.webp",
    },
    {
      title: "Информационная безопасность: защита и нападение",
      author: "Бирюков А. А.",
      genres: ["Информационная безопасность (ИБ)", "Кибербезопасность"],
      description:
        "Книги по информационной безопасности (ИБ) преимущественно делятся на две группы: в одних большей частью присутствует нормативная информация и мало сведений о технической реализации угроз и защите от них, в других описываются только технические аспекты (серии «...глазами хакера»).",
      copies: 68,
      views: 103,
      bookCoverURL: "/imgs/books/book-1.webp",
    },
    {
      title:
        "Чистый код: создание, анализ и рефакторинг. Библиотека программиста",
      author: "Роберт Мартин",
      genres: ["Программирование"],
      description:
        "Даже плохой программный код может работать. Однако если код не является «чистым», это всегда будет мешать развитию проекта и компании-разработчика, отнимая значительные ресурсы на его поддержку и «укрощение».",
      copies: 78,
      views: 302,
      bookCoverURL: "/imgs/books/book-1.webp",
    },
    {
      title: "Государство",
      author: "Платон",
      genres: ["Философия"],
      description:
        "Диалог «Государство» занимает особое место в творчестве и мировоззрении Платона. В нем он рисует картину идеального, по его мнению, устройства жизни людей, основанного на высшей справедливости, и дает подробную характеристику основным существующим формам правления, таким, как аристократия, олигархия, тирания, демократия и другим.",
      copies: 43,
      views: 89,
      bookCoverURL: "/imgs/books/book-1.webp",
    },
    {
      title: "Так говорил Заратустра",
      author: "Фридрих Ницше",
      genres: ["Философия"],
      description:
        'Трактат "Так говорил Заратустра" называют ницшеанской Библией. \nВ нем сформулирована излюбленая идея Ницше – идея Сверхчеловека, который является для автора нравственным образцом, смыслом существования, тем, к чему нужно стремиться.',
      copies: 34,
      views: 65,
      bookCoverURL: "/imgs/books/book-1.webp",
    },
    {
      title: "ХАКИНГ на примерах. Уязвимости, взлом, защита",
      author: "А. Ярошенко",
      genres: ["Кибербезопасность", "Информационная безопасность (ИБ)"],
      description:
        "Из этой книги вы не узнаете, как взламывать банки - ничего противозаконного описано здесь не будет. Мы не хотим, чтобы у наших читателей или кого-либо еще возникли какие-то проблемы из-за нашей книги. \nБудет рассказано: об основных принципах взлома сайтов (а чтобы теория не расходилась с практикой, будет рассмотрен реальный пример взлома); отдельная глава будет посвящена угону почтового ящика (мы покажем, как взламывается почтовый ящик - будут рассмотрены различные способы).",
      copies: 76,
      views: 113,
      bookCoverURL: "/imgs/books/book-1.webp",
    },
    {
      title: "Оптимизирующие компиляторы. Структура и алгоритмы",
      author: "Константин Владимиров",
      genres: ["Алгоритмы", "Программирование", "C++"],
      description:
        "Константин Владимиров — IT-специалист с более чем 20-летним стажем, преподаватель кафедры микропроцессорных технологий в МФТИ, постоянный спикер технических конференций по темам С++, компиляторов и высокопроизводительных вычислений, автор популярного канала @tilir.",
      copies: 55,
      views: 78,
      bookCoverURL: "/imgs/books/book-1.webp",
    },
    {
      title: "Кибербезопасность для разработчиков",
      author: "Никита Прокопов",
      genres: ["Кибербезопасность"],
      description: "Описание",
      copies: 10,
      views: 10,
      bookCoverURL: "/imgs/books/book-1.webp",
    },
    {
      title: "Менеджмент в IT",
      author: "Юваль Ной Харари",
      genres: ["Менеджмент в IT"],
      description: "Описание",
      copies: 10,
      views: 10,
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

    await prisma.book.create({
      data: {
        title: book.title,
        authorId: author.id,
        genres: { connect: genresToConnect },
        description: book.description,
        copies: book.copies,
        bookCoverURL: book.bookCoverURL,
        views: book.views,
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
