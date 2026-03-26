import aj from "../utils/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import status from "http-status";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(status.TOO_MANY_REQUESTS)
          .json({ message: "Rate limit exceeded. Please try again later" });
      } else if (decision.reason.isBot()) {
        return res
          .status(status.FORBIDDEN)
          .json({ message: "Bot access denied" });
      } else {
        return res
          .status(status.FORBIDDEN)
          .json({ message: "Access denied by security policy" });
      }
    }

    //check for spoof bots
    if (decision.results.some(isSpoofedBot))
      return res
        .status(status.FORBIDDEN)
        .json({ message: "Spoofed bot detected" });
    next();
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      ...(ENV_VARS.NODE_ENV.includes("dev") && { error }),
    });
  }
};
