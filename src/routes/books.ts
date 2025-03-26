import { Router } from "express";
import multer from "multer";

import { create, edit, getAll, getOne, remove } from "../controllers/books";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkRole } from "../middlewares/checkRole";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// /api/books
router.get("/", getAll);

// /api/books/:id
router.get("/:id", getOne);

// /api/books
router.post(
  "/",
  upload.single("bookCoverURL"),
  isAuthenticated,
  checkRole(["ADMIN", "LIBRARIAN"]),
  create
);

// /api/books/:id
router.put("/:id", isAuthenticated, checkRole(["ADMIN", "LIBRARIAN"]), edit);

// /api/books/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), remove);

export default router;
