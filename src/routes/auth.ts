import { Router } from "express";

import { login, logout, me, register } from "../controllers/auth";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

// /api/auth/register
router.post("/register", register);

// /api/auth/login
router.post("/login", login);

// /api/auth/logout
router.post("/logout", logout);

// /api/auth/me
router.get("/me", isAuthenticated, me);

export default router;
