import { pgTable, uuid, jsonb } from "drizzle-orm/pg-core"
import { responses } from "./response.js"
import { fields } from "./field.js"

export const answers = pgTable("answers", {
  id: uuid("id").defaultRandom().primaryKey(),

  responseId: uuid("response_id").notNull().references(() => responses.id),
  fieldId: uuid("field_id").notNull().references(() => fields.id),

  value: jsonb("value"),
})