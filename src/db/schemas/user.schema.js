import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { messages } from "./message.schema.js";
import { relations } from "drizzle-orm";
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  full_name: text("full_name").notNull(),
  profile_pic: text("profile_pic"),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  message: many(messages),
}));
