"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const books_1 = require("../controllers/books");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const checkRole_1 = require("../middlewares/checkRole");
const router = (0, express_1.Router)();
// /api/books
router.get("/", books_1.getAll);
// /api/books/:id
router.get("/:id", books_1.getOne);
// /api/books
router.post("/", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), books_1.create);
// /api/books/:id
router.put("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), books_1.edit);
// /api/books/:id
router.delete("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), books_1.remove);
exports.default = router;
