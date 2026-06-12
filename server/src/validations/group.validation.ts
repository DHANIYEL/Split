import { body } from "express-validator";

export const createGroupValidation = [
  body("title").notEmpty().withMessage("Title is required"),

  body("members")
    .isArray({ min: 1 })
    .withMessage("At least one member is required"),
];
