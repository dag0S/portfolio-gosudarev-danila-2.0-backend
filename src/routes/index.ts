import { Router } from "express";

import authRouter from "./auth";
import usersRouter from "./users";
import booksRouter from "./books";
import borrowingsRouter from "./borrowings";
import logsRouter from "./logs";
import authorsRouter from "./authors";
import genresRouter from "./genres";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/books", booksRouter);
router.use("/borrowings", borrowingsRouter);
router.use("/logs", logsRouter);
router.use("/genres", genresRouter);
router.use("/authors", authorsRouter);

export default router;
