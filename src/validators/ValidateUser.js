const { z } = require("zod");

const schemaUser = z.object({
  firstName: z
    .string()
    .min(1, "First name must be at least 1 characters")
    .max(100, "First name must be less than 100 characters")
    .trim(),
  lastName: z
    .string()
    .min(1, "Last name must be at least 1 characters")
    .max(100, "Last name must be less than 100 characters")
    .trim()
    .optional(),
  email: z.string().email("Invalid email format").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &)"
    ),
});

module.exports = { schemaUser };
