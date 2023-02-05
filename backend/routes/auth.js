const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
// create and use in /api/auth with POST doesnot require auth

router.post(
  "/",
  body("name", "Enter a valid name").isLength({ min: 3 }),
  body("email", "Enter a valid email").isEmail(),
  body("password", "Enter a valid password").isLength({ min: 5 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => res.json(user))
      .catch((err) =>
        res.json({
          err: "Please enter a unique value",
          message: err.message,
        })
      );
  }
);

module.exports = router;
