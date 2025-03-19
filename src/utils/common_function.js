const jwt = require("jsonwebtoken");

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @param {string} secret - Secret key for JWT
 * @param {string} expiresIn - Expiry time for JWT
 * @returns {string} - JWT token
 */
const generateToken = (userId, secret, expiresIn) => {
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken  ,verifyToken};
