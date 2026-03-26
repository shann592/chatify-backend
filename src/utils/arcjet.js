import arcjet, {
  shield,
  detectBot,
  tokenBucket,
  slidingWindow,
} from "@arcjet/node";

import { ENV_VARS } from "./env.js";

const aj = arcjet({
  key: ENV_VARS.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    slidingWindow({
      mode: "LIVE",
      max: Number(ENV_VARS.REQUEST_LIMIT_PER_MIN),
      interval: 60,
    }),
  ],
});

export default aj;
