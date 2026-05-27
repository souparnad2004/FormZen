import { useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router";
import { trpc } from "@/lib/trpc";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import type { RouterOutputs } from "@repo/trpc";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/lib/error-message";

type PublicForm = RouterOutputs["form"]["getPublicForm"];
type Field = NonNullable<PublicForm>["fields"][number];

type FormValues = Record<string, string>;

function getOptions(config: Field["config"]) {
  const optionConfig = config as { options?: unknown } | null;

  return Array.isArray(optionConfig?.options)
    ? optionConfig.options.filter(
        (option): option is string => typeof option === "string",
      )
    : [];
}

export default function PublicFormPage() {
  const { slug } = useParams();
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data, isLoading, isError } =
    trpc.form.getPublicForm.useQuery(
      { slug: slug ?? "" },
      { enabled: Boolean(slug) },
    );

  const [values, setValues] = useState<FormValues>({});

  const submitMutation = trpc.response.submit.useMutation({
    onSuccess: () => {
      toast.success("Form submitted successfully");
      setValues({});
      setError("");
      setSubmitted(true);
    },
    onError: (err) => {
      const message = getFriendlyErrorMessage(
        err,
        "Unable to submit your response. Please try again.",
      );
      toast.error(message);
      setError(message);
    },
  });

  const handleChange = (fieldId: string, value: string) => {
    setError("");
    setSubmitted(false);
    setValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);

    if (!data || !slug) return;

    if (data.fields.length === 0) {
      const message = "This form does not have any fields yet.";
      setError(message);
      toast.error(message);
      return;
    }

    for (const field of data.fields) {
      const value = values[field.id]?.trim();

      if (field.required && !value) {
        const message = `${field.label} is required.`;
        setError(message);
        toast.error(message);
        return;
      }
    }

    const answers = data.fields.map((field) => ({
      fieldId: field.id,
      value: values[field.id] ?? "",
    }));

    submitMutation.mutate({
      formId: data.id,
      slug,
      answers,
    });
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder ?? ""}
            value={values[field.id] ?? ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required ?? false}
          />
        );

      case "textarea":
        return (
          <Textarea
            placeholder={field.placeholder ?? ""}
            value={values[field.id] ?? ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required ?? false}
          />
        );

      case "select": {
        const options = getOptions(field.config);

        return (
          <select
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            value={values[field.id] ?? ""}
            onChange={(e) => handleChange(field.id, e.target.value)}
            required={field.required ?? false}
          >
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      }

      case "radio": {
        const options = getOptions(field.config);

        return (
          <div className="space-y-2">
            {options.length > 0 ? (
              options.map((opt) => (
                <label
                  key={opt}
                  className="flex min-h-9 items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors has-checked:border-primary has-checked:bg-primary/5"
                >
                  <input
                    type="radio"
                    name={field.id}
                    value={opt}
                    checked={values[field.id] === opt}
                    onChange={() => handleChange(field.id, opt)}
                    required={field.required ?? false}
                    className="size-4"
                  />
                  <span>{opt}</span>
                </label>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No options available.
              </p>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading form...</p>;
  }

  if (isError || !data) {
    return <p className="text-center mt-10 text-red-500">We could not find that form.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl shadow-xl shadow-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">{data.title}</CardTitle>
          {data.description && (
            <p className="text-sm text-muted-foreground">
              {data.description}
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {data.fields.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This form does not have any fields yet.
              </p>
            ) : (
              data.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label className="font-medium">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>

                  {renderField(field)}
                </div>
              ))
            )}

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={submitMutation.isPending || data.fields.length === 0}
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Form"}
            </Button>

            {submitted && (
              <p className="text-sm text-green-600">
                Thanks, your response has been recorded.
              </p>
            )}

            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
