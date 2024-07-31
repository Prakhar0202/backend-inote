const express = require("express");
const User = require('../Models/User')
// const { default: mongoose } = require("mongoose");
const router = express.Router();
// const { body, validationResult } = require('express-validator');

//Create a User using: POST "/api/auth"
router.post("/", (req, res) => {
console.log(req.body);
const user = User(req.body);
user.save();
res.send(req.body);
});
module.exports = router;
