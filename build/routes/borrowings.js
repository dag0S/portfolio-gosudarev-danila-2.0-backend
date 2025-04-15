"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const checkRole_1 = require("../middlewares/checkRole");
const borrowings_1 = require("../controllers/borrowings");
const router = (0, express_1.Router)();
// /api/borrowings
router.get("/", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), borrowings_1.getBorrowings);
// /api/borrowings/check?bookId=XXX&userId=YYY
router.get("/check", isAuthenticated_1.isAuthenticated, borrowings_1.checkUserBookStatus);
// /api/borrowings/:userId
router.get("/:userId", isAuthenticated_1.isAuthenticated, borrowings_1.getBorrowingByUserId);
// /api/borrowings
router.post("/", isAuthenticated_1.isAuthenticated, borrowings_1.borrowABook);
// /api/borrowings/:id
router.put("/:id", isAuthenticated_1.isAuthenticated, borrowings_1.returnBook);
// /api/borrowings/:id
router.delete("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), borrowings_1.removeBorrowing);
exports.default = router;
