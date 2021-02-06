require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// const PORT = process.env.PORT || 5000;
const PORT = 5000;
const url = "mongodb://127.0.0.1:27017/memes";

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

require("./models/post");

app.use(express.json());
app.use(require("./api/memes"));

app.listen(PORT, () => {
  console.log("Hello from the backend");
});
