import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpenseDetails,
  getGroupExpenses,
  updateExpense,
} from "../controllers/expense.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createExpenseValidation } from "../validations/createExpenseValidation";

const router = Router();

router.post("/", authMiddleware, createExpenseValidation, createExpense);

router.get("/group/:groupId", authMiddleware, getGroupExpenses);

router.get("/:expenseId", authMiddleware, getExpenseDetails);

router.put("/:expenseId", authMiddleware, updateExpense);

router.delete("/:expenseId", authMiddleware, deleteExpense);

export default router;
