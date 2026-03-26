import * as messageSchema from "../db/schemas/message.schema.js";
import * as userSchema from "../db/schemas/user.schema.js";
import db from "../db/index.js";
import { and, eq, ne, or } from "drizzle-orm";
import status from "http-status";
import { removePassword } from "../utils/helper.js";
import { ENV_VARS } from "../utils/env.js";
import { IdParamDto, SendMessageDto } from "./dtos/message.dto.js";
import cloudinary from "../utils/cloudinary.js";
export const getAllContacts = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await db.query.users.findMany({
      where: ne(userSchema.users.id, loggedInUserId),
    });
    res.status(status.OK).json(filteredUsers.map((fu) => removePassword(fu)));
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      ...(ENV_VARS.NODE_ENV.includes("dev") && { error: error }),
    });
  }
};

export const getMessagesByUserId = async (req, res, next) => {
  try {
    const myId = req.user.id;
    const payload = IdParamDto.safeParse(req.params);
    if (!payload.success)
      return res.status(status.BAD_REQUEST).json({
        error: payload.error.format(),
      });
    const { id: userToChatId } = payload.data;
    const messages = await db.query.messages.findMany({
      where: or(
        and(
          eq(messageSchema.messages.sender_id, myId),
          eq(messageSchema.messages.receiver_id, userToChatId),
        ),
        and(
          eq(messageSchema.messages.sender_id, userToChatId),
          eq(messageSchema.messages.receiver_id, myId),
        ),
      ),
    });
    res.status(status.OK).json(messages);
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      ...(ENV_VARS.NODE_ENV.includes("dev") && { error: error }),
    });
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const body = SendMessageDto.safeParse(req.body);
    const params = IdParamDto.safeParse(req.params);
    if (!body.success || !params.success)
      return res.status(status.BAD_REQUEST).json({
        error: body.error.format(),
      });
    const { id: receiverId } = params.data;
    const { text, image } = body.data;
    const senderId = req.user.id;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const [message] = await db
      .insert(messageSchema.messages)
      .values({
        text: text ?? null,
        image: imageUrl ?? null,
        sender_id: senderId,
        receiver_id: receiverId,
      })
      .returning();
    res.status(status.CREATED).json(message);
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      ...(ENV_VARS.NODE_ENV.includes("dev") && { error: error }),
    });
  }
};

export const getChatPartners = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.id;
    const messages = await db.query.messages.findMany({
      where: or(
        eq(messageSchema.messages.sender_id, loggedInUserId),
        eq(messageSchema.messages.receiver_id, loggedInUserId),
      ),
      with: {
        sender: true,
        receiver: true,
      },
    });
    const partnerMap = {};
    const chatPartners = messages.reduce((result, msg) => {
      const chatPartner =
        msg.sender_id === loggedInUserId
          ? removePassword(msg.receiver)
          : removePassword(msg.sender);
      if (!partnerMap[chatPartner.id]) {
        result.push(chatPartner);
        partnerMap[chatPartner.id] = 1;
      }
      return result;
    }, []);
    res.status(status.OK).json(chatPartners);
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      ...(ENV_VARS.NODE_ENV.includes("dev") && { error: error }),
    });
  }
};
