const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "supersecret_dont_share"

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return next(new HttpError("Authentication failed!", 401));
      }
      const decodedToken = jwt.verify(token, JWT_SECRET);
      req.userData = { userId: decodedToken.userId };
      next();
    } catch (err) {
      return next(new HttpError("Authentication failed!", 401));
    }
};