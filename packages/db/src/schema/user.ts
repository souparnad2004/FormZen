import { boolean, pgEnum } from "drizzle-orm/pg-core";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "user"]);

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  username: text("username").notNull(),
  email: text("email").unique().notNull(),
  emailVerfied: boolean("email_verified").default(false),
  role: roleEnum("role").default("user"),
  profileImageUrl: text("profile_img_url"),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});
