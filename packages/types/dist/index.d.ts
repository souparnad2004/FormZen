import { z } from 'zod';
export { z } from 'zod';

declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodEmail;
    email_verified: z.ZodBoolean;
}, z.core.$strip>;
declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
declare const authResponseSchema: z.ZodObject<{
    user: z.ZodObject<{
        id: z.ZodString;
        email: z.ZodEmail;
        name: z.ZodString;
        email_verified: z.ZodBoolean;
    }, z.core.$strip>;
    token: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type UserSchemaType = z.infer<typeof userSchema>;
type RegisterSchemaType = z.infer<typeof registerSchema>;
type LoginSchemaType = z.infer<typeof loginSchema>;
type AuthResponseSchemaType = z.infer<typeof authResponseSchema>;

declare const formVisibilityEnum: z.ZodEnum<{
    draft: "draft";
    unlisted: "unlisted";
    public: "public";
}>;
type FormvisibilityEnumType = z.infer<typeof formVisibilityEnum>;
declare const createFormSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const createFormWithFieldsSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        label: z.ZodString;
        required: z.ZodDefault<z.ZodBoolean>;
        type: z.ZodEnum<{
            number: "number";
            email: "email";
            text: "text";
            textarea: "textarea";
        }>;
        placeholder: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        label: z.ZodString;
        required: z.ZodDefault<z.ZodBoolean>;
        type: z.ZodEnum<{
            select: "select";
            radio: "radio";
        }>;
        options: z.ZodArray<z.ZodString>;
    }, z.core.$strip>], "type">>;
    visibility: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        unlisted: "unlisted";
        public: "public";
    }>>;
}, z.core.$strip>;
declare const updateFormSchema: z.ZodObject<{
    formId: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    visibility: z.ZodOptional<z.ZodEnum<{
        draft: "draft";
        unlisted: "unlisted";
        public: "public";
    }>>;
}, z.core.$strip>;
type UpdateFormSchemaType = z.infer<typeof updateFormSchema>;
declare const formIdSchema: z.ZodObject<{
    formId: z.ZodString;
}, z.core.$strip>;
type CreateFormSchemaType = z.infer<typeof createFormSchema>;

declare const fieldTypeEnum: z.ZodEnum<{
    number: "number";
    email: "email";
    text: "text";
    textarea: "textarea";
    select: "select";
    radio: "radio";
}>;
declare const createFieldSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    label: z.ZodString;
    required: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodEnum<{
        number: "number";
        email: "email";
        text: "text";
        textarea: "textarea";
    }>;
    placeholder: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    label: z.ZodString;
    required: z.ZodDefault<z.ZodBoolean>;
    type: z.ZodEnum<{
        select: "select";
        radio: "radio";
    }>;
    options: z.ZodArray<z.ZodString>;
}, z.core.$strip>], "type">;
type FieldInput = z.infer<typeof createFieldSchema>;
declare const createManyFieldsSchema: z.ZodObject<{
    formId: z.ZodUUID;
    fields: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        label: z.ZodString;
        required: z.ZodDefault<z.ZodBoolean>;
        type: z.ZodEnum<{
            number: "number";
            email: "email";
            text: "text";
            textarea: "textarea";
        }>;
        placeholder: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        label: z.ZodString;
        required: z.ZodDefault<z.ZodBoolean>;
        type: z.ZodEnum<{
            select: "select";
            radio: "radio";
        }>;
        options: z.ZodArray<z.ZodString>;
    }, z.core.$strip>], "type">>;
}, z.core.$strip>;
declare const updateFieldSchema: z.ZodObject<{
    fieldId: z.ZodUUID;
    label: z.ZodOptional<z.ZodString>;
    required: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodEnum<{
        number: "number";
        email: "email";
        text: "text";
        textarea: "textarea";
        select: "select";
        radio: "radio";
    }>>;
    placeholder: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
declare const reorderFieldsSchema: z.ZodObject<{
    formId: z.ZodUUID;
    orderedFieldIds: z.ZodArray<z.ZodUUID>;
}, z.core.$strip>;
declare const getFieldsSchema: z.ZodObject<{
    formId: z.ZodUUID;
}, z.core.$strip>;
declare const deleteFieldSchema: z.ZodObject<{
    fieldId: z.ZodUUID;
}, z.core.$strip>;
type FieldConfig = {
    options: string[];
} | null;
type CreateFieldInput = z.infer<typeof createFieldSchema>;
type UpdateFieldInput = z.infer<typeof updateFieldSchema>;

declare const answerSchema: z.ZodObject<{
    fieldId: z.ZodString;
    value: z.ZodString;
}, z.core.$strip>;
type AnswerInput = z.infer<typeof answerSchema>;

declare const submitFormSchema: z.ZodObject<{
    formId: z.ZodString;
    slug: z.ZodString;
    answers: z.ZodArray<z.ZodObject<{
        fieldId: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
type SubmitFormInput = z.infer<typeof submitFormSchema>;

export { type AnswerInput, type AuthResponseSchemaType, type CreateFieldInput, type CreateFormSchemaType, type FieldConfig, type FieldInput, type FormvisibilityEnumType, type LoginSchemaType, type RegisterSchemaType, type SubmitFormInput, type UpdateFieldInput, type UpdateFormSchemaType, type UserSchemaType, answerSchema, authResponseSchema, createFieldSchema, createFormSchema, createFormWithFieldsSchema, createManyFieldsSchema, deleteFieldSchema, fieldTypeEnum, formIdSchema, formVisibilityEnum, getFieldsSchema, loginSchema, registerSchema, reorderFieldsSchema, submitFormSchema, updateFieldSchema, updateFormSchema, userSchema };
