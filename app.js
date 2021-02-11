require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = 8081;
const swaggerPort = 8080;
const url = "mongodb://127.0.0.1:27017/memes";

// swagger definition and options
const swaggerOptions = require("./swaggerConfig").swaggerOptions;
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/swagger-ui/", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(swaggerPort, () => {
  console.log("Swagger up and running on" + swaggerPort);
});

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
