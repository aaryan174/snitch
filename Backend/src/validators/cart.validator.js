import { param, body } from "express-validator";

export const validateAddToCart = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    param("variantId")
        .optional()
        .custom((value) => {
            if (value === 'none' || value === 'undefined') return true;
            if (!/^[0-9a-fA-F]{24}$/.test(value)) throw new Error('Invalid variant ID');
            return true;
        }),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
];

export const validateIncrementCartItemQuantity = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    param("variantId")
        .optional()
        .custom((value) => {
            if (value === 'none' || value === 'undefined') return true;
            if (!/^[0-9a-fA-F]{24}$/.test(value)) throw new Error('Invalid variant ID');
            return true;
        }),
];