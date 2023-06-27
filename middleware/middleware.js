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

module.exports = tokenExtractor;
