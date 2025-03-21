import { Router } from "express";
import { getLogs, getLogsById, removeLog } from "../controllers/logs";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// /api/logs
router.get("/", isAuthenticated, checkRole(["ADMIN"]), getLogs);

// /api/logs/:id
router.get("/:id", isAuthenticated, checkRole(["ADMIN"]), getLogsById);

// /api/logs/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), removeLog);

export default router;
