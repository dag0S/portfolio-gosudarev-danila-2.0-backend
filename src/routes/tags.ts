import { Router } from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkRole } from "../middlewares/checkRole";
import { create, edit, getAll, remove } from "../controllers/tags";

const router = Router();

// /api/genres
router.get("/", getAll);

// /api/genres
router.post("/", isAuthenticated, checkRole(["ADMIN"]), create);

// /api/genres/:id
router.put("/:id", isAuthenticated, checkRole(["ADMIN"]), edit);

// /api/genres/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), remove);

export default router;
