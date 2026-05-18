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
  categoryId: z.coerce.number().int().positive('categoryId must be a positive integer.').optional(),
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
    price: z.coerce.number().positive('Price must be greater than 0.').multipleOf(0.01).optional(),
    categoryId: z.coerce.number().int().positive().optional().nullable(),
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

// ─── Categories ───────────────────────────────────────────────────────────────

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required.').max(100).trim(),
  description: z.string().max(500).trim().optional(),
});

const updateCategorySchema = z
  .object({
    name: z.string().min(1).max(100).trim().optional(),
    description: z.string().max(500).trim().optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: 'Provide at least one field to update (name or description).',
  });

// ─── Product Images ───────────────────────────────────────────────────────────

const productImageSchema = z.object({
  url: z.string().url('Each image must have a valid URL.'),
  altText: z.string().max(300).trim().optional(),
  isPrimary: z.boolean().optional().default(false),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
});

const addProductImagesSchema = z.object({
  images: z
    .array(productImageSchema)
    .min(1, 'Provide at least one image.')
    .max(10, 'You can add at most 10 images at a time.'),
});

const updateProductImageSchema = z
  .object({
    altText:   z.string().max(300).trim().optional(),
    sortOrder: z.coerce.number().int().min(0).optional(),
    isPrimary: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update (altText, sortOrder, isPrimary).',
  });

// ─── Payments ─────────────────────────────────────────────────────────────────

const createPaymentSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: 'Amount must be a number.' })
    .positive('Amount must be greater than 0.')
    .multipleOf(0.01, 'Amount can have at most 2 decimal places.'),
  description: z.string().max(500).trim().optional(),
  reference: z.string().max(200).trim().optional(),
  uploadRequestId: z.coerce.number().int().positive().optional(),
});

// ─── Upload Requests / Approvals ──────────────────────────────────────────────

const uploadRequestSchema = z.object({
  productId: z.coerce
    .number({ invalid_type_error: 'productId must be a number.' })
    .int()
    .positive('productId must be a positive integer.'),
  note: z.string().max(1000, 'Note is too long.').trim().optional(),
});

const reviewRequestSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED', 'approved', 'rejected'], {
    errorMap: () => ({ message: 'decision must be "APPROVED" or "REJECTED".' }),
  }),
  reason: z.string().max(1000, 'Reason is too long.').trim().optional(),
});

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  // Auth
  registerSchema,
  loginSchema,
  updateMeSchema,
  // Products
  createProductSchema,
  updateProductSchema,
  // Messages
  sendMessageSchema,
  // Categories
  createCategorySchema,
  updateCategorySchema,
  // Product Images
  addProductImagesSchema,
  updateProductImageSchema,
  // Payments
  createPaymentSchema,
  // Approvals
  uploadRequestSchema,
  reviewRequestSchema,
};