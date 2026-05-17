const { z } = require('zod');

// ─── Auth ─────────────────────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(100, 'Name is too long.').trim(),
  email: z.string().email('Invalid email address.').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address.').toLowerCase(),
  password: z.string().min(1, 'Password is required.'),
});

const updateMeSchema = z
  .object({
    name: z.string().min(1).max(100).trim().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters.').optional(),
  })
  .refine((data) => data.name !== undefined || data.password !== undefined, {
    message: 'Provide at least one field to update (name or password).',
  });

// ─── Products ─────────────────────────────────────────────────────────────────

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required.').max(200).trim(),
  description: z.string().max(2000).trim().optional(),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number.' })
    .positive('Price must be greater than 0.')
    .multipleOf(0.01, 'Price can have at most 2 decimal places.'),
  category: z.string().max(100).trim().optional(),
  stock: z.coerce
    .number()
    .int('Stock must be a whole number.')
    .min(0, 'Stock cannot be negative.')
    .optional()
    .default(0),
  imageUrl: z.string().url('imageUrl must be a valid URL.').optional().or(z.literal('')),
});

const updateProductSchema = z
  .object({
    name: z.string().min(1).max(200).trim().optional(),
    description: z.string().max(2000).trim().optional(),
    price: z.coerce
      .number()
      .positive('Price must be greater than 0.')
      .multipleOf(0.01)
      .optional(),
    category: z.string().max(100).trim().optional(),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative.').optional(),
    imageUrl: z.string().url('imageUrl must be a valid URL.').optional().or(z.literal('')),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update.',
  });

// ─── Messages ─────────────────────────────────────────────────────────────────

const sendMessageSchema = z.object({
  receiverId: z.coerce
    .number({ invalid_type_error: 'receiverId must be a number.' })
    .int()
    .positive('receiverId must be a positive integer.'),
  content: z
    .string()
    .min(1, 'Message content cannot be empty.')
    .max(2000, 'Message is too long.'),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateMeSchema,
  createProductSchema,
  updateProductSchema,
  sendMessageSchema,
};
