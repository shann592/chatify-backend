import jwt from "jsonwebtoken";
import * as schema from "../db/schemas/user.schema.js";
import db from "../db/index.js";
import { ENV_VARS } from "../utils/env.js";
import status from "http-status";
import { removePassword } from "../utils/helper.js";
import { eq } from "drizzle-orm";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(status.UNAUTHORIZED)
        .json({ message: "Unauthorized - No access token provided" });
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    if (!decoded)
      return res
        .status(status.UNAUTHORIZED)
        .json({ message: "Unauthorized - Invalid access token" });
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, decoded.userId),
    });

    if (!user)
      return res
        .status(status.NOT_FOUND)
        .json({ message: `User not found for userId: ${decoded.userId}` });

    req.user = removePassword(user);
    next();
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      ...(ENV_VARS.NODE_ENV.includes("dev") && { error: error }),
    });
  }
};
