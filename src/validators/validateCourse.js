const { z } = require("zod");

const schemaCourse = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title must be less than 50 characters")
    .trim(),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(300, "Description must be less than 300 characters")
    .trim(),
  price: z.number().positive("Price must be greater than 0"),
  imageUrl: z.string().url("Invalid URL format"),
});

module.exports = { schemaCourse };
