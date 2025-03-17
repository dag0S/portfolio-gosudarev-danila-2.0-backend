import { Router } from "express";

import authRouter from "./auth";
import usersRouter from "./users";
import booksRouter from "./books";
import borrowingsRouter from "./borrowings";
import logsRouter from "./logs";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/books", booksRouter);
router.use("/borrowings", borrowingsRouter);
router.use("/logs", logsRouter);

export default router;
