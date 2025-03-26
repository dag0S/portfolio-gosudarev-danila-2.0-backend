"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const checkRole_1 = require("../middlewares/checkRole");
const borrowings_1 = require("../controllers/borrowings");
const router = (0, express_1.Router)();
// /api/borrowings
router.get("/", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), borrowings_1.getBorrowings);
// /api/borrowings/:id
router.get("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), borrowings_1.getBorrowingById);
// /api/borrowings
router.post("/", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["READER"]), borrowings_1.borrowABook);
// /api/borrowings/:id
router.put("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["READER"]), borrowings_1.returnBook);
// /api/borrowings/:id
router.delete("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), borrowings_1.removeBorrowing);
exports.default = router;
