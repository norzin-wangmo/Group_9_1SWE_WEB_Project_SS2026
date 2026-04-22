const pool = require('../config/db');

const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, product_condition, image_url } = req.body;
    const user_id = req.user.id;

    if (!title || !price) {
      return res.status(400).json({ message: 'Title and price are required' });
    }

    const result = await pool.query(
      `INSERT INTO products (user_id, title, description, price, category, product_condition, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, title, description, price, category, product_condition, image_url]
    );

    res.status(201).json({
      message: 'Product created successfully',
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT products.*, users.full_name AS seller_name, users.email AS seller_email
       FROM products
       JOIN users ON products.user_id = users.id
       ORDER BY products.created_at DESC`
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT products.*, users.full_name AS seller_name, users.email AS seller_email
       FROM products
       JOIN users ON products.user_id = users.id
       WHERE products.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, product_condition, image_url, status } = req.body;

    const productCheck = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productCheck.rows[0];

    if (product.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own product' });
    }

    const result = await pool.query(
      `UPDATE products
       SET title = $1, description = $2, price = $3, category = $4,
           product_condition = $5, image_url = $6, status = $7
       WHERE id = $8
       RETURNING *`,
      [title, description, price, category, product_condition, image_url, status, id]
    );

    res.status(200).json({
      message: 'Product updated successfully',
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productCheck = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = productCheck.rows[0];
    if (product.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own product' });
    }

    await pool.query('DELETE FROM products WHERE id = $1', [id]);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};