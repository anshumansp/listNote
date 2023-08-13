// Importing all Important Modules
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authorization = require("./authorization/authorize");
const todoController = require("./controller/todos");
const notesController = require("./controller/notes");
const signupController = require("./controller/signup");
const loginController = require("./controller/login");
const homeController = require("./controller/home");

// Adding Required Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/static", express.static("static", { extensions: ["js"] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rendering our Home
app.get("/home", authorization, homeController.get_homepage);
app.get("/image", homeController.get_image);

// Rendering todo page
app.get("/dashboard", authorization, todoController.get_todo_homepage);
app.get("/script", todoController.get_todo_js);

// Rendering Notes Homepage
app.get("/notes", authorization, notesController.get_notes_homepage);

// Handling Signup Methods
app.get("/signup", signupController.get_signup);
app.post("/signup", signupController.post_signup);

// Handling Login Methods
app.get("/login", loginController.get_login);
app.post("/login", loginController.post_login);
app.get("/logout", loginController.do_logout);

// CRUD Operations with Todo list
app.post("/todos", todoController.create_todo);
app.get("/todos", todoController.get_all_todos);
app.get("/todos/:id", todoController.get_one_todo);
app.put('/todos/:id', todoController.update_todo);
app.delete('/todos/:id', todoController.delete_todo);

// CRUD Operations with Notes
app.post("/note", notesController.create_note);
app.get("/note", notesController.get_all_notes);
app.get("/note/:id", notesController.get_one_note);
app.put('/note/:id', notesController.update_note);
app.delete('/note/:id', notesController.delete_note);

// Listening the Server
app.listen(port, (req, res, next)=> {
    console.log("Server started listening on port " + port)
});