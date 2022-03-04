const mongoose = require("mongoose");

// how the db data is formatted
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

module.exports = mongoose.model("Blog", blogSchema);
