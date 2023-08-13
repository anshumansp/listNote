const pool = require("../database/db");
const path = require("path");

exports.get_todo_homepage = (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.sendFile(path.join(__dirname, "../static/todo.html"));
};

exports.get_todo_js = (req, res) => {
  res.sendFile(path.join(__dirname, "../static/script.js"));
};

exports.create_todo = async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.status(200).json({
      message: "Successfully Saved Todo",
      id: newTodo.rows[0].id,
    });
  } catch (err) {
    console.log(err.message);
  }
};

exports.get_all_todos = async (req, res) => {
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
};

exports.get_one_todo = async (req, res) => {
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
};

exports.update_todo = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    await pool.query("UPDATE todo SET description = $1 WHERE id = $2", [
      description,
      id,
    ]);
    res.status(200).json({
      message: "Todo Updated Successfully",
      request: {
        type: "GET",
        detail: "View this todo",
        url: "http://localhost:5000/todos/" + id,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

exports.delete_todo = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todo WHERE id = $1", [id]);
    res.status(200).json({
      message: "Todo Deleted Successfully",
      request: {
        type: "POST",
        detail: "Create a new todo",
        url: "http://localhost:5000/todos/",
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};
