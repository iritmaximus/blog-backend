const userRouter = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");

const filter = {
  "author": 1,
  "title": 1,
  "url": 1,
  "likes": 1
};


userRouter.get("/", async (req, res) => {
  const users = await User
    .find({})
    .populate("blogs", filter);
  res.json(users);
});

userRouter.post("/", async (req, res) => {
  const { name, username, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  if (!username || !password || !passwordHash) {
    response.status(400).json({"error": "Username or password not provided"});
    return;
  }

  if (username.length < 3 || password.length < 3) {
    res.status(400).json({"error": "Username or password not long enough, minimum 3 chars"});
    return;
  }

  const user = new User({
    name,
    username,
    passwordHash,
  });


  try {
    const savedUser = await user.save();
    const result = await savedUser.populate("blogs", filter);
    res.status(201).json(savedUser);
  } catch (e) {
    res.status(400).json({"error": e});
  }
});

module.exports = userRouter;
