import { Router } from "express";
import multer from "multer";
import { v4 as uuidV4 } from "uuid";
import path from "path";

import {
  create,
  edit,
  getAll,
  getAllInfo,
  getOne,
  remove,
} from "../controllers/books";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkRole } from "../middlewares/checkRole";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "..", "static/books"));
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidV4()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = Router();

// /api/books
router.get("/", getAll);

// /api/books/info
router.get(
  "/info",
  isAuthenticated,
  checkRole(["ADMIN", "LIBRARIAN"]),
  getAllInfo
);

// /api/books/:id
router.get("/:id", getOne);

// /api/books
router.post(
  "/",
  isAuthenticated,
  checkRole(["ADMIN", "LIBRARIAN"]),
  upload.single("bookCoverURL"),
  create
);

// /api/books/:id
router.put("/:id", isAuthenticated, checkRole(["ADMIN", "LIBRARIAN"]), edit);

// /api/books/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), remove);

export default router;
