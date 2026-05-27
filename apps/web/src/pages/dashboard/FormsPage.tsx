import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { BarChart3, Edit, Plus, Search, Trash2, Link2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/lib/error-message";

type FormListItem = {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string | null;
  visibility: "draft" | "unlisted" | "public" | null;
  userId: string;
  title: string;
  description: string | null;
  status: "active" | "inactive";
  slug: string;
};

export default function FormsPage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [search, setSearch] = useState("");

  const formsQuery = trpc.form.myForms.useQuery();

  const deleteForm = trpc.form.delete.useMutation({
    onSuccess: async () => {
      await utils.form.myForms.invalidate();
      toast.success("Form deleted");
    },
    onError: (error) => {
      toast.error(getFriendlyErrorMessage(error, "Unable to delete the form. Please try again."));
    },
  });

  const filteredForms = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return formsQuery.data ?? [];

    return (formsQuery.data ?? []).filter((form) => {
      return (
        form.title.toLowerCase().includes(term) ||
        (form.description ?? "").toLowerCase().includes(term)
      );
    });
  }, [formsQuery.data, search]);

  const handleDelete = (formId: string, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"?`);

    if (confirmed) {
      deleteForm.mutate({ formId });
    }
  };

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(link);
    toast.success("Form link copied");
  };

  const canShare = (form: FormListItem) =>
    (form.visibility === "public" || form.visibility === "unlisted") &&
    form.status === "active";

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <Button onClick={() => navigate("/dashboard/forms/new")}>
          <Plus className="size-4" />
          Create Form
        </Button>
      </div>

      {formsQuery.isLoading ? (
        <div className="text-sm text-muted-foreground">Loading forms...</div>
      ) : formsQuery.isError ? (
        <div className="text-sm text-red-500">
          {getFriendlyErrorMessage(formsQuery.error, "Unable to load forms. Please try again.")}
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No forms found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredForms.map((form) => (
            <Card key={form.id}>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold leading-tight">
                      {form.title}
                    </h3>

                    <Badge variant="secondary" className="capitalize">
                      {form.visibility ?? "draft"}
                    </Badge>
                  </div>

                  <p className="min-h-5 text-sm text-muted-foreground">
                    {form.description || "No description"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/forms/${form.id}/edit`)}
                  >
                    <Edit className="size-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/dashboard/forms/${form.id}/responses`)
                    }
                  >
                    <BarChart3 className="size-4" />
                    Responses
                  </Button>
                  {canShare(form) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(form.slug)}
                    >
                      <Link2 className="size-4" />
                      Copy Link
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Private
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto text-red-500 hover:text-red-600"
                    disabled={deleteForm.isPending}
                    onClick={() => handleDelete(form.id, form.title)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
