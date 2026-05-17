// Middleware factory — wraps a Zod schema and validates req.body.
// On failure it returns a 400 with the first validation error message.
// On success it replaces req.body with the parsed (coerced + trimmed) data.

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.errors[0]?.message || 'Validation error.';
    return res.status(400).json({ message });
  }

  // Replace body with the cleaned, coerced values from Zod
  req.body = result.data;
  next();
};

module.exports = validate;
