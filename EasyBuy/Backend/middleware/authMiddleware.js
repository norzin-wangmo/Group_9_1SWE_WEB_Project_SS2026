const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Temporary storage if database is not connected yet
let users = [];

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    // Only CST college email is allowed
    // Valid example: norzin.cst@rub.edu.bt or 02250359.cst@rub.edu.bt
    const collegeEmailRegex = /^[a-zA-Z0-9._%+-]+\.cst@rub\.edu\.bt$/;

    if (!collegeEmailRegex.test(email)) {
      return res.status(400).json({
        message: 'Only CST college email is allowed. Example: name.cst@rub.edu.bt',
      });
    }

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    };

    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Registration failed',
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((user) => user.email === email);

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Login failed',
      error: error.message,
    });
  }
};

const getProfile = (req, res) => {
  res.status(200).json({
    message: 'Profile accessed successfully',
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};