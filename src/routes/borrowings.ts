import { Router } from "express";

const router = Router();

// /api/borrowings
router.get("/");

// /api/borrowings/:id
router.get("/:id");

// /api/borrowings
router.post("/");

// /api/borrowings/:id/return
router.put("/:id/return");

// /api/borrowings/:id
router.delete("/:id");

export default router;
