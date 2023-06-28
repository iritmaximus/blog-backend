const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");


const USER_POPULATE = {"name": 1, "username": 1};

// returns all blogs in the datbase as json
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate("user", USER_POPULATE);
  response.json(blogs);
});

// just adds new blog to the db
blogRouter.post("/", async (request, response) => {
  const user = request.user;

  if (!user) {
    response.status(401).json({"error": "Authentication failed"});
    return;
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes === undefined ? 0 : request.body.likes,
    user: user.id
  })

  if (blog.title === undefined || blog.url === undefined) {
      response.status(400).json({"error": "Title or url not defined"});
      return;
  }

  await blog.save();
  const result = await blog.populate("user", USER_POPULATE);
  const blogId = result.id;

  user.blogs = user.blogs.concat(blogId);
  user.save();

  response.status(201).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  let id = "";
  try {
    id = mongoose.Types.ObjectId(request.params.id);
  } catch (e) {
    response.status(404).json({"error": "Malformatted id"});
    return;
  }

  const blog = await Blog.findOne({"_id": id});
  const user = request.user;

  if (!blog) {
    response.status(404).json({"error": "No blog with id"});
    return;
  }

  if (!(user._id.toString() === blog.user.toString())) {
    response.status(401).json({"error": "Not authorized"});
    return;
  }

  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(200).json({"message": "Blog deleted"});
    return;
  } catch {
    response.status(404).json({"error": "Blog not found, can't be deleted"});
    return;
  }
});

blogRouter.put("/:id", async (request, response) => {
  const blog = {
    likes: request.body.likes,
  }

  try {
    const newBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true});
    response.status(200).json(newBlog);
  } catch {
      response.status(404).json({"error": "User not found"});
  }
})

module.exports = blogRouter;
