const pool = require("../database/db");
const path = require("path");

exports.get_notes_homepage = (req, res) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.sendFile(path.join(__dirname, "../static/notes.html"));
};

exports.create_note = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newNote = await pool.query(
      "INSERT INTO notes (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(200).json({
      message: "Successfully Saved the Note",
      note: newNote.rows[0],
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Failed to Save the Note",
    });
  }
};

exports.get_all_notes = async (req, res) => {
  try {
    const allNotes = await pool.query("SELECT * FROM notes");
    res.status(201).json({
      message: "Successfully Fetched all the Notes",
      count: allNotes.rows.length,
      yourNotes: allNotes.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.get_one_note = async (req, res) => {
  try {
    const myNote = await pool.query("SELECT * FROM notes WHERE id= $1", [
      req.params.id,
    ]);
    if (myNote.rows.length < 1) {
      res.status(500).json({
        message: "No Note Found for this Id",
      });
    } else {
      res.status(200).json({
        message: "Fetched Note Successfully",
        Note: myNote.rows[0],
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.update_note = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    await pool.query("UPDATE notes SET description = $1 WHERE id = $2", [
      description,
      id,
    ]);
    res.status(200).json({
      message: "Note Updated Successfully",
      request: {
        type: "GET",
        detail: "View this Note",
        url: "http://localhost:5000/note/" + id,
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.delete_note = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notes WHERE id = $1", [id]);
    res.status(200).json({
      message: "Note Deleted Successfully",
      request: {
        type: "POST",
        detail: "Create a new note",
        url: "http://localhost:5000/note/",
      },
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: err.message,
    });
  }
};
