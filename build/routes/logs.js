"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logs_1 = require("../controllers/logs");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const checkRole_1 = require("../middlewares/checkRole");
const router = (0, express_1.Router)();
// /api/logs
router.get("/", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), logs_1.getLogs);
// /api/logs/:id
router.get("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), logs_1.getLogsById);
// /api/logs/:id
router.delete("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), logs_1.removeLog);
exports.default = router;
