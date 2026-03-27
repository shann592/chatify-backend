import jwt from "jsonwebtoken";
import { ENV_VARS } from "./env.js";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, {
    expiresIn: ENV_VARS.JWT_EXPIRES_IN_DAYS,
  });
  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, //1days in MS,
    httpOnly: true, // prevent XSS attack,
    sameSite: "none", //prevent CRSF attack,
    secure: ENV_VARS.NODE_ENV.includes("prod"),
  });
  return token;
};

export const removePassword = ({ password, ...rest }) => rest;
