import { Outlet, useNavigate } from "react-router";
import type { CSSProperties } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc";
import { useAuthStore } from "@/store/auth";

export function DashboardLayout() {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logoutStore();
      navigate("/");
    },
    onError: () => {
      logoutStore();
      navigate("/");
    },
  });

  return (
    <TooltipProvider>
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties}
      >
        <AppSidebar />

        <SidebarInset className="min-h-svh bg-background/70">
          <SiteHeader fn={() => logout.mutate()} />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
