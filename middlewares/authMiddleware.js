const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Extract the token from the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send('Access denied. No token provided.');
  }

  // Split and remove the "Bearer " part if present
  const token = authHeader.split(' ')[1]; // Extracts the actual token

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret'); // Use env variable for secret
    
    // Fetch user by decoded id
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).send('Invalid token. User not found.');
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Error verifying token:', err.message);  // Log more details for debugging
    return res.status(401).send('Invalid token.');
  }
};

module.exports = authMiddleware;
