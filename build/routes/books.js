"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const books_1 = require("../controllers/books");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const checkRole_1 = require("../middlewares/checkRole");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.resolve(__dirname, "..", "static/books"));
    },
    filename: (req, file, cb) => {
        cb(null, `${(0, uuid_1.v4)()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
// /api/books
router.get("/", books_1.getAll);
// /api/books/info
router.get("/info", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), books_1.getAllInfo);
// /api/books/:id
router.get("/:id", books_1.getOne);
// /api/books
router.post("/", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), upload.single("bookCoverURL"), books_1.create);
// /api/books/:id
router.put("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN", "LIBRARIAN"]), books_1.edit);
// /api/books/:id
router.delete("/:id", isAuthenticated_1.isAuthenticated, (0, checkRole_1.checkRole)(["ADMIN"]), books_1.remove);
exports.default = router;
