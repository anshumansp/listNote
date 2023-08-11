const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const jwtToken = req.headers.authorization.split(" ")[1];
    if(jwtToken) {
      const payload = jwt.verify(jwtToken, "thisisanshumansecretkey");
      req.user = payload;
      next();
    } else {
      return res.status(403).json({
        message: "Authentication Failed"
      })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      message: "Authentication Failed",
    });
  }
};
