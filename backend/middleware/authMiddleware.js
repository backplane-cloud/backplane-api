import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import logger from "../utils/logger.js";
import { loginHTMX } from "../htmx/HTMXify.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  try {
    token = req.cookies.jwt
      ? req.cookies.jwt
      : req.headers.authorization.split(" ")[1]; // CLI - retrieve token from Authorization Header, replaces req.query.token;
  } catch (err) {
    res.status(401);
    // throw new Error("Not authenticated, no token");
    if (req.headers.ui) {
      res.send(loginHTMX("Not authenticated, No Token"));
      // res.send({ isAuthenticated: false });
    }
    // logger.warn(`Not authenticated, No Token`);
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      res.send(loginHTMX("Not authenticated, No Token"));
      // res.status(401).send(`Not authenticated, Invalid Token`);
      // throw new Error("Not authenticated, invalid token");
      logger.warn(new Error("Not authenticated, invalid token"));
    }
  } else {
    if (req.headers.ui) {
      // res.send({ isAuthenticated: false });
      // res.send(loginHTMX("Not authenticated, No Token"));
    }

    // throw new Error("Not authenticated, no token");
    // logger.warn(`Not authenticated, No Token`);
  }
});

export { protect };
