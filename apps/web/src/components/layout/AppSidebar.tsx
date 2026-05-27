import { NavLink } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  BarChart3,
  FilePlus2,
  FileText,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/dashboard/forms",
    label: "Forms",
    icon: FileText,
  },
  {
    to: "/dashboard/forms/new",
    label: "Create Form",
    icon: FilePlus2,
  },
  {
    to: "/dashboard/responses",
    label: "Responses",
    icon: BarChart3,
  },
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-2 px-2 text-lg font-semibold">
          <span className="size-2 rounded-full bg-primary shadow-[0_0_18px_color-mix(in_oklch,var(--primary)_70%,transparent)]" />
          FormZen
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <SidebarMenuItem key={link.to}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                    }
                  >
                    <Icon />
                    <span>{link.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
