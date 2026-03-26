import { CreateUserDto, LoginDto, UpdateProfileDto } from "./dtos/auth.dto.js";
import db from "../db/index.js";
import * as schema from "../db/schemas/user.schema.js";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateToken, removePassword } from "../utils/helper.js";
import status from "http-status";
import { sendWelcomeEmail } from "../emails/email.handler.js";
import { ENV_VARS } from "../utils/env.js";
import cloudinary from "../utils/cloudinary.js";

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
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      ...(ENV_VARS.NODE_ENV.includes("dev") && { error: error }),
    });
  }
};

export const login = async (req, res, next) => {
  const payload = LoginDto.safeParse(req.body);
  if (!payload.success)
    return res.status(status.BAD_REQUEST).json({
      error: payload.error.format(),
    });
  const { email, password } = payload.data;
  try {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
    if (!user)
      return res.status(status.NOT_FOUND).json({
        message: `User with email ${email} not found!`,
      });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(status.UNAUTHORIZED).json({
        message: "Invalid credentials",
      });
    generateToken(user.id, res);
    res.status(status.OK).json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      profilePic: user.profile_pic ?? "",
    });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      ...(ENV_VARS.NODE_ENV.includes("dev") && { error: error }),
    });
  }
};

export const logout = async (_, res, next) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(status.OK).json({ message: "Logged out successfully" });
};
export const updateProfile = async (req, res, next) => {
  const payload = UpdateProfileDto.safeParse(req.body);
  if (!payload.success)
    return res.status(status.BAD_REQUEST).json({
      error: payload.error.format(),
    });
  const userId = req.user.id;
  const { profilePic, fullName } = payload.data;
  let uploadResponse;
  try {
    if (profilePic)
      uploadResponse = await cloudinary.uploader.upload(profilePic);
    const user = await db
      .update(schema.users)
      .set({
        ...(profilePic && { profile_pic: uploadResponse.secure_url }),
        ...(fullName && { full_name: fullName }),
      })
      .where(eq(schema.users.id, userId))
      .returning();
    res.status(status.OK).json(removePassword(user));
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      ...(ENV_VARS.NODE_ENV.includes("dev") && { error: error }),
    });
  }
};

export const checkUser = async (req, res, next) => {
  res.status(status.OK).json(req.user);
};
