import { Router } from "express";
import multer from "multer";
import { v4 as uuidV4 } from "uuid";
import path from "path";

import { create, edit, getAll, getOne, remove } from "../controllers/projects";
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

// /api/projects
router.get("/", getAll);

// /api/projects/:id
router.get("/:id", getOne);

// /api/projects
router.post(
  "/",
  isAuthenticated,
  checkRole(["ADMIN"]),
  upload.single("imageURL"),
  create
);

// /api/projects/:id
router.put("/:id", isAuthenticated, checkRole(["ADMIN"]), edit);

// /api/projects/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), remove);

export default router;
