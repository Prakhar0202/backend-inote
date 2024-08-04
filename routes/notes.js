const express = require("express");
const Note = require("../Models/Note");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// ROUTE 1 : Add a new Note using: POST "/api/notes/addnote" login required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title must be at least 3 characters long").isLength({
      min: 3,
    }),
    body(
      "description",
      "Description must be at least 6 characters long"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({ title, description, tag, user: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
         res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// ROUTE 2 : Fetch All the notes using: GET "/api/notes/fetchallnotes" login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
       res.status(500).json({ error: "Internal Server Error" });
  }
});

// ROUTE 3 : Update an Existing Note using: PUT "/api/notes/updatenote" login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Create a new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Not Allowed" });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not Allowed" });
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error.message);
       res.status(500).json({ error: "Internal Server Error" });
  }
});

// ROUTE 4 : Delete an Existing Note using: DELETE "/api/notes/deletenote" login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Not Found" });
    }
    // Allow Deletion
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not Allowed" });
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
       res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
