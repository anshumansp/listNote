// Importing all Important Modules
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const authorization = require("./authorization/authorize");
const todoController = require("./controller/todos");
const signupController = require("./controller/signup");
const loginController = require("./controller/login");

// Adding Required Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/static", express.static("static", { extensions: ["js"] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rendering our Dashboard
app.get("/dashboard", authorization, (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.sendFile(__dirname + "/static/todo.html");
});

// Handling Signup Methods
app.get("/signup", signupController.get_signup);
app.post("/signup", signupController.post_signup);

// Handling Login Methods
app.get("/login", loginController.get_login);
app.post("/login", loginController.post_login);

// Handling Logout Methods
app.get('/logout', (req, res) => {
  res.clearCookie('jwt'); 
  res.redirect('/login');
});

// CRUD Operations with Todo list
app.post("/todos", todoController.create_todo);
app.get("/todos", todoController.get_all_todos);
app.get("/todos/:id", todoController.get_one_todo);
app.put('/todos/:id', todoController.update_todo);
app.delete('/todos/:id', todoController.delete_todo);

// Listening the Server
app.listen(port, (req, res, next)=> {
    console.log("Server started listening on port " + port)
});