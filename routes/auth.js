const express = require("express");
const User = require('../Models/User'); // Assuming you have a User model in the specified path
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Create a User using: POST "/api/auth"
router.post("/", [
  body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  User.create({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
  }).then(user => res.json(user));
});

module.exports = router;
