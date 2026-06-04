import {
  User,
  CheckCircle2,
  Clock,
  Lock,
  Pencil,
  Trash2,
  Mail,
  CalendarDays,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";

const UserProfile = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const createdAt = new Date(user.createdAt);
  const updatedAt = user.updatedAt ? new Date(user.updatedAt) : null;
  const initials = user.username?.slice(0, 2).toUpperCase() || "U";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col gap-5 rounded-3xl border bg-card p-5 text-card-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative shrink-0">
            <Avatar className="size-20 ring-2 ring-background sm:size-24">
              <AvatarImage src={user.profileImageUrl ?? undefined} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-1 -right-1 size-8 rounded-full shadow-sm"
              aria-label="Edit profile photo"
            >
              <Pencil className="size-3.5" />
            </Button>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-2xl font-semibold">
                {user.username}
              </h2>
              {user.role && (
                <Badge variant="secondary" className="uppercase">
                  {user.role}
                </Badge>
              )}
            </div>
            <p className="mt-1 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4 shrink-0" />
              <span className="truncate">{user.email}</span>
            </p>
          </div>
        </div>

        <Button className="w-full sm:w-auto">Edit Profile</Button>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your current account details.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Email
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span>{user.email}</span>
                {user.emailVerified && (
                  <Badge variant="outline" className="text-primary">
                    <CheckCircle2 className="size-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                User ID
              </p>
              <code className="mt-1 block break-all rounded-lg bg-muted px-2 py-1 text-xs text-muted-foreground">
                {user.id}
              </code>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Username
              </p>
              <p className="mt-1">{user.username}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Account Timeline
            </CardTitle>
            <CardDescription>When this profile changed.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Created
              </p>
              <p className="mt-1 flex items-center gap-2">
                <CalendarDays className="size-4 text-muted-foreground" />
                {createdAt.toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Updated
              </p>
              <p className="mt-1 flex items-center gap-2">
                <CalendarDays className="size-4 text-muted-foreground" />
                {updatedAt ? updatedAt.toLocaleDateString() : "Not updated"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-semibold">
                <Lock className="size-5" />
                Security
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage password and authentication.
              </p>
            </div>

            <Button variant="outline">Change Password</Button>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">
              Current Password
            </p>
            <span className="mt-1 block font-mono tracking-widest">
              ********
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-destructive">
              <Trash2 className="size-4" />
              Danger Zone
            </h3>
            <p className="text-sm text-muted-foreground">
              Delete your account permanently.
            </p>
          </div>

          <Button variant="outline" className="border-destructive/40 text-destructive">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default UserProfile;
