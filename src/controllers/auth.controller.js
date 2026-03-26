import { CreateUserDto } from "./dtos/auth.dto.js";
import db from "../db/index.js";
import * as schema from "../db/schemas/user.schema.js";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/helper.js";
import status from "http-status";
import { sendWelcomeEmail } from "../emails/email.handler.js";
import { ENV_VARS } from "../utils/env.js";

export const signup = async (req, res, next) => {
  try {
    const payload = CreateUserDto.safeParse(req.body);
    if (!payload.success)
      return res.status(status.BAD_REQUEST).json({
        error: payload.error.format(),
      });

    const { fullName, email, password } = payload.data;
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    if (user)
      return res
        .status(status.BAD_REQUEST)
        .json({ message: "Email already exists." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db
      .insert(schema.users)
      .values({
        full_name: fullName,
        email,
        password: hashedPassword,
      })
      .returning();
    if (newUser) {
      generateToken(newUser.id, res);
      res.status(status.CREATED).json({
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.full_name,
        profilePic: newUser.profile_pic ?? "",
      });
      if (ENV_VARS.NODE_ENV.includes("dev"))
        await sendWelcomeEmail(
          newUser.email,
          newUser.full_name,
          ENV_VARS.CLIENT_URL,
        );
    }
  } catch (error) {
    throw error;
  }
};

export const login = async (req, res, next) => {
  res.send("login");
};

export const logout = async (req, res, next) => {
  res.send("logout");
};
