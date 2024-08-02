const express = require("express");
const User = require("../Models/User"); // Assuming you have a User model in the specified path
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Prakhar@Verma";

// ROUTE 1 : Create a User using: POST "/api/auth/createuser" No login required
router.post(
  "/createuser",
  [
    body("name", "Name must be at least 3 characters long").isLength({
      min: 3,
    }),
    body("email", "Invalid email address").isEmail(),
    body("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check whether user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new User
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json(authToken);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

// ROUTE : 1 Authenticate a user using: POST "/api/auth/login" No login required

router.post(
  "/login",
  [
    body("email", "Invalid email address").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.status(400).send("Please login with valid credentials");
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        res.status(400).send("Please login with valid credentials");
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json(authToken);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE : 3 Get LoggedIn user details using: POST "/api/auth/getuser" login required

router.post("/getuser",fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    let user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
