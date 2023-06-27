const jwt = require("jsonwebtoken");

const User = require("../models/user");


const getToken = request => {
  const tokenWithBearer = request.get("authorization");
  if (tokenWithBearer && tokenWithBearer.startsWith("Bearer ")) {
    return tokenWithBearer.replace("Bearer ", "");
  }
  return null;
}

const tokenExtractor = (request, response, next) => {
  request.token = getToken(request);
  next();
}

const userExtractor = async (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const user = await User.findOne({"_id": decodedToken.id});
    request.user = user;
  } else {
    request.user = null;
  }
  next();
}

module.exports = {
  tokenExtractor,
  userExtractor
};
