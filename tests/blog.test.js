const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

describe("Blogs", () => {
  // one blog
  let blog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "initial.org",
    likes: 12
  };

  const user = {
    name: "Pööpi",
    username: "pöperö123",
    password: "notsecure",
  }

  beforeEach(async () => {
    await User.deleteMany({});
    const userObject = new User(user);
    await userObject.save();

    await Blog.deleteMany({});
    blog.user = await User.findOne({});
    const blogObject = new Blog(blog);
    await blogObject.save();
  });

  it("GET has one blog", async () => {
    const result = await request(app).get("/api/blogs");
    expect(result.body).toHaveLength(1);
  });

  it("GET unique identifier is id", async () => {
    const result = await request(app).get("/api/blogs");
    expect(result.body[0].id).toBeDefined();
  });

  it("GET display user in blogs", async () => {
    const result = await request(app).get("/api/blogs");
    expect(result.body[0].user).toBeDefined();
  });

  it("POST works", async () => {
    const newItem = {
      title: "Test test",
      author: "me",
      url: "https://me.org",
      likes: 5
    };

    await request(app)
      .post("/api/blogs")
      .send(newItem);

    const result = await request(app).get("/api/blogs");
    expect(result.body).toHaveLength(2);
  });

  it("POST no likes defaults to 0", async () => {
      const noLikesItem = {
          title: "New test",
          author: "Someone",
          url: "hih.xyz"
      }

      await request(app)
        .post("/api/blogs")
        .send(noLikesItem);

      const result = await request(app).get("/api/blogs");
      expect(result.body[1].likes).toEqual(0);
  });

  it("POST if url and title is missing => error", async () => {
      const noUrlItem = {
          title: "Music",
          author: "Someone I used to know",
          likes: 40
      }
      const noTitleItem = {
          author: "Someone I used to know",
          url: "pöps.dev",
          likes: 40
      }

      const resultNoUrl = await request(app)
        .post("/api/blogs")
        .send(noUrlItem);

      const resultNoTitle = await request(app)
        .post("/api/blogs")
        .send(noTitleItem);

      expect(resultNoUrl.status).toEqual(400);
      expect(resultNoTitle.status).toEqual(400);
  });

  it("DELETE deletes item", async () => {
      const items = await Blog.find({});
      const result = await request(app).delete(`/api/blogs/${items[0].id}`)
      expect(result.status).toEqual(200);
  });

  it("DELETE sends 404 if no item", async () => {
      const result = await request(app).delete("/api/blogs/1"); // id is mongoose id obj, not int
      expect(result.status).toEqual(404);
  });

  it("PUT updates items likes", async () => {
      const blog = {
          likes: 230
      }
      const items = await Blog.find({});
      await request(app)
        .put(`/api/blogs/${items[0].id}`)
        .send(blog);

      const result = await request(app).get("/api/blogs");
      expect(result.body[0].likes).toEqual(230);
  });

  it("PUT sends 404 if not found", async () => {
      const blog = {
          likes: 2358
      } 

      const result = await request(app)
        .put("/api/blogs/1")
        .send(blog);
      expect(result.status).toEqual(404);
  });
});
