import { Router } from "express";

import {
  createUser,
  deleteUser,
  editUser,
  getUserById,
  getUsers,
} from "../controllers/users";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// /api/users
router.get("/", isAuthenticated, checkRole(["ADMIN"]), getUsers);

// /api/users/:id
router.get(
  "/:id",
  isAuthenticated,
  checkRole(["ADMIN", "LIBRARIAN"]),
  getUserById
);

// /api/users
router.post("/", isAuthenticated, checkRole(["ADMIN"]), createUser);

// /api/users/:id
router.put("/:id", isAuthenticated, checkRole(["ADMIN"]), editUser);

// /api/users/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), deleteUser);

export default router;
