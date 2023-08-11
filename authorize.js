const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  try {
    const decodedToken = jwt.verify(token, 'thisisanshumansecretkey'); 
    req.user = decodedToken.user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};