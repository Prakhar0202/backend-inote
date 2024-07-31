const express = require("express");
const Notes = require('../Models/Notes')
const { default: mongoose } = require("mongoose");
const router = express.Router();
const { body, validationResult } = require('express-validator');


router.post("/", [
  body('title').isLength({ min:5 }).withMessage('title must be at least 5 characters long'),
  body('description').isLength({max:200}).withMessage('gh'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  Notes.create({
    title: req.body.title,
    description: req.body.description,
    
  }).then(notes => res.json(notes));
});
module.exports = router;
