import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader({fn}:{fn: () => void}) {
  const {user} = useAuthStore();
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between gap-3 border-b bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="shrink-0" />
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 font-semibold text-lg">
            <Sparkles className="size-4 shrink-0 text-primary" />
            <span className="truncate cursor-pointer" onClick={() => navigate("/")}>Creator Studio</span>
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Build, publish and review form campaigns.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="hidden sm:inline-flex"
          onClick={() => navigate("/dashboard/forms/new")}
        >
          Create Form
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>{user?.username.slice(0,1).toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/forms")}>
              My Forms
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fn()} className="text-red-500">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
