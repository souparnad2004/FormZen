import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFriendlyErrorMessage } from "@/lib/error-message";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

type ResponseWithAnswers = {
  id: string;
  createdAt: Date | string;
  answers: {
    fieldId: string;
    value: unknown;
  }[];
};

function formatAnswer(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  return JSON.stringify(value);
}

export default function ResponsesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const formId = id ?? "";

  const formsQuery = trpc.form.myForms.useQuery(undefined, {
    enabled: !formId,
  });
  const formQuery = trpc.form.byId.useQuery(
    { formId },
    { enabled: Boolean(formId) },
  );
  const responsesQuery = trpc.response.getByForm.useQuery(
    { formId },
    { enabled: Boolean(formId) },
  );

  const fields = responsesQuery.data?.fields ?? [];
  const responses = (responsesQuery.data?.responses ?? []) as ResponseWithAnswers[];

  const rows = useMemo(() => {
    return responses.map((response) => {
      const answerMap = Object.fromEntries(
        response.answers.map((answer) => [answer.fieldId, answer.value]),
      );

      return {
        ...response,
        answerMap,
      };
    });
  }, [responses]);

  if (!formId) {
    const forms = formsQuery.data ?? [];

    return (
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Responses</h2>
          <p className="text-sm text-muted-foreground">
            Select a form to review submitted responses.
          </p>
        </div>

        {formsQuery.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading forms...</div>
        ) : formsQuery.isError ? (
          <div className="text-sm text-red-500">
            {getFriendlyErrorMessage(formsQuery.error, "Unable to load forms. Please try again.")}
          </div>
        ) : forms.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No forms found.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {forms.map((form) => (
              <Card key={form.id}>
                <CardContent className="space-y-4 p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-tight">{form.title}</h3>
                      <Badge variant="secondary" className="capitalize">
                        {form.visibility ?? "draft"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {form.description || "No description"}
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/forms/${form.id}/responses`)}
                  >
                    <BarChart3 className="size-4" />
                    View Responses
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (formQuery.isLoading || responsesQuery.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading responses...</div>;
  }

  if (formQuery.isError) {
    return (
      <div className="p-6 text-sm text-red-500">
        {getFriendlyErrorMessage(formQuery.error, "Unable to load this form. Please try again.")}
      </div>
    );
  }

  if (responsesQuery.isError) {
    return (
      <div className="p-6 text-sm text-red-500">
        {getFriendlyErrorMessage(
          responsesQuery.error,
          "Unable to load responses. Please try again.",
        )}
      </div>
    );
  }

  const form = formQuery.data;

  if (!form) {
    return <div className="p-6 text-sm text-red-500">We could not find that form.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="outline" onClick={() => navigate("/dashboard/responses")}>
        <ArrowLeft className="size-4" />
        All responses
      </Button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{form.title}</h2>
          {form.description && (
            <p className="text-sm text-muted-foreground">{form.description}</p>
          )}
        </div>

        <Badge variant="secondary" className="w-fit">
          {rows.length} responses
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Responses</p>
            <h3 className="mt-2 text-2xl font-semibold">{rows.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Fields</p>
            <h3 className="mt-2 text-2xl font-semibold">{fields.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Required Fields</p>
            <h3 className="mt-2 text-2xl font-semibold">
              {fields.filter((field) => field.required).length}
            </h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No responses have been submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="border-b bg-muted/40 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    {fields.map((field) => (
                      <th key={field.id} className="px-4 py-3 font-medium">
                        {field.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((response) => (
                    <tr key={response.id} className="border-b last:border-0">
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {new Date(response.createdAt).toLocaleString()}
                      </td>
                      {fields.map((field) => (
                        <td key={field.id} className="px-4 py-3">
                          {formatAnswer(response.answerMap[field.id])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
