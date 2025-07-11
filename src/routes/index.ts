import { Router } from "express";

import authRouter from "./auth";
import usersRouter from "./users";
import booksRouter from "./projects";
import genresRouter from "./tags";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/projects", booksRouter);
router.use("/genres", genresRouter);

export default router;
