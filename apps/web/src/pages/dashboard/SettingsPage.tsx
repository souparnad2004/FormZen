import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Monitor, Moon, Palette, Sun } from "lucide-react";

const themeOptions = [
  {
    value: "light",
    label: "Light",
    description: "Warm canvas with crisp studio panels.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Deep aurora console for demo rooms.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Match your device appearance.",
    icon: Monitor,
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <Badge variant="secondary">Workspace</Badge>
        <h2 className="mt-3 text-xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Tune the interface for demos, judging sessions and everyday building.
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Palette className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold">Appearance</h3>
              <p className="text-sm text-muted-foreground">
                Switch between Aurora light, dark or system mode.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = mounted && theme === option.value;

              return (
                <Button
                  key={option.value}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  className="h-auto justify-start rounded-3xl p-4 text-left"
                  onClick={() => setTheme(option.value)}
                >
                  <Icon className="size-5" />
                  <span className="grid gap-1">
                    <span>{option.label}</span>
                    <span className="text-xs font-normal opacity-75">
                      {option.description}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
