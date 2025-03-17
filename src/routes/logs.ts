import { Router } from "express";

const router = Router();

// /api/logs
router.get("/");

// /api/logs/:id
router.get("/:id");

// /api/logs/:id
router.delete("/:id");

export default router;
