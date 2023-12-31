const pool = require("../database/db");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");

exports.get_signup = (req, res, next) => {
  const filePath = path.join(__dirname, "../static/signup.html");
  res.sendFile(filePath);
};

exports.get_image = (req, res, next)=> {
  const filePath = path.join(__dirname, "../static/d.jpg");
  res.sendFile(filePath);
}

exports.post_signup = async (req, res, next) => {
  const { name, username, email, password } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length >= 1) {
      return res.status(409).json({
        message: "Email Already Exists",
      });
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      const insertUserQuery =
        "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)";
      const newUser = await pool.query(insertUserQuery, [
        name,
        username,
        email,
        hash,
      ]);

      const token = jwt.sign(
        {
          email: email,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        expiresIn: new Date(Date.now() + 3600000),
      });
      res.status(201).json({
        message: "Signed Up Successfully",
        token: token,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
    console.log(err.message);
  }
};
