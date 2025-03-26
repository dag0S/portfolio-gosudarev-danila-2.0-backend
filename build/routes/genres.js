"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const checkRole_1 = require("../middlewares/checkRole");
const genres_1 = require("../controllers/genres");
const router = (0, express_1.Router)();
// /api/genres
router.get("/", genres_1.getGenres);
// /api/genres
router.post("/", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), genres_1.createGenre);
// /api/genres/:id
router.put("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), genres_1.editGenre);
// /api/genres/:id
router.delete("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), genres_1.removeGenre);
exports.default = router;
