import { Resend } from "resend";
import { ENV_VARS } from "./env.js";

export const resendClient = new Resend(ENV_VARS.RESEND_API_KEY);

export const sender = {
  email: ENV_VARS.EMAIL_FROM,
  name: ENV_VARS.EMAIL_FROM_NAME,
};
