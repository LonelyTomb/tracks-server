require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { SECRET } = process.env;

const router = express.Router();
const User = mongoose.model("User");
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, SECRET);

    res.send({ token });
  } catch (err) {
    return res.status(422).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Provide email and password" });
  }

  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    return res.status(404).send({ error: "Invalid user details" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, SECRET);
    res.send({ user,token });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ error: "Invalid user details" });
  }
});
module.exports = router;
