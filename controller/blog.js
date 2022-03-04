const blogRouter = require("express").Router();
const Blog = require("../models/blog");

// returns all blogs in the datbase as json
blogRouter.get("/", (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs);
    });
});

// just adds new blog to the db
blogRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then(result => {
      response.status(201).json(result);
    });
});

module.exports = blogRouter;
