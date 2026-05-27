import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/lib/error-message";

export default function CreateFormPage() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createForm = trpc.form.create.useMutation({
    onSuccess: async (form) => {
      await utils.form.myForms.invalidate();
      toast.success("Form created");
      navigate(`/dashboard/forms/${form.id}/edit`);
    },
    onError: (error) => {
      toast.error(getFriendlyErrorMessage(error, "Unable to create the form. Please try again."));
    },
  });

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    createForm.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-xl">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold">Create New Form</h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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

            <Button
              type="submit"
              className="w-full"
              disabled={createForm.isPending}
            >
              {createForm.isPending ? "Creating..." : "Create Form"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
