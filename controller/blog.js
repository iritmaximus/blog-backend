const blogRouter = require("express").Router();
const Blog = require("../models/blog");

// returns all blogs in the datbase as json
blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

// just adds new blog to the db
blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogRouter;
