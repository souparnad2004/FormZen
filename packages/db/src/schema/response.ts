import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core"
import { forms } from "./form.js"

export const responses = pgTable("responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  formId: uuid("form_id").notNull().references(() => forms.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
})