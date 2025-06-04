const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const validateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Get full user info (without password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = validateUser;
