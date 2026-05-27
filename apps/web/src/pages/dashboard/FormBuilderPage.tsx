import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import type { FormvisibilityEnumType } from "@repo/types";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function FormBuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const utils = trpc.useUtils();
  const formId = id ?? "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] =
    useState<FormvisibilityEnumType>("draft");

  const formQuery = trpc.form.byId.useQuery(
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

  useEffect(() => {
    if (!formQuery.data) return;
    // eslint-disable-next-line
    setTitle(formQuery.data.title);
    setDescription(formQuery.data.description ?? "");
    setVisibility(formQuery.data.visibility ?? "draft");
  }, [formQuery.data]);

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateForm.mutate({
      formId,
      title: title.trim(),
      description: description.trim(),
      visibility,
    });
  };

  if (!formId) {
    return <div className="p-6 text-sm text-red-500">Missing form id.</div>;
  }

  if (formQuery.isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading form...</div>;
  }

  if (formQuery.isError) {
    return <div className="p-6 text-sm text-red-500">{formQuery.error.message}</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <Button variant="outline" onClick={() => navigate("/dashboard/forms")}>
        <ArrowLeft className="size-4" />
        Back to forms
      </Button>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="font-semibold">Form Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Update the form details saved in your workspace.
                </p>
              </div>

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
                onValueChange={(value) =>
                  setVisibility(value as FormvisibilityEnumType)
                }
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
                {updateForm.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-4">Preview</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold">{title || "Untitled form"}</h3>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              <Input placeholder="Name" />
              <Input placeholder="Email" type="email" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
