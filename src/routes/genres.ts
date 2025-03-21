import { Router } from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkRole } from "../middlewares/checkRole";
import {
  createGenre,
  editGenre,
  getGenres,
  removeGenre,
} from "../controllers/genres";

const router = Router();

// /api/genres
router.get("/", getGenres);

// /api/genres
router.post(
  "/",
  isAuthenticated,
  checkRole(["ADMIN", "LIBRARIAN"]),
  createGenre
);

// /api/genres/:id
router.put(
  "/:id",
  isAuthenticated,
  checkRole(["ADMIN", "LIBRARIAN"]),
  editGenre
);

// /api/genres/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), removeGenre);

export default router;
