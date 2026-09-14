"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderSimpleIcon,
  GearIcon,
  GitPullRequestIcon,
  GithubLogoIcon,
  LayoutIcon,
} from "@phosphor-icons/react";

import {
  DASHBOARD_NAV_ITEMS,
  type DashboardRoute,
} from "@/features/dashboard/lib/routes";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ICONS = {
  "layout-dashboard": LayoutIcon,
  "folder-git-2": FolderSimpleIcon,
  "git-pull-request": GitPullRequestIcon,
  github: GithubLogoIcon,
  settings: GearIcon,
} as const;

function isNavActive(
  pathname: string,
  href: DashboardRoute,
) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        Workspace
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const active = isNavActive(
              pathname,
              item.href,
            );

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={active}
                  className="relative transition-all duration-200 hover:translate-x-0.5 hover:bg-sidebar-accent/80 data-[active=true]:bg-sidebar-accent data-[active=true]:shadow-sm"
                  tooltip={item.title}
                  render={
                    <Link href={item.href}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}