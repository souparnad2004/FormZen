import { z } from "zod";

export const answerSchema = z.object({
  fieldId: z.string(),
  value: z.string(),
});

export type AnswerInput = z.infer<typeof answerSchema>;