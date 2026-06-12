import { Response } from "express";
import { validationResult } from "express-validator";
import {
  createExpenseService,
  deleteExpenseService,
  getExpenseDetailsService,
  getGroupExpensesService,
  updateExpenseService,
} from "../services/expense.service";
import { AuthRequest } from "../types/auth";

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const expense = await createExpenseService({
      ...req.body,
      createdBy: req.userId!,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupExpenses = async (req: AuthRequest, res: Response) => {
  const data = await getGroupExpensesService(req.params.groupId as string);

  res.json({
    success: true,
    data,
  });
};

export const getExpenseDetails = async (req: AuthRequest, res: Response) => {
  const data = await getExpenseDetailsService(req.params.expenseId as string);

  res.json({
    success: true,
    data,
  });
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
  const data = await updateExpenseService(
    req.params.expenseId as string,
    req.userId!,
    req.body,
  );

  res.json({
    success: true,
    data,
  });
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  await deleteExpenseService(
    req.params.expenseId as string as string,
    req.userId!,
  );

  res.json({
    success: true,
    message: "Expense deleted successfully",
  });
};
