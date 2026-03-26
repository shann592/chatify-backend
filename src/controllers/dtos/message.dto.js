import { z } from "zod";

export const IdParamDto = z.object({
  id: z.string(),
});

export const SendMessageDto = z.object({
  text: z.string().optional(),
  image: z
    .string()
    .regex(
      /^(?:data:image\/(?:png|jpg|jpeg|gif);base64,)?[A-Za-z0-9+/]+={0,2}$/,
      "Invalid base64 image string",
    )
    .optional(),
});
