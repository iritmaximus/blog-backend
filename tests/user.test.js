const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../app");
const User = require("../models/user");

describe("Users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("POST user creation successful", async () => {
    const user = {
      name: "Pööperöinen",
      username: "pöpö123",
      password: "notsecurepassword",
    };

    const result = await request(app)
      .post("/api/users")
      .send(user);

    expect(result.status).toEqual(201);
    expect(result.body.name).toEqual("Pööperöinen");
    expect(result.body.username).toEqual("pöpö123");
  });
  it("GET returns all users", async () => {
    const user = {
      name: "Pöperö",
      username: "pöpö456",
      password: "somethingnotsecure",
    };

    await request(app)
      .post("/api/users")
      .send(user);

    const full_request = await request(app).get("/api/users");
    const result = full_request.body[0];
    expect(result.name).toEqual("Pöperö");
    expect(result.username).toEqual("pöpö456");
    expect(result.username).toEqual("pöpö456");
    expect(result.password).not.toBeDefined();

  });
  it("POST password or hash not in object", async () => {
    const user = {
      name: "Pöperöinen",
      username: "pöpö789",
      password: "something",
    };

    await request(app)
      .post("/api/users")
      .send(user);

    const full_request = await request(app).get("/api/users");
    const result = full_request.body[0];
    expect(result.passwordHash).not.toBeDefined();
    expect(result.password).not.toBeDefined();
  });
  it("POST username unique", async () => {
    const uniqueUser = {
      name: "Pöp",
      username: "pöp123",
      password: "notsecure",
    };
    const duplicateUser = {
      name: "Pöpi",
      username: "pöp123",
      password: "notsecurepassword",
    };

    await request(app)
      .post("/api/users")
      .send(uniqueUser);
    const result = await request(app)
      .post("/api/users")
      .send(duplicateUser);

    expect(result.status).toEqual(400);
    expect(result.body.error).toBeDefined();
  });
  it("POST username under 3 chars", async () => {
    const user = {
      name: "Hihi",
      username: "ai",
      password: "notsecureatall"
    };
    const result = await request(app)
      .post("/api/users")
      .send(user);

    expect(result.status).toEqual(400);
    expect(result.body.error).toBeDefined();
  });
  it("POST password under 3 chars", async () => {
    const user = {
      name: "Hihi",
      username: "hihhih",
      password: "ai"
    };
    const result = await request(app)
      .post("/api/users")
      .send(user);

    expect(result.status).toEqual(400);
    expect(result.body.error).toBeDefined();
  });
  it("POST user not created if creation failed by length", async () => {
    const user = {
      name: "Hihi",
      username: "hihhih",
      password: "ai"
    };
    const requestResult = await request(app)
      .post("/api/users")
      .send(user);
    const result = await request(app)
      .get("/api/users");

    expect(requestResult.status).toEqual(400);
    expect(result.body.length).toEqual(0);
  });
  it("POST user not created if creation failed by duplicate username", async () => {
    const user = {
      name: "Hih",
      username: "hihhih",
      password: "aiai"
    };
    const duplicateUser = {
      name: "Hih",
      username: "hihhih",
      password: "aiai"
    };

    await request(app)
      .post("/api/users")
      .send(user);
    const requestResult = await request(app)
      .post("/api/users")
      .send(duplicateUser);

    const result = await request(app)
      .get("/api/users");

    expect(requestResult.status).toEqual(400);
    expect(result.body.length).toEqual(1);
  });
});
