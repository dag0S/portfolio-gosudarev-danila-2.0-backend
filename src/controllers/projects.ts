import { Request, Response } from "express";
import path from "path";
import fs from "fs";

import { prisma } from "../prisma/prisma-client";
import { CreateProjectDto } from "../dtos/CreateProject.dto";
import { IProjectsQueryParams } from "../types/types";

/**
 * @route GET /api/projects
 * @desc Получение всех проектов
 * @access Public
 */
export const getAll = async (
  req: Request<{}, {}, {}, IProjectsQueryParams>,
  res: Response
): Promise<any> => {
  try {
    const { searchBy } = req.query;

    const projectsWhere: any = {};

    if (searchBy) {
      projectsWhere["OR"] = [
        {
          title: {
            contains: searchBy,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchBy,
            mode: "insensitive",
          },
        },
        {
          tags: {
            some: {
              name: {
                contains: searchBy,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    const projects = await prisma.project.findMany({
      where: projectsWhere,
      include: {
        tags: {},
      },
    });

    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить проекты",
    });
  }
};

/**
 * @route GET /api/projects/:id
 * @desc Получение одного проекта по id
 * @access Public
 */
export const getOne = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        tags: {},
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Не удалось найти проект",
      });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        tags: {},
      },
    });

    return res.status(200).json(updatedProject);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось получить проект",
    });
  }
};

/**
 * @route POST /api/projects
 * @desc Создание проекта
 * @access Private
 */
export const create = async (
  req: Request<{}, {}, CreateProjectDto>,
  res: Response
): Promise<any> => {
  try {
    const { description, title, authorId } = req.body;
    let imageURL = null;

    if (!description || !title || !authorId) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
      });
    }

    if (req.file) {
      const { filename } = req.file;
      imageURL = filename;
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        authorId,
        imageURL,
      },
    });

    if (!project) {
      return res.status(500).json({ message: "Не удалось создать проект" });
    }

    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
};

/**
 * @route PUT /api/projects/:id
 * @desc Обновление проекта
 * @access Private
 */
export const edit = async (
  req: Request<{ id: string }, {}, CreateProjectDto>,
  res: Response
): Promise<any> => {
  try {
    const { authorId, description, title } = req.body;
    const { id } = req.params;

    if (!authorId || !description || !title) {
      return res.status(400).json({
        message: "Заполните обязательные поля",
      });
    }

    await prisma.project.update({
      where: {
        id,
      },
      data: {
        title,
        authorId,
        description,
      },
    });

    return res.status(204).json({ message: "Проект успешно отредактирован" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось отредактировать проект",
    });
  }
};

/**
 * @route DELETE /api/projects/:id
 * @desc Удаление проекта
 * @access Private
 */
export const remove = async (
  req: Request<{ id: string }, {}, CreateProjectDto>,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Проект не найден" });
    }

    if (project.imageURL) {
      const filePath = path.join(
        __dirname,
        `../static/books/${project.imageURL}`
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Файл не найден" });
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          return res.status(500).json({ message: "Ошибка удаления файла" });
        }
      });
    }

    await prisma.project.delete({
      where: {
        id,
      },
    });

    return res.status(204).json({ message: "Проект успешно удален" });
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить проект",
    });
  }
};
