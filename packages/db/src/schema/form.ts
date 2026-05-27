import { pgTable, uuid, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./user.js";

export const formStatus = pgEnum("form_status", ["active", "inactive"]);

export const visibilityEnum = pgEnum("visibility", ["draft", "unlisted", "public"]);

export const forms = pgTable("forms", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
  title: text("title").notNull(),
  description: text("description"),
  status: formStatus("form_status").notNull(),
  visibility: visibilityEnum("visibility").default("draft"),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type FormSchemaType = typeof forms.$inferSelect;
