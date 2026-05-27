import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFriendlyErrorMessage } from "@/lib/error-message";
import { trpc } from "@/lib/trpc";
import type {
  FieldInput,
  FormvisibilityEnumType,
  UpdateFieldInput,
} from "@repo/types";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

type FieldType = FieldInput["type"];
type DbField = {
  id: string;
  formId: string;
  type: string;
  label: string;
  placeholder: string | null;
  required: boolean | null;
  order: number;
  config: unknown;
};

const fieldTypes: FieldType[] = [
  "text",
  "number",
  "email",
  "textarea",
  "select",
  "radio",
];

function getOptions(field: DbField) {
  const config = field.config as { options?: unknown } | null;
  return Array.isArray(config?.options)
    ? config.options.filter((option): option is string => typeof option === "string")
    : [];
}

function fieldToUpdateInput(field: DbField): Omit<UpdateFieldInput, "fieldId"> {
  const type = field.type as FieldType;
  const base = {
    label: field.label,
    required: Boolean(field.required),
    type,
  };

  if (type === "select" || type === "radio") {
    return {
      ...base,
      options: getOptions(field),
    };
  }

  return {
    ...base,
    placeholder: field.placeholder ?? "",
  };
}

function buildFieldInput(input: Omit<UpdateFieldInput, "fieldId">): FieldInput {
  const type = input.type ?? "text";
  const label = input.label?.trim() ?? "";
  const required = Boolean(input.required);

  if (type === "select" || type === "radio") {
    const options = (input.options ?? [])
      .map((option) => option.trim())
      .filter(Boolean);

    return { type, label, required, options };
  }

  return {
    type,
    label,
    required,
    placeholder: input.placeholder?.trim() || undefined,
  };
}

function FieldPreview({ field }: { field: DbField }) {
  const options = getOptions(field);
  const label = `${field.label}${field.required ? " *" : ""}`;

  if (field.type === "textarea") {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <textarea
          className="min-h-24 w-full rounded-md border bg-background p-2 text-sm"
          placeholder={field.placeholder ?? undefined}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={field.placeholder ?? "Choose an option"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="space-y-2">
          {options.map((option) => (
            <Label key={option} className="font-normal">
              <input name={field.id} type="radio" />
              {option}
            </Label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type={field.type === "number" ? "number" : field.type === "email" ? "email" : "text"}
        placeholder={field.placeholder ?? undefined}
      />
    </div>
  );
}

export default function FormBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const utils = trpc.useUtils();
  const formId = id ?? "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<FormvisibilityEnumType>("draft");
  const [newField, setNewField] = useState<Omit<UpdateFieldInput, "fieldId">>({
    label: "",
    type: "text",
    required: false,
    placeholder: "",
    options: ["Option 1"],
  });
  const [draftFields, setDraftFields] = useState<Record<string, Omit<UpdateFieldInput, "fieldId">>>({});

  const formQuery = trpc.form.byId.useQuery({ formId }, { enabled: Boolean(formId) });
  const fieldsQuery = trpc.field.getByFormId.useQuery(
    { formId },
    { enabled: Boolean(formId) },
  );
  const fields = useMemo(
    () => ((fieldsQuery.data ?? []) as DbField[]).slice().sort((a, b) => a.order - b.order),
    [fieldsQuery.data],
  );

  const invalidateFields = async () => {
    await utils.field.getByFormId.invalidate({ formId });
  };

  const updateForm = trpc.form.update.useMutation({
    onSuccess: async (form) => {
      await Promise.all([
        utils.form.byId.invalidate({ formId }),
        utils.form.myForms.invalidate(),
      ]);
      toast.success(`Saved "${form.title}"`);
    },
    onError: (error) =>
      toast.error(getFriendlyErrorMessage(error, "Unable to save the form. Please try again.")),
  });

  const createField = trpc.field.createMany.useMutation({
    onSuccess: async () => {
      await invalidateFields();
      setNewField({
        label: "",
        type: "text",
        required: false,
        placeholder: "",
        options: ["Option 1"],
      });
      toast.success("Field added");
    },
    onError: (error) =>
      toast.error(getFriendlyErrorMessage(error, "Unable to add the field. Please try again.")),
  });

  const updateField = trpc.field.update.useMutation({
    onSuccess: async () => {
      await invalidateFields();
      toast.success("Field saved");
    },
    onError: (error) =>
      toast.error(getFriendlyErrorMessage(error, "Unable to save the field. Please try again.")),
  });

  const deleteField = trpc.field.delete.useMutation({
    onSuccess: async () => {
      await invalidateFields();
      toast.success("Field deleted");
    },
    onError: (error) =>
      toast.error(getFriendlyErrorMessage(error, "Unable to delete the field. Please try again.")),
  });

  const reorderFields = trpc.field.reorder.useMutation({
    onSuccess: invalidateFields,
    onError: (error) =>
      toast.error(getFriendlyErrorMessage(error, "Unable to reorder fields. Please try again.")),
  });

  useEffect(() => {
    if (!formQuery.data) return;

    setTitle(formQuery.data.title);
    setDescription(formQuery.data.description ?? "");
    setVisibility(formQuery.data.visibility ?? "draft");
  }, [formQuery.data]);

  useEffect(() => {
    setDraftFields(
      Object.fromEntries(fields.map((field) => [field.id, fieldToUpdateInput(field)])),
    );
  }, [fields]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateForm.mutate({
      formId,
      title: title.trim(),
      description: description.trim(),
      visibility,
    });
  };

  const handleAddField = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createField.mutate({ formId, fields: [buildFieldInput(newField)] });
  };

  const saveField = (fieldId: string) => {
    const draft = draftFields[fieldId];
    if (!draft) return;

    updateField.mutate({
      fieldId,
      ...buildFieldInput(draft),
    });
  };

  const moveField = (fieldId: string, direction: -1 | 1) => {
    const index = fields.findIndex((field) => field.id === fieldId);
    const nextIndex = index + direction;

    if (index < 0 || nextIndex < 0 || nextIndex >= fields.length) return;

    const orderedFieldIds = fields.map((field) => field.id);
    const [removed] = orderedFieldIds.splice(index, 1);
    orderedFieldIds.splice(nextIndex, 0, removed);
    reorderFields.mutate({ formId, orderedFieldIds });
  };

  if (!formId) {
    return <div className="p-6 text-sm text-red-500">Open the builder from a valid form.</div>;
  }

  if (formQuery.isLoading || fieldsQuery.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading form...</div>;
  }

  if (formQuery.isError) {
    return (
      <div className="p-6 text-sm text-red-500">
        {getFriendlyErrorMessage(formQuery.error, "Unable to load this form. Please try again.")}
      </div>
    );
  }

  if (fieldsQuery.isError) {
    return (
      <div className="p-6 text-sm text-red-500">
        {getFriendlyErrorMessage(fieldsQuery.error, "Unable to load fields. Please try again.")}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <Button variant="outline" onClick={() => navigate("/dashboard/forms")}>
        <ArrowLeft className="size-4" />
        Back to forms
      </Button>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <h2 className="font-semibold">Form Settings</h2>
                <Input
                  placeholder="Form title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  minLength={3}
                  required
                />
                <Input
                  placeholder="Description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <Select
                  value={visibility}
                  onValueChange={(value) => setVisibility(value as FormvisibilityEnumType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={updateForm.isPending}>
                  <Save className="size-4" />
                  {updateForm.isPending ? "Saving..." : "Save Form"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleAddField} className="space-y-4">
                <h2 className="font-semibold">Add Field</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Field label"
                    value={newField.label ?? ""}
                    onChange={(event) =>
                      setNewField((field) => ({ ...field, label: event.target.value }))
                    }
                    required
                  />
                  <Select
                    value={newField.type}
                    onValueChange={(value) =>
                      setNewField((field) => ({ ...field, type: value as FieldType }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {newField.type === "select" || newField.type === "radio" ? (
                  <Input
                    placeholder="Options separated by commas"
                    value={(newField.options ?? []).join(", ")}
                    onChange={(event) =>
                      setNewField((field) => ({
                        ...field,
                        options: event.target.value.split(","),
                      }))
                    }
                    required
                  />
                ) : (
                  <Input
                    placeholder="Placeholder"
                    value={newField.placeholder ?? ""}
                    onChange={(event) =>
                      setNewField((field) => ({
                        ...field,
                        placeholder: event.target.value,
                      }))
                    }
                  />
                )}
                <Label className="font-normal">
                  <Checkbox
                    checked={Boolean(newField.required)}
                    onCheckedChange={(checked) =>
                      setNewField((field) => ({ ...field, required: Boolean(checked) }))
                    }
                  />
                  Required
                </Label>
                <Button type="submit" disabled={createField.isPending}>
                  <Plus className="size-4" />
                  {createField.isPending ? "Adding..." : "Add Field"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {fields.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No fields yet.
              </div>
            ) : (
              fields.map((field, index) => {
                const draft = draftFields[field.id] ?? fieldToUpdateInput(field);
                const isOptionField = draft.type === "select" || draft.type === "radio";

                return (
                  <Card key={field.id}>
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">Field {index + 1}</span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={index === 0 || reorderFields.isPending}
                            onClick={() => moveField(field.id, -1)}
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={index === fields.length - 1 || reorderFields.isPending}
                            onClick={() => moveField(field.id, 1)}
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            disabled={deleteField.isPending}
                            onClick={() => deleteField.mutate({ fieldId: field.id })}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <Input
                          placeholder="Field label"
                          value={draft.label ?? ""}
                          onChange={(event) =>
                            setDraftFields((drafts) => ({
                              ...drafts,
                              [field.id]: { ...draft, label: event.target.value },
                            }))
                          }
                          required
                        />
                        <Select
                          value={draft.type}
                          onValueChange={(value) =>
                            setDraftFields((drafts) => ({
                              ...drafts,
                              [field.id]: { ...draft, type: value as FieldType },
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {isOptionField ? (
                        <Input
                          placeholder="Options separated by commas"
                          value={(draft.options ?? []).join(", ")}
                          onChange={(event) =>
                            setDraftFields((drafts) => ({
                              ...drafts,
                              [field.id]: {
                                ...draft,
                                options: event.target.value.split(","),
                              },
                            }))
                          }
                        />
                      ) : (
                        <Input
                          placeholder="Placeholder"
                          value={draft.placeholder ?? ""}
                          onChange={(event) =>
                            setDraftFields((drafts) => ({
                              ...drafts,
                              [field.id]: {
                                ...draft,
                                placeholder: event.target.value,
                              },
                            }))
                          }
                        />
                      )}

                      <div className="flex items-center justify-between gap-3">
                        <Label className="font-normal">
                          <Checkbox
                            checked={Boolean(draft.required)}
                            onCheckedChange={(checked) =>
                              setDraftFields((drafts) => ({
                                ...drafts,
                                [field.id]: { ...draft, required: Boolean(checked) },
                              }))
                            }
                          />
                          Required
                        </Label>
                        <Button
                          type="button"
                          size="sm"
                          disabled={updateField.isPending}
                          onClick={() => saveField(field.id)}
                        >
                          <Save className="size-4" />
                          Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Preview</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{title || "Untitled form"}</h3>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">No fields to preview.</p>
              ) : (
                fields.map((field) => <FieldPreview key={field.id} field={field} />)
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
