const pool = require("../database/db");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");

exports.get_login = (req, res, next) => {
  const filePath = path.join(__dirname, "../static/login.html");
  res.sendFile(filePath);
};

exports.get_image = (req, res, next)=> {
  const filePath = path.join(__dirname, "../static/d.jpg");
  res.sendFile(filePath);
}

exports.do_logout = (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
};

exports.post_login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const findUserQuery = "SELECT * FROM users WHERE email = $1";
    const findUserResponse = await pool.query(findUserQuery, [email]);
    const user = findUserResponse.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "Invalid Credentials",
      });
    }

    const userPass = user.password;
    bcrypt.compare(password, userPass, (err, success) => {
      if (err || !success) {
        return res.status(401).json({
          message: "Invalid Credentials",
        });
      }

      const token = jwt.sign(
        {
          user: user.email,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
      res.status(200).json({
        message: "Logged in Successfully",
        token: token,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
