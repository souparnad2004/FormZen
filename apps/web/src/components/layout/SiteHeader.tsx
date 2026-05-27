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

export function SiteHeader({fn}:{fn: () => void}) {

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between border-b bg-background/80 px-6 py-4 backdrop-blur-xl">
      <div>
        <h1 className="flex items-center gap-2 font-semibold text-lg">
          <Sparkles className="size-4 text-primary" />
          Creator Studio
        </h1>
        <p className="text-xs text-muted-foreground">
          Build, publish and review form campaigns.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => navigate("/dashboard/forms/new")}>Create Form</Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
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
