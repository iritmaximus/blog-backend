const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const blogRouter = require("./controller/blog");




// connect to the db
try {
  mongoose.connect(config.MONGO_URI);
} catch(e) {
  console.log("error connecting to the db");
  process.exit(1);
}

console.log("connected to the db");


app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);


module.exports = app;
