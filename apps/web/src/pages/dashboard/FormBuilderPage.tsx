import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { getFriendlyErrorMessage } from "@/lib/error-message";
import { trpc } from "@/lib/trpc";
import type { RouterOutputs } from "@repo/trpc";
import type {FieldInput, FormvisibilityEnumType } from "@repo/types";
import {
  AlignLeft,
  ArrowLeft,
  CheckCircle2,
  CircleDot,
  Edit,
  Eye,
  FileText,
  Hash,
  ListChecks,
  Mail,
  Plus,
  Save,
  Settings2,
  TextCursorInput,
  Trash2,
} from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

type FieldType = FieldInput["type"];

const fieldTypeLabels: Record<FieldType, string> = {
  text: "Text",
  number: "Number",
  email: "Email",
  textarea: "Textarea",
  select: "Select",
  radio: "Radio",
};

const fieldTypeHints: Record<FieldType, string> = {
  text: "Short written answer",
  number: "Numeric response",
  email: "Email address",
  textarea: "Long-form response",
  select: "Single choice menu",
  radio: "Visible single choice",
};

const fieldTypeIcons = {
  text: TextCursorInput,
  number: Hash,
  email: Mail,
  textarea: AlignLeft,
  select: ListChecks,
  radio: CircleDot,
} satisfies Record<FieldType, typeof TextCursorInput>;

const visibilityCopy: Record<
  FormvisibilityEnumType,
  { label: string; tone: string; description: string }
> = {
  draft: {
    label: "Draft",
    tone: "bg-muted text-muted-foreground",
    description: "Only your workspace can edit this form.",
  },
  unlisted: {
    label: "Unlisted",
    tone: "bg-secondary text-secondary-foreground",
    description: "Anyone with the link can respond.",
  },
  public: {
    label: "Public",
    tone: "bg-primary text-primary-foreground",
    description: "Published and ready to share.",
  },
};

function getFieldOptions(field: { config: unknown }) {
  if (
    typeof field.config === "object" &&
    field.config &&
    "options" in field.config &&
    Array.isArray(field.config.options)
  ) {
    return field.config.options.filter(
      (option): option is string => typeof option === "string",
    );
  }

  return [];
}

function getPreviewInputType(type: string) {
  if (type === "number" || type === "email") return type;
  return "text";
}



