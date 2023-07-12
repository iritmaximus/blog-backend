const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");


const generateToken = async (user) => {
  const userForToken = {
    username: user.username,
    password: user.password
  }

  const response = await request(app)
    .post("/api/login")
    .send(userForToken);

  const token = response.body.token;
  if (response.status === 200 && token) {
    return token;
  } else {
    throw Error("Token creation failed");
  }
}

const user = {
  name: "Pööpi",
  username: "pöperö123",
  password: "notsecure",
}

let blog = {
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  url: "initial.org",
  likes: 12
};

describe("Blogs", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await request(app)
      .post("/api/users")
      .send(user);

    // blog is always owned by the automatically created user above
    await Blog.deleteMany({});
    blog.user = await User.findOne({});
    await request(app)
      .post("/api/blogs")
      .send(blog)
      .set("Authorization", "Bearer " + await generateToken(user));
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
    const token = await generateToken(user);

    const newItem = {
      title: "Test test",
      author: "me",
      url: "https://me.org",
      likes: 5
    };

    await request(app)
      .post("/api/blogs")
      .send(newItem)
      .set("Authorization", "Bearer " + token)
      .expect(201);

    const result = await request(app).get("/api/blogs");
    expect(result.body).toHaveLength(2);
  });

  it("POST no likes defaults to 0", async () => {
    const token = await generateToken(user);

    const noLikesItem = {
        title: "New test",
        author: "Someone",
        url: "hih.xyz"
    }

    await request(app)
      .post("/api/blogs")
      .send(noLikesItem)
      .set("Authorization", "Bearer " + token);

    const result = await request(app).get("/api/blogs");
    expect(result.body[1].likes).toEqual(0);
  });

  it("POST if url and title is missing => error", async () => {
    const token = await generateToken(user);

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
      .send(noUrlItem)
      .set("Authorization", "Bearer " + token);

    const resultNoTitle = await request(app)
      .post("/api/blogs")
      .send(noTitleItem)
      .set("Authorization", "Bearer " + token);

    expect(resultNoUrl.status).toEqual(400);
    expect(resultNoTitle.status).toEqual(400);
  });

  it("DELETE deletes item", async () => {
    const token = await generateToken(user);
    const items = await Blog.find({});
    const result = await request(app)
      .delete(`/api/blogs/${items[0].id}`)
      .set("Authorization", "Bearer " + token);
    expect(result.status).toEqual(200);
  });

  it("DELETE sends 404 if no item", async () => {
    const token = await generateToken(user);
    const result = await request(app)
      .delete("/api/blogs/1") // id is mongoose id obj, not int so this id is incorrect
      .set("Authorization", "Bearer " + token);
    expect(result.status).toEqual(404);
  });

  it("PUT updates items likes", async () => {
    const token = await generateToken(user);
    const blog = {
        likes: 230
    }
    const items = await Blog.find({});
    await request(app)
      .put(`/api/blogs/${items[0].id}`)
      .send(blog)
      .set("Authorization", "Bearer " + token);

    const result = await request(app).get("/api/blogs");
    expect(result.body[0].likes).toEqual(230);
  });

  it("PUT sends 404 if not found", async () => {
    const token = await generateToken(user);
    const blog = {
        likes: 2358
    } 

    const result = await request(app)
      .put("/api/blogs/1")
      .send(blog)
      .set("Authorization", "Bearer " + token);
    expect(result.status).toEqual(404);
  });
  it("POST fails if no auth header", async () => {
    const blog = {
      title: "Test test test",
      author: "me, duh",
      url: "https://me.dev",
      likes: 6
    };

    const result = await request(app)
      .post("/api/blogs")
      .send(blog);
    const getResponse = await request(app).get("/api/blogs")

    expect(result.status).toEqual(401);
    expect(getResponse.body.length).toEqual(1);
  });
  it("POST fails if incorrect user auth header", async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InDDtnDDtjEyMyIsImlkIjoiNjQ5YmQ3NjFjMmNiMDVjMDJhMTFlYzgzIiwiaWF0IjoxNjg3OTM1MDA2fQ.qoWfO9xdrOPUs8ynF_9SVvuIv7d8xUch_hztBMyKeLU";
    const blog = {
      title: "Test test test",
      author: "me, duh",
      url: "https://me.dev",
      likes: 7
    };

    const result = await request(app)
      .post("/api/blogs")
      .send(blog)
      .set("Authorization", "Bearer " + token);

    const getResponse = await request(app).get("/api/blogs")
    expect(result.status).toEqual(401);
    expect(getResponse.body.length).toEqual(1);
  });
  it("POST fails if malformatted auth header", async () => {
    const token = "aoe;qhjkarc.,gqkjnt";
    const blog = {
      title: "Test test test",
      author: "me, duh",
      url: "https://me.dev",
      likes: 8
    };

    const result = await request(app)
      .post("/api/blogs")
      .send(blog)
      .set("Authorization", "Bearer " + token);

    const getResponse = await request(app).get("/api/blogs")
    expect(result.status).toEqual(401);
    expect(getResponse.body.length).toEqual(1);
  });
});
