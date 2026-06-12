import { body } from "express-validator";

export const createExpenseValidation = [
  body("groupId").notEmpty().withMessage("Group ID is required"),

  body("title").notEmpty().withMessage("Title is required"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be numeric"),

  body("paidBy").notEmpty().withMessage("Paid By is required"),
];
