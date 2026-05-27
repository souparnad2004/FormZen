import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { forms } from "./form.js";


export const fields = pgTable("fields", {
  id: uuid("id").defaultRandom().primaryKey(),

  formId: uuid("form_id")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),

  type: text("type").notNull(), 
  label: text("label").notNull(),

  placeholder: text("placeholder"),

  required: boolean("required").default(false),

  order: integer("order").notNull(),

  config: jsonb("config"),
});


export type FieldDB = typeof fields.$inferSelect;


export type FieldInsertDB = typeof fields.$inferInsert;