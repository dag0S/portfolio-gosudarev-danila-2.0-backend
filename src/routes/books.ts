import { Router } from "express";

const router = Router();

// /api/books
router.get("/");

// /api/books/:id
router.get("/:id");

// /api/books
router.post("/");

// /api/books/:id
router.put("/:id");

// /api/books/:id
router.delete("/:id");

export default router;
