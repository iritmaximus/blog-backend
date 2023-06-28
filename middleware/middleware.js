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
    let decodedToken = "";
    try {
      decodedToken = jwt.verify(request.token, process.env.SECRET);
    } catch (e) {
      console.log("Malformatted token:", request.token);
      request.user = null;
    }
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