export default function FormBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const utils = trpc.useUtils();
  const formId = id ?? "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<FormvisibilityEnumType>("draft");
  const [fieldType, setFieldType] = useState<FieldType>("text");
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldPlaceholder, setFieldPlaceholder] = useState("");
  const [fieldOptions, setFieldOptions] = useState("Option 1\nOption 2");
  const [fieldRequired, setFieldRequired] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [localFields, setLocalFields] = useState<Field[]>([]);


  type Field = RouterOutputs["field"]["getByFormId"][number];
  const formQuery = trpc.form.byId.useQuery(
    { formId },
    {
      enabled: Boolean(formId),
    },
  );

  const fieldsQuery = trpc.field.getByFormId.useQuery(
    { formId },
    {
      enabled: Boolean(formId),
    },
  );

  const updateForm = trpc.form.update.useMutation({
    onSuccess: async (form) => {
      await Promise.all([
        utils.form.byId.invalidate({ formId }),
        utils.form.myForms.invalidate(),
      ]);
      toast.success(`Saved "${form.title}"`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createField = trpc.field.createMany.useMutation({
    onSuccess: async () => {
      await utils.field.getByFormId.invalidate({ formId });
      setFieldLabel("");
      setFieldPlaceholder("");
      setFieldOptions("Option 1\nOption 2");
      setFieldRequired(false);
      toast.success("Field added");
    },
    onError: (error) => {
      toast.error(getFriendlyErrorMessage(error, "Unable to add the field."));
    },
  });

  const deleteField = trpc.field.delete.useMutation({
    onSuccess: async () => {
      await utils.field.getByFormId.invalidate({ formId });
      toast.success("Field deleted");
    },
    onError: (error) => {
      toast.error(
        getFriendlyErrorMessage(error, "Unable to delete the field."),
      );
    },
  });

  const updateField = trpc.field.update.useMutation({
    onMutate: async (input) => {
      await utils.field.getByFormId.cancel({ formId });

      const prev = localFields;

      setLocalFields((old) =>
        old.map((f) => (f.id === input.fieldId ? { ...f, ...input } : f)),
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) setLocalFields(ctx.prev);
      toast.error("Update failed");
    },

    onSuccess: async () => {
      await utils.field.getByFormId.invalidate({ formId });
    },
  });

  const reorderFields = trpc.field.reorder.useMutation({
    onMutate: async (input) => {
      await utils.field.getByFormId.cancel({ formId });

      const prev = localFields;

      const map = new Map(
        input.orderedFieldIds.map((id, index) => [id, index]),
      );

      setLocalFields((old) =>
        [...old].sort((a, b) => (map.get(a.id) ?? 0) - (map.get(b.id) ?? 0)),
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) setLocalFields(ctx.prev);
      toast.error("Reorder failed");
    },

    onSuccess: async () => {
      await utils.field.getByFormId.invalidate({ formId });
    },
  });

  useEffect(() => {
    if (fieldsQuery.data) {
      //eslint-disable-next-line
      setLocalFields([...fieldsQuery.data].sort((a, b) => a.order - b.order));
    }
  }, [fieldsQuery.data]);

  useEffect(() => {
    if (!formQuery.data) return;
    //eslint-disable-next-line
    setTitle(formQuery.data.title);
    setDescription(formQuery.data.description ?? "");
    setVisibility(formQuery.data.visibility ?? "draft");
  }, [formQuery.data]);

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateForm.mutate({
      formId,
      title: title.trim(),
      description: description.trim(),
      visibility,
    });
  };

  const handleAddField = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const label = fieldLabel.trim();

    if (!label) {
      toast.error("Field label is required.");
      return;
    }

    const options = fieldOptions
      .split("\n")
      .map((option) => option.trim())
      .filter(Boolean);

    if (
      (fieldType === "select" || fieldType === "radio") &&
      options.length === 0
    ) {
      toast.error("Add at least one option for this field.");
      return;
    }

    const field =
      fieldType === "select" || fieldType === "radio"
        ? {
            type: fieldType,
            label,
            required: fieldRequired,
            options,
          }
        : {
            type: fieldType,
            label,
            required: fieldRequired,
            placeholder: fieldPlaceholder.trim() || undefined,
          };

    createField.mutate({
      formId,
      fields: [field],
    });
  };

  const fields = fieldsQuery.data ?? [];
  const selectedFieldIcon = fieldTypeIcons[fieldType];
  const selectedVisibility = visibilityCopy[visibility] ?? visibilityCopy.draft;

  if (!formId) {
    return <div className="p-6 text-sm text-red-500">Missing form id.</div>;
  }

  if (formQuery.isLoading || fieldsQuery.isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          Loading form builder...
        </div>
      </div>
    );
  }

  if (formQuery.isError) {
    return (
      <div className="p-6 text-sm text-red-500">{formQuery.error.message}</div>
    );
  }

  if (fieldsQuery.isError) {
    return (
      <div className="p-6 text-sm text-red-500">
        {fieldsQuery.error.message}
      </div>
    );
  }

  const moveField = (index: number, direction: "up" | "down") => {
    const copy = [...localFields];

    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= copy.length) return;

    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];

    setLocalFields(copy);

    reorderFields.mutate({
      formId,
      orderedFieldIds: copy.map((f) => f.id),
    });
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 border-b bg-background/90 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/75sm:px-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/dashboard/forms")}
              aria-label="Back to forms"
              className="mt-1"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                  {title || "Untitled form"}
                </h1>
                <Badge className={selectedVisibility.tone}>
                  {selectedVisibility.label}
                </Badge>
              </div>
              <p className="max-w-2xl text-sm text-muted-foreground">
                Build questions, adjust publishing, and preview what respondents
                will see.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <Select
              value={visibility}
              onValueChange={(value) =>
                setVisibility(value as FormvisibilityEnumType)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
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
              {updateForm.isPending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </div>
      </div>

      <main className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b bg-muted/35 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="size-4 text-primary" />
                  <h2 className="font-semibold">Form Details</h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set the title, description, and publishing state for this
                  form.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid gap-4 p-5 lg:grid-cols-2"
              >
                <div className="space-y-2 max-w-full lg:col-span-2">
                  <Label htmlFor="form-title">Title</Label>
                  <Input
                    id="form-title"
                    placeholder="Customer feedback survey"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    minLength={3}
                    required
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="form-description">Description</Label>
                  <Textarea
                    id="form-description"
                    placeholder="Tell respondents what this form is for."
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className="min-h-24"
                  />
                </div>
                <div className="lg:col-span-2">
                  <Button type="submit" disabled={updateForm.isPending}>
                    <Save className="size-4" />
                    {updateForm.isPending ? "Saving..." : "Save form details"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b bg-muted/35 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Plus className="size-4 text-primary" />
                  <h2 className="font-semibold">Add Field</h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose the response type, then add the prompt and details.
                </p>
              </div>

              <form onSubmit={handleAddField} className="space-y-5 p-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(fieldTypeLabels).map(([value, label]) => {
                    const typedValue = value as FieldType;
                    const Icon = fieldTypeIcons[typedValue];
                    const isSelected = fieldType === typedValue;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFieldType(typedValue)}
                        className={`rounded-lg border p-3 text-left transition hover:border-primary/60 hover:bg-muted/50 ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "bg-card"
                        }`}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <Icon className="size-4 text-primary" />
                          {label}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {fieldTypeHints[typedValue]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div className="space-y-2">
                    <Label htmlFor="field-label">Question</Label>
                    <Input
                      id="field-label"
                      placeholder="What should the respondent answer?"
                      value={fieldLabel}
                      onChange={(event) => setFieldLabel(event.target.value)}
                      required
                    />
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {(() => {
                        const Icon = selectedFieldIcon;
                        return <Icon className="size-4 text-primary" />;
                      })()}
                      {fieldTypeLabels[fieldType]}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {fieldTypeHints[fieldType]}
                    </p>
                  </div>
                </div>

                {fieldType === "select" || fieldType === "radio" ? (
                  <div className="space-y-2">
                    <Label htmlFor="field-options">Options</Label>
                    <Textarea
                      id="field-options"
                      value={fieldOptions}
                      onChange={(event) => setFieldOptions(event.target.value)}
                      placeholder="One option per line"
                      className="min-h-28"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="field-placeholder">Placeholder</Label>
                    <Input
                      id="field-placeholder"
                      placeholder="Optional helper text inside the answer field"
                      value={fieldPlaceholder}
                      onChange={(event) =>
                        setFieldPlaceholder(event.target.value)
                      }
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <label
                    htmlFor="field-required"
                    className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 text-sm"
                  >
                    <Checkbox
                      id="field-required"
                      checked={fieldRequired}
                      onCheckedChange={(checked) =>
                        setFieldRequired(checked === true)
                      }
                    />
                    Required field
                  </label>

                  <Button type="submit" disabled={createField.isPending}>
                    <Plus className="size-4" />
                    {createField.isPending ? "Adding..." : "Add field"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col gap-2 border-b bg-muted/35 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <h2 className="font-semibold">Fields</h2>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review the questions currently included in this form.
                  </p>
                </div>
                <Badge variant="secondary">
                  {fields.length} {fields.length === 1 ? "field" : "fields"}
                </Badge>
              </div>

              {fields.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-muted">
                    <ListChecks className="size-5 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 font-semibold">No fields yet</h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                    Add your first question above and it will appear here with a
                    live preview.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {fields.map((field, index) => {
                    const Icon =
                      fieldTypeIcons[field.type as FieldType] ??
                      TextCursorInput;

                    return (
                      <div
                        key={field.id}
                        className="flex items-start justify-between gap-4 p-4"
                      >
                        <div className="flex min-w-0 gap-3 w-full">
                          {/* icon */}
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="size-4" />
                          </div>

                          <div className="min-w-0 w-full space-y-2">
                            {/* LABEL (edit mode switch) */}
                            {editingFieldId === field.id ? (
                              <Input
                                value={editingLabel}
                                onChange={(e) =>
                                  setEditingLabel(e.target.value)
                                }
                                className="w-full"
                              />
                            ) : (
                              <p className="font-medium leading-tight">
                                <span className="text-muted-foreground">
                                  {index + 1}.
                                </span>{" "}
                                {field.label}
                                {field.required && (
                                  <span className="text-destructive"> *</span>
                                )}
                              </p>
                            )}

                            {/* badges */}
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline">
                                {fieldTypeLabels[field.type as FieldType] ??
                                  field.type}
                              </Badge>
                              {field.required && (
                                <Badge variant="secondary">Required</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2">
                          {/* ORDER BUTTONS */}
                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            disabled={index === 0}
                            onClick={() => {
                              moveField(index, "up")
                            }}
                          >
                            <ArrowLeft className="size-4 rotate-90" />
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            disabled={index === fields.length - 1}
                            onClick={() => {
                              moveField(index, "down")
                            }}
                          >
                            <ArrowLeft className="size-4 -rotate-90" />
                          </Button>

                          {editingFieldId === field.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateField.mutate({
                                    fieldId: field.id,
                                    label: editingLabel,
                                  })
                                }
                              >
                                Save
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingFieldId(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingFieldId(field.id);
                                  setEditingLabel(field.label);
                                }}
                              >
                                <Edit className="size-4" />
                                Edit
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                disabled={deleteField.isPending}
                                onClick={() =>
                                  deleteField.mutate({ fieldId: field.id })
                                }
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="border-b bg-muted/35 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Eye className="size-4 text-primary" />
                  <h2 className="font-semibold">Live Preview</h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  This mirrors the form your respondents will complete.
                </p>
              </div>

              <div className="max-h-[calc(100vh-9rem)] overflow-auto p-5">
                <div className="rounded-lg border bg-background p-5 shadow-sm">
                  <div className="space-y-2 border-b pb-5">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
                      <CheckCircle2 className="size-3.5" />
                      Preview mode
                    </div>
                    <h3 className="text-xl font-semibold leading-tight">
                      {title || "Untitled form"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {description ||
                        "Add a description to help respondents understand what you need."}
                    </p>
                  </div>

                  {fields.length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                      Add fields to preview the public form.
                    </div>
                  ) : (
                    <div className="space-y-5 pt-5">
                      {fields.map((field) => {
                        const options = getFieldOptions(
                          field as { config: unknown },
                        );

                        return (
                          <div key={field.id} className="space-y-2">
                            <Label>
                              {field.label}
                              {field.required && (
                                <span className="text-destructive"> *</span>
                              )}
                            </Label>
                            {field.type === "textarea" ? (
                              <Textarea
                                placeholder={field.placeholder ?? ""}
                                className="min-h-24"
                              />
                            ) : field.type === "select" ? (
                              <Select>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                  {options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : field.type === "radio" ? (
                              <div className="space-y-2 rounded-lg border p-3">
                                {options.map((option) => (
                                  <label
                                    key={option}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <input
                                      type="radio"
                                      name={field.id}
                                      value={option}
                                    />
                                    {option}
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <Input
                                type={getPreviewInputType(field.type)}
                                placeholder={field.placeholder ?? ""}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
