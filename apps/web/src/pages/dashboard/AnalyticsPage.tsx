import { Card, CardContent } from "@/components/ui/card";
import { getFriendlyErrorMessage } from "@/lib/error-message";
import { trpc } from "@/lib/trpc";
import { useParams } from "react-router";

export default function AnalyticsPage() {
  const { id } = useParams();
  const formId = id ?? "";
  const formQuery = trpc.form.byId.useQuery({ formId }, { enabled: Boolean(formId) });
  const fieldsQuery = trpc.field.getByFormId.useQuery(
    { formId },
    { enabled: Boolean(formId) },
  );

  if (!formId) {
    return <div className="p-6 text-sm text-red-500">Open analytics from a valid form.</div>;
  }

  if (formQuery.isLoading || fieldsQuery.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading analytics...</div>;
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
        {getFriendlyErrorMessage(fieldsQuery.error, "Unable to load analytics. Please try again.")}
      </div>
    );
  }

  const form = formQuery.data;
  if (!form) {
    return <div className="p-6 text-sm text-red-500">We could not find that form.</div>;
  }

  const fields = fieldsQuery.data ?? [];
  const requiredFields = fields.filter((field) => field.required).length;
  const optionalFields = fields.length - requiredFields;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{form.title}</h2>
        {form.description && (
          <p className="text-sm text-muted-foreground">{form.description}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Fields</p>
            <h3 className="mt-2 text-2xl font-semibold">{fields.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Required Fields</p>
            <h3 className="mt-2 text-2xl font-semibold">{requiredFields}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Optional Fields</p>
            <h3 className="mt-2 text-2xl font-semibold">{optionalFields}</h3>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold">Field Types</h3>
          <div className="mt-4 space-y-2 text-sm">
            {fields.length === 0 ? (
              <p className="text-muted-foreground">No fields have been added.</p>
            ) : (
              fields.map((field) => (
                <div key={field.id} className="flex justify-between border-b py-2 last:border-0">
                  <span>{field.label}</span>
                  <span className="capitalize text-muted-foreground">{field.type}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
