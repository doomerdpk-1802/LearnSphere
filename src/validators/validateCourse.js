const { z } = require("zod");

const schemaCourse = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(50, "Title must be less than 50 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(300, "Description must be less than 150 characters"),
  price: z.number(),
  imageUrl: z.string().url("Invalid URL format"),
});

module.exports = { schemaCourse };
