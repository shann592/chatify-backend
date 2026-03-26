import { resendClient, sender } from "../utils/resend.js";
import { createWelcomeEmailTemplate } from "./email.template.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "<h1?>Welcome to Chatify!</h1?",
    html: createWelcomeEmailTemplate(name, clientURL),
  });
  if (error) {
    throw new Error("Error while sending!");
  }
  console.log("Email sent successfully");
};
