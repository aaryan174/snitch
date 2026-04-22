import { body } from "express-validator";

export const createProductValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),
  body("prizeAmount")
    .notEmpty()
    .withMessage("Price amount is required")
    .isFloat({ min: 1 })
    .withMessage("Price must be a positive number"),
  body("prizeCurrency")
    .optional()
    .isIn(["USD", "EUR", "GBP", "JPY", "INR"])
    .withMessage("Currency must be one of: USD, EUR, GBP, JPY, INR"),
];
