// Importing all Important Modules
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const pool = require("./db");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const authorization = require("./authorize");
const bcrypt = require("bcrypt");

// Adding Required Middlewares
app.use(cors());
app.use(express.json());
app.use("/static", express.static("static", { extensions: ["js"] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rendering our Static Files
app.get("/dashboard", (req, res, next) => {
  res.sendFile(__dirname + "/static/todo.html");
});

app.get("/signup", (req, res, next) => {
  res.sendFile(__dirname + "/static/signup.html");
});

app.post("/signup", async (req, res, next) => {
  const { name, username, email, password } = req.body;

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

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
      const newUser = await pool.query(insertUserQuery, [name, username, email, hash]);

      res.status(201).json({
        message: "Form Submitted Successfully, Login Now.",
        url: "http://localhost:5000/login",
      });

      console.log(newUser.rows);
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


app.get("/login", (req, res, next) => {
  res.sendFile(__dirname + "/static/login.html");
});

app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const findUserQuery = "SELECT * FROM users WHERE email = $1";
    const findUserResponse = await pool.query(findUserQuery, [email]);
    const user = findUserResponse.rows[0];

    if (!user) {
      return res.status(404).json({
        message: "This user does not exist",
      });
    }

    const userPass = user.password;
    bcrypt.compare(password, userPass, (err, success) => {
      if (err || !success) {
        return res.status(401).json({
          message: "Authentication Failed",
        });
      }

      const token = jwt.sign(
        {
          email: user.email,
        },
        "thisisanshumansecretkey",
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        message: "Logged In Successfully",
        token: token,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});



// Creating a Todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.status(200).json({
      message: "Successfully Saved Todo",
      savedTodo: newTodo.rows,
    });
    console.log(newTodo.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// Getting all Todo

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.status(201).json({
      message: "Successfully Fetched all the Todos",
      count: allTodos.rows.length,
      yourTodos: allTodos.rows,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// Getting a Todo

app.get("/todos/:id", async (req, res) => {
  try {
    const myTodo = await pool.query("SELECT * FROM todo WHERE id= $1", [
      req.params.id,
    ]);
    if (myTodo.rows.length < 1) {
      res.status(500).json({
        message: "No Todo Found for this Id",
      });
    } else {
      res.status(200).json({
        message: "Fetched Todo Successfully",
        todo: myTodo.rows[0],
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

// Updating a Todo

app.put('/todos/:id', async(req, res)=> {
    try {
        const {id} = req.params;
        const {description} = req.body;
        await pool.query("UPDATE todo SET description = $1 WHERE id = $2", [description, id])
        res.status(200).json({
            message: 'Todo Updated Successfully',
            request: {
                type: "GET",
                detail: "View this todo",
                url: "http://localhost:5000/todos/" + id
            }
        })
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
})

// Deleting a Todo

app.delete('/todos/:id', async (req, res)=> {
    try {
        const {id} = req.params;
        await pool.query("DELETE FROM todo WHERE id = $1", [id]) 
        res.status(200).json({
            message: "Todo Deleted Successfully",
            request: {
                type: "POST",
                detail: "Create a new todo",
                url: "http://localhost:5000/todos/"
            }
        })       
    } catch (err) {
        res.status(500).json({
            error: err
        })    
    }
})

app.listen(port, (req, res, next)=> {
    console.log("Server started listening on port " + port)
});