"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const checkRole_1 = require("../middlewares/checkRole");
const authors_1 = require("../controllers/authors");
const router = (0, express_1.Router)();
// /api/authors
router.get("/", authors_1.getAuthors);
// /api/authors
router.post("/", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), authors_1.createAuthor);
// /api/authors/:id
router.put("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), authors_1.editAuthor);
// /api/authors/:id
router.delete("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), authors_1.removeAuthor);
exports.default = router;
