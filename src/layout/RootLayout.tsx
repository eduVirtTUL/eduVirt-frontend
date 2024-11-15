import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Book,
  Boxes,
  CalendarDays,
  ChevronUp,
  Group,
  Home,
  Network,
  User2,
  Users,
} from "lucide-react";
import React from "react";
import logo from "@/assets/edu_2.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, Outlet, useMatches } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

const menuItems = [
  { to: "/", label: (t) => t("menu.home"), icon: <Home /> },
  { to: "/teams", label: (t) => t("menu.teams"), icon: <Users /> },
  { to: "/rg", label: (t) => t("menu.resourceGroups"), icon: <Boxes /> },
  { to: "/pools", label: (t) => t("menu.resourceGroupPools"), icon: <Group /> },
  { to: "/courses", label: (t) => t("menu.courses"), icon: <Book /> },
  { to: "/networks", label: (t) => t("menu.networks"), icon: <Network /> },
  {
    to: "/reservation",
    label: (t) => t("menu.reservations"),
    icon: <CalendarDays />,
  },
] satisfies {
  to: string;
  label: (t: TFunction) => string;
  icon: React.ReactNode;
}[];

const RootLayout: React.FC = () => {
  const { t } = useTranslation();
  const matches = useMatches();

  const lastMatch = matches.at(-1);

  const activeElement =
    menuItems
      .slice()
      .reverse()
      .find((item) => lastMatch?.pathname.startsWith(item.to))?.to ?? "/";

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex justify-center">
            <img src={logo} alt="logo" className="h-20 object-contain" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.to === activeElement}
                    >
                      <Link to={item.to}>
                        {item.icon}
                        <span>{item.label(t)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1">
        <div className="flex flex-col justify-center w-full px-10 py-8">
          <Outlet />
        </div>
        <Toaster />
      </main>
    </SidebarProvider>
  );
};

export default RootLayout;
