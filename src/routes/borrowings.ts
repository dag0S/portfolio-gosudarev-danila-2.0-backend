import { Router } from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkRole } from "../middlewares/checkRole";
import {
  borrowABook,
  getBorrowingById,
  getBorrowings,
  removeBorrowing,
  returnBook,
} from "../controllers/borrowings";

const router = Router();

// /api/borrowings
router.get(
  "/",
  isAuthenticated,
  checkRole(["ADMIN", "LIBRARIAN"]),
  getBorrowings
);

// /api/borrowings/:id
router.get(
  "/:id",
  isAuthenticated,
  checkRole(["ADMIN", "LIBRARIAN"]),
  getBorrowingById
);

// /api/borrowings
router.post("/", isAuthenticated, checkRole(["READER"]), borrowABook);

// /api/borrowings/:id
router.put("/:id", isAuthenticated, checkRole(["READER"]), returnBook);

// /api/borrowings/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), removeBorrowing);

export default router;
