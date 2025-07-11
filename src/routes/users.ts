import { Router } from "express";

import { create, edit, getAll, getById, remove } from "../controllers/users";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// /api/users
router.get("/", isAuthenticated, checkRole(["ADMIN"]), getAll);

// /api/users/:id
router.get("/:id", isAuthenticated, checkRole(["ADMIN", "LIBRARIAN"]), getById);

// /api/users
router.post("/", isAuthenticated, checkRole(["ADMIN"]), create);

// /api/users/:id
router.put("/:id", isAuthenticated, checkRole(["ADMIN"]), edit);

// /api/users/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), remove);

export default router;
