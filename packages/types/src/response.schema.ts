import { z } from "zod";
import { answerSchema } from "./answer.schema.js";

export const submitFormSchema = z.object({
  formId: z.string(),
  slug: z.string(), 
  answers: z.array(answerSchema).min(1),
});

export type SubmitFormInput = z.infer<typeof submitFormSchema>;