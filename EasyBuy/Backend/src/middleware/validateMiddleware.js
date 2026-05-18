// src/middleware/validateMiddleware.js
// ─────────────────────────────────────────────────────────────────────────────
// Generic Zod validation middleware.
// Usage: router.post('/route', protect, validate(myZodSchema), controller)
//
// It validates req.body against the provided schema.
// On failure it returns 400 with a structured list of field errors.
// On success it replaces req.body with the parsed (coerced + trimmed) data
// so controllers always receive clean, typed values.

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.') || 'body',
      message: err.message,
    }));

    return res.status(400).json({
      message: 'Validation failed.',
      errors,
    });
  }

  // Replace req.body with Zod's parsed output (coerced types, trimmed strings,
  // default values applied, unknown keys stripped)
  req.body = result.data;
  next();
};

module.exports = validate;