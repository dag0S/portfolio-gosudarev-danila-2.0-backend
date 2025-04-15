"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const router = (0, express_1.Router)();
// /api/auth/register
router.post("/register", auth_1.register);
// /api/auth/login
router.post("/login", auth_1.login);
// /api/auth/logout
router.post("/logout", isAuthenticated_1.isAuthenticated, auth_1.logout);
// /api/auth/me
router.get("/me", isAuthenticated_1.isAuthenticated, auth_1.me);
// /api/auth/refresh
router.post("/refresh", auth_1.refresh);
exports.default = router;
