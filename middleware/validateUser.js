const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const validateUser = async (req, res, next) => {
  console.log('validateUser middleware called');
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('No token or invalid token format in authorization header');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extracted from header');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token successfully verified', decoded);

    //  Get full user info (without password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.warn('User not found for decoded token id:', decoded.id);
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user; // Attach user to request
    console.log('User attached to request:', user._id);
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = validateUser;