import { Pool } from "pg";
import { ENV_VARS } from "../utils/env.js";
import { drizzle } from "drizzle-orm/node-postgres";
import * as userSchema from "./schemas/user.schema.js";
const pool = new Pool({
  connectionString: ENV_VARS.DATABASE_URL,
});
const db = drizzle(pool, {
  schema: {
    ...userSchema,
  },
});
export default db;
