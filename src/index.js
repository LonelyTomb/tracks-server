require("dotenv").config();
require("./models/Users");
require("./models/Track");
const express = require("express");
const mongoose = require("mongoose");

const requireAuth = require("./middlewares/requireAuth");

const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");

const bodyParser = require("body-parser");
const app = express();

const { MONGO_URI } = process.env;

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

app.get("/", requireAuth, (req, res) => {
  res.send({ user: req.user.email });
});

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongo instance");
});

mongoose.connection.on("error", (err) => {
  console.error("error connecting to mongo instance", err);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});
