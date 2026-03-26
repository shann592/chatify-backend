import "dotenv/config";

export const ENV_VARS = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN_DAYS: process.env.JWT_EXPIRES_IN_DAYS,
};
