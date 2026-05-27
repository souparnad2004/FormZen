import { SectionCards } from "@/components/dashboard/SectionCards";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { trpc } from "@/lib/trpc";
import { getFriendlyErrorMessage } from "@/lib/error-message";

export default function Dashboard() {
  const formsQuery = trpc.form.myForms.useQuery();

  const forms = formsQuery.data ?? [];
  const draftForms = forms.filter((form) => form.visibility === "draft").length;
  const publicForms = forms.filter((form) => form.visibility === "public").length;
  const unlistedForms = forms.filter((form) => form.visibility === "unlisted").length;

  return (
    <div className="flex flex-1 flex-col p-6 gap-6">
      <SectionCards
        draftForms={draftForms}
        publicForms={publicForms}
        totalForms={forms.length}
        unlistedForms={unlistedForms}
      />

      {formsQuery.isError ? (
        <div className="text-sm text-red-500">
          {getFriendlyErrorMessage(formsQuery.error, "Unable to load your dashboard. Please try again.")}
        </div>
      ) : (
        <RecentActivity forms={forms} />
      )}
    </div>
  );
}
