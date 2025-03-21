import { Router } from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkRole } from "../middlewares/checkRole";
import {
  createAuthor,
  editAuthor,
  getAuthors,
  removeAuthor,
} from "../controllers/authors";

const router = Router();

// /api/authors
router.get("/", getAuthors);

// /api/authors
router.post(
  "/",
  isAuthenticated,
  checkRole(["ADMIN", "LIBRARIAN"]),
  createAuthor
);

// /api/authors/:id
router.put(
  "/:id",
  isAuthenticated,
  checkRole(["ADMIN", "LIBRARIAN"]),
  editAuthor
);

// /api/authors/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), removeAuthor);

export default router;
