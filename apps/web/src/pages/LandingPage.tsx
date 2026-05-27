import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  FileText,
  GalleryHorizontalEnd,
  LockKeyhole,
  Moon,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  WandSparkles,
} from "lucide-react";

const features = [
  {
    title: "Flexible form builder",
    description:
      "Create forms with required fields, multiple input types, publishing controls and a clean creator workflow.",
    icon: FileText,
  },
  {
    title: "Public discovery",
    description:
      "Publish public forms for explore pages, galleries and featured sections where anyone can submit.",
    icon: GalleryHorizontalEnd,
  },
  {
    title: "Unlisted sharing",
    description:
      "Keep published forms hidden from listings while making them accessible through a direct link.",
    icon: LockKeyhole,
  },
  {
    title: "Response workspace",
    description:
      "Review submissions, response tables and analytics without leaving the protected creator dashboard.",
    icon: BarChart3,
  },
];

const workflow = [
  ["Build", "Add fields, labels, validation states and form details."],
  ["Publish", "Choose public visibility or unlisted direct-link access."],
  ["Share", "Send a branded link that respondents can open without logging in."],
  ["Analyze", "Track responses and understand how each form performs."],
];

const useCases = [
  "Startup waitlists",
  "Community applications",
  "Event registrations",
  "Feedback surveys",
  "Creator intake forms",
  "Product research",
];

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    //eslint-disable-next-line
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

export default function LandingPage() {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            className="flex items-center gap-2 text-left"
            onClick={() => navigate("/")}
          >
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="size-4" />
            </span>
            <span className="font-semibold tracking-tight">FormZen</span>
          </button>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-foreground" href="#visibility">
              Visibility
            </a>
            <a className="transition-colors hover:text-foreground" href="#workflow">
              Workflow
            </a>
            <a className="transition-colors hover:text-foreground" href="#use-cases">
              Use cases
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <Button onClick={() => navigate("/dashboard")}>
                Dashboard
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Get started
                  <ArrowRight className="size-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[92vh] items-center px-4 pt-20 sm:px-6">
          <div className="aurora-grid absolute inset-0 opacity-60" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_92%)]" />

          <div className="relative mx-auto grid w-full max-w-7xl gap-10 py-16 lg:grid-cols-[minmax(0,0.98fr)_minmax(420px,0.72fr)] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <Badge variant="secondary" className="mb-5">
                Modern form operations
              </Badge>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                Build forms people actually want to complete.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                FormZen is a creator dashboard for designing, publishing and
                managing public or unlisted forms. Collect submissions without
                respondent logins, then review every response in one focused
                workspace.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => navigate(isLoggedIn ? "/dashboard" : "/register")}
                >
                  Start building
                  <ArrowRight className="size-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Open dashboard
                </Button>
              </div>

              <div className="mt-8 grid max-w-2xl gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                {["Public forms", "Unlisted links", "Live responses"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.12, duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-[2rem] border border-border/80 bg-card/85 p-3 shadow-2xl shadow-primary/10 backdrop-blur">
                <div className="rounded-[1.5rem] border bg-background/80 p-4">
                  <div className="mb-4 flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="text-sm font-medium">Campaign form</p>
                      <p className="text-xs text-muted-foreground">
                        Community launch intake
                      </p>
                    </div>
                    <Badge>Public</Badge>
                  </div>

                  <div className="space-y-3">
                    {[
                      ["Name", "text field"],
                      ["Email", "email field"],
                      ["Interest area", "select field"],
                      ["Availability", "date field"],
                    ].map(([label, type], index) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.08 }}
                        className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{label}</p>
                          <p className="text-xs text-muted-foreground">{type}</p>
                        </div>
                        <span className="h-2 w-20 rounded-full bg-primary/70" />
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      ["128", "responses"],
                      ["84%", "complete"],
                      ["12", "fields"],
                    ].map(([value, label]) => (
                      <div key={label} className="rounded-2xl bg-secondary p-3">
                        <p className="text-lg font-semibold">{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <Badge variant="secondary">Product details</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              A complete workflow for creators and respondents.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card key={feature.title}>
                  <CardContent className="p-5">
                    <div className="mb-5 flex size-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="visibility" className="border-y bg-card/35 px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Badge variant="secondary">Visibility modes</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Publish broadly or share quietly.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Use public forms when discovery matters. Use unlisted forms
                when the form is published but intended only for people with the
                direct link.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="p-5">
                  <Eye className="mb-5 size-6 text-primary" />
                  <h3 className="font-semibold">Public forms</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Public forms can appear in product areas like explore pages,
                    template galleries and featured sections. Anyone can open
                    and submit them.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <ShieldCheck className="mb-5 size-6 text-primary" />
                  <h3 className="font-semibold">Unlisted forms</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Unlisted forms stay out of public listings. They are still
                    published, but only visitors with the direct form link can
                    access them.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mb-10 max-w-2xl">
            <Badge variant="secondary">Workflow</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              From idea to responses in four steps.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {workflow.map(([title, description], index) => (
              <div key={title} className="rounded-3xl border bg-card p-5">
                <span className="mb-5 flex size-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  {index + 1}
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="use-cases" className="border-y bg-card/35 px-4 py-20 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <Badge variant="secondary">Use cases</Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Useful for launches, teams and communities.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Collect structured answers for campaigns where a standard
                spreadsheet or chat thread gets messy fast.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {useCases.map((item) => (
                <div key={item} className="rounded-3xl border bg-card p-4">
                  <WandSparkles className="mb-4 size-5 text-primary" />
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="rounded-[2rem] border bg-card p-6 text-center shadow-xl shadow-primary/5 sm:p-10">
            <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Send className="size-5" />
            </div>
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Start collecting better answers today.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Create your workspace, publish a form, share the link and manage
              every response from a focused dashboard.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate(isLoggedIn ? "/dashboard/forms/new" : "/register")}
              >
                Create a form
                <ArrowRight className="size-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <span className="flex size-8 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              FormZen
            </div>
            <p>Public and unlisted forms for modern teams.</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#visibility" className="hover:text-foreground">Visibility</a>
            <a href="#workflow" className="hover:text-foreground">Workflow</a>
            <a href="#use-cases" className="hover:text-foreground">Use cases</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
