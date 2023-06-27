const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();

const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  response.status(200).json({"message": "Not implemented"});
});

module.exports = loginRouter;
