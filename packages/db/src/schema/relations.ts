import { users } from "./user.js";
import { forms } from "./form.js";
import { fields } from "./field.js";
import { responses } from "./response.js";
import { answers } from "./answer.js";
import { relations } from "drizzle-orm";

export const userRelation = relations(users, ({many}) => ({
    form: many(forms),
}))

export const formRelation = relations(forms, ({one, many})=> ({
    user: one(users,{
        fields: [forms.userId],
        references: [users.id]
    }),
    response: many(responses),
}))

export const fieldRelation = relations(fields, ({one, many}) => ({
    form: one(forms, {
        fields: [fields.formId],
        references: [forms.id]
    }),
    answer: many(answers)
}))

export const responseRelations = relations(responses, ({ one, many }) => ({
    form: one(forms, {
        fields: [responses.formId],
        references: [forms.id]
    }),
    answer: many(answers)
}))

export const answerRelation = relations(answers,({one}) => ({
    field: one(fields, {
        fields: [answers.fieldId],
        references: [fields.id]
    }),

    response: one(responses, {
        fields: [answers.responseId],
        references: [responses.id]
    })
}))