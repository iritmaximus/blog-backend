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

  if (blog.likes === undefined) {
      blog.likes = 0;
  }

  if (blog.title === undefined || blog.url === undefined) {
      response.status(400).json({"error": "Title or url not defined"});
      return;
  }

  const result = await blog.save();
  response.status(201).json(result);
});

blogRouter.delete("/:id", async (request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(200).json({"message": "User deleted"});
    return;
  } catch {
    response.status(404).json({"error": "User not found, can't be deleted"});
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
