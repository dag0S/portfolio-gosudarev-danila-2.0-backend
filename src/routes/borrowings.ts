import { Router } from "express";

import { isAuthenticated } from "../middlewares/isAuthenticated";
import { checkRole } from "../middlewares/checkRole";
import {
  borrowABook,
  checkUserBookStatus,
  getBorrowingByUserId,
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

// /api/borrowings/check?bookId=XXX&userId=YYY
router.get("/check", isAuthenticated, checkUserBookStatus);

// /api/borrowings/:userId
router.get("/:userId", isAuthenticated, getBorrowingByUserId);

// /api/borrowings
router.post("/", isAuthenticated, borrowABook);

// /api/borrowings/:id
router.put("/:id", isAuthenticated, returnBook);

// /api/borrowings/:id
router.delete("/:id", isAuthenticated, checkRole(["ADMIN"]), removeBorrowing);

export default router;
