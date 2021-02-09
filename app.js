require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// const { PORT } = require("./config");
const PORT = 5000;
const url = "mongodb://127.0.0.1:27017/memes";

// swagger definition and options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "XMeme API",
      description:
        "This is a simple CRUD API for XMeme made with Express and documented with Swagger",
      contact: {
        name: "Samrendra Kumar Singh",
        email: "samrendrakumarsingh01@gmail.com",
      },
      servers: ["http://localhost:5000"],
    },
  },
  apis: ["routes/memes.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", url);
});

db.on("error", (err) => {
  console.error("connection error:", err);
});

require("./models/post");

app.use(express.json());
app.use(cors());
app.use(require("./routes/memes"));

app.listen(PORT, () => {
  console.log("Hello from the backend");
});
