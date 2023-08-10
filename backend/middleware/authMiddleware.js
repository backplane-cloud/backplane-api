import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  try {
    token = req.cookies.jwt
      ? req.cookies.jwt
      : req.headers.authorization.split(" ")[1]; // CLI - retrieve token from Authorization Header, replaces req.query.token;
  } catch (err) {
    res.status(401);
    throw new Error("Not authenticated, no token");
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authenticated, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authenticated, no token");
  }
});

export { protect };
