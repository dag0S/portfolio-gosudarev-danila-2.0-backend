import { Router } from "express";

import { createUser, getUserById, getUsers } from "../controllers/users";

const router = Router();

// /api/users
router.get("/", getUsers);

// /api/users/:id
router.get("/:id", getUserById);

// /api/users
router.post("/", createUser);

// /api/users/:id
router.put("/:id");

// /api/users/:id
router.delete("/:id");

export default router;
