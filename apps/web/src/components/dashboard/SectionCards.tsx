import { Card, CardContent } from "@/components/ui/card";

type SectionCardsProps = {
  draftForms: number;
  publicForms: number;
  totalForms: number;
  unlistedForms: number;
};

export function SectionCards({
  draftForms,
  publicForms,
  totalForms,
  unlistedForms,
}: SectionCardsProps) {
  const items = [
    { label: "Total Forms", value: totalForms.toString() },
    { label: "Published", value: publicForms.toString() },
    { label: "Unlisted", value: unlistedForms.toString() },
    { label: "Drafts", value: draftForms.toString() },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
