const express = require("express");
const Note = require("../Models/Note");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// ROUTE : 1 Add a new Note using: POST "/api/auth/addnotes" login required

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
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE : 2 Fetch All the notes using: GET "/api/auth/fetchallnotes" login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
