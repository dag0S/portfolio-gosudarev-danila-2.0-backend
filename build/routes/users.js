"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const checkRole_1 = require("../middlewares/checkRole");
const router = (0, express_1.Router)();
// /api/users
router.get("/", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), users_1.getAll);
// /api/users/:id
router.get("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), users_1.getById);
// /api/users
router.post("/", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), users_1.create);
// /api/users/:id
router.put("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), users_1.edit);
// /api/users/:id
router.delete("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), users_1.remove);
exports.default = router;
