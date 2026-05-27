import { Card, CardContent } from "@/components/ui/card";

type ActivityItem = {
  id: string;
  title: string;
  createdAt: Date | string;
};

export function RecentActivity({ forms }: { forms: ActivityItem[] }) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="font-semibold mb-4">Recent Activity</h2>

        <div className="space-y-3 text-sm">
          {forms.length === 0 ? (
            <p className="text-muted-foreground">No recent form activity.</p>
          ) : (
            forms.slice(0, 5).map((form) => (
              <p key={form.id}>
                Created &quot;{form.title}&quot; on{" "}
                {new Date(form.createdAt).toLocaleDateString()}
              </p>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
