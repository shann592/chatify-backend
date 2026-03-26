import { defineConfig } from "drizzle-kit";
import { ENV_VARS } from "./src/utils/env.js";
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schemas/**/*.schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: String(ENV_VARS.DATABASE_URL),
  },
});
