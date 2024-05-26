const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function (req, res, next) {
  const token = req.header('token');

  if (!token) {
    return res.status(401).json({ msg: 'Tidak ada token, otorisasi di tolak' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token Tidak Valid' });
  }
};
