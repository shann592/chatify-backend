import { pgTable, uuid, timestamp, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./user.schema.js";
import { relations } from "drizzle-orm";
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  sender_id: uuid("sender_id")
    .notNull()
    .references(() => users.id),
  receiver_id: uuid("receiver_id")
    .notNull()
    .references(() => users.id),
  text: varchar({ length: 2000 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  image: text("image"),
});

export const messageRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.sender_id],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [messages.receiver_id],
    references: [users.id],
  }),
}));
