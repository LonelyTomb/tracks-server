const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "Unauthorized" });
    }

    const { userId } = payload;
    const user = await User.findById(userId);
    req.user = user;
    next();
  });
};
