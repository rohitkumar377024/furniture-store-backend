const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/response");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    sendResponse(res, 401, "Token is required for authentication", "");
    return;
  }
  try {
    const decoded = jwt.verify(token, "TAG_JWT_SECRET_KEY");
    req.user = decoded;
  } catch (err) {
    sendResponse(res, 401, "Invalid authorization token", "");
    return;
  }
  return next();
};

module.exports = verifyToken;
