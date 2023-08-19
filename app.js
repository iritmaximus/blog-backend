const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const middleware = require("./middleware/middleware");

const blogRouter = require("./controller/blog");
const userRouter = require("./controller/user");
const loginRouter = require("./controller/login");




// connect to the db
try {
  mongoose.set("strictQuery", true);
  mongoose.connect(config.MONGO_URI);
} catch(e) {
  console.log("error connecting to the db");
  process.exit(1);
}

console.log("connected to the db");


app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  const testRouter = require("./controller/test");
  app.use("/api/test", testRouter);
}

module.exports = app;
