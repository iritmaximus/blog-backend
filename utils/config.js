require("dotenv").config();

let PORT = process.env.PORT;

const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI;

module.exports = {
  PORT,
  MONGO_URI,
};
