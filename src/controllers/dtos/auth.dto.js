import { z } from "zod";

export const CreateUserDto = z.object({
  fullName: z.string(),
  email: z.email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export const LoginDto = z.object({
  email: z.email(),
  password: z.string(),
});

export const UpdateProfileDto = z.object({
  profilePic: z
    .string()
    .regex(
      /^(?:data:image\/(?:png|jpg|jpeg|gif);base64,)?[A-Za-z0-9+/]+={0,2}$/,
      "Invalid base64 image string",
    )
    .optional(),
  fullName: z.string().optional(),
});
