const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY); 
    req.user = decodedToken.user; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};