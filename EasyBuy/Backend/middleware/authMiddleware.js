/**
 * @fileoverview Authentication Middleware & Controllers for EasyBuy API
 *
 * Handles:
 *  - JWT token generation & verification
 *  - User registration (CST college emails only)
 *  - User login
 *  - Route protection (protect, adminOnly)
 *  - Profile retrieval
 *
 * @module authMiddleware
 * @requires bcryptjs
 * @requires jsonwebtoken
 * @requires ../utils/jwt
 * @requires ../utils/prisma
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');
const prisma = require('../utils/prisma');

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Only CST college emails are permitted. e.g. 02250111.cst@rub.edu.bt */
const CST_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+\.cst@rub\.edu\.bt$/;

const MIN_PASSWORD_LENGTH = 6;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a signed JWT token containing the user's identity.
 *
 * @param {Object} user - The user object from the database.
 * @param {number} user.id - User's unique ID.
 * @param {string} user.name - User's display name.
 * @param {string} user.email - User's email address.
 * @param {string} user.role - User's role ('USER' | 'ADMIN').
 * @returns {string} Signed JWT token.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Strips the password field from a user object before sending it
 * in a response. Prevents accidental password exposure.
 *
 * @param {Object} user - Raw user object (may include password).
 * @returns {Object} User object without the password field.
 */
const sanitizeUser = ({ password, ...safeUser }) => safeUser;

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @middleware protect
 * @description Verifies the JWT token from the Authorization header and
 * attaches the authenticated user to `req.user`. Must be used before any
 * route handler that requires authentication.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 *
 * @example
 * // Protect a single route
 * router.get('/profile', protect, getProfile);
 *
 * // Protect all routes in a router
 * router.use(protect);
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Confirm the user still exists in the database
    // (guards against tokens issued to deleted accounts)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Not authorized. User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
  }
};

/**
 * @middleware adminOnly
 * @description Restricts access to users with the ADMIN role.
 * Must be used after `protect` so that `req.user` is already set.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 *
 * @example
 * router.delete('/users/:id', protect, adminOnly, deleteUser);
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// ─────────────────────────────────────────────────────────────────────────────
// Controllers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @controller registerUser
 * @route  POST /api/auth/register
 * @access Public
 *
 * @description Creates a new user account. Only CST college email addresses
 * (ending in `.cst@rub.edu.bt`) are accepted. The password is hashed with
 * bcrypt before being stored. Returns a JWT token on success.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *
 * @body {string} name     - Full name of the user.
 * @body {string} email    - Must be a valid CST email e.g. 02250111.cst@rub.edu.bt
 * @body {string} password - Minimum 6 characters.
 * @body {string} [role]   - Optional. Defaults to 'USER'. Pass 'ADMIN' if needed.
 *
 * @returns {201} { message, token, user }
 * @returns {400} Validation error (missing fields, bad email, short password)
 * @returns {409} Email already registered
 * @returns {500} Unexpected server error
 *
 * @example
 * // Request body
 * {
 *   "name": "Tenzin Dorji",
 *   "email": "02250111.cst@rub.edu.bt",
 *   "password": "securePass123"
 * }
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (!CST_EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        message: 'Only CST college emails are allowed. Example: 02250111.cst@rub.edu.bt',
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    // ── Check for duplicate email ─────────────────────────────────────────────
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'This email is already registered.' });
    }

    // ── Create user ───────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role === 'ADMIN' ? 'ADMIN' : 'USER',
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('[registerUser]', error.message);
    return res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

/**
 * @controller loginUser
 * @route  POST /api/auth/login
 * @access Public
 *
 * @description Authenticates a user with their email and password.
 * Returns a JWT token and the user's public data on success.
 * The password is never included in the response.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *
 * @body {string} email    - Registered CST email address.
 * @body {string} password - The account password.
 *
 * @returns {200} { message, token, user }
 * @returns {400} Missing email or password
 * @returns {401} Invalid credentials
 * @returns {500} Unexpected server error
 *
 * @example
 * // Request body
 * {
 *   "email": "02250111.cst@rub.edu.bt",
 *   "password": "securePass123"
 * }
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // ── Find user ─────────────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'No account found with that email.' });
    }

    // ── Verify password ───────────────────────────────────────────────────────
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('[loginUser]', error.message);
    return res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

/**
 * @controller getProfile
 * @route  GET /api/auth/me
 * @access Private (requires protect middleware)
 *
 * @description Returns the currently authenticated user's profile.
 * The user data is sourced from `req.user`, which is set by the
 * `protect` middleware after verifying the JWT.
 *
 * @param {import('express').Request} req - Must have req.user set by protect.
 * @param {import('express').Response} res
 *
 * @returns {200} { message, user }
 *
 * @example
 * // Response
 * {
 *   "message": "Profile fetched successfully.",
 *   "user": { "id": 1, "name": "Tenzin", "email": "...", "role": "USER" }
 * }
 */
const getProfile = (req, res) => {
  return res.status(200).json({
    message: 'Profile fetched successfully.',
    user: req.user,
  });
};

// Exports
module.exports = {
  protect,
  adminOnly,
  registerUser,
  loginUser,
  getProfile,
};