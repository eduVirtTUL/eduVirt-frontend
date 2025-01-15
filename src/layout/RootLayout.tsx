import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
  Group,
  Home,
  Network,
  Users,
  ChartLine,
  Wrench,
  ThermometerIcon,
} from "lucide-react";
import React, { Suspense } from "react";
import logo from "@/assets/edu_2.png";
import { Link, Outlet, useMatches } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useUser } from "@/stores/userStore";
import MainMenuFooter from "@/components/MainMenuFooter";

const menuItems = [
  { to: "/", label: (t) => t("menu.home"), icon: <Home /> },
  { to: "/teams", label: (t) => t("menu.teams"), icon: <Users /> },
  { to: "/rg", label: (t) => t("menu.resourceGroups"), icon: <Boxes /> },
  { to: "/pools", label: (t) => t("menu.resourceGroupPools"), icon: <Group /> },
  { to: "/courses", label: (t) => t("menu.courses"), icon: <Book /> },
  { to: "/networks", label: (t) => t("menu.networks"), icon: <Network /> },
  {
    to: "/metrics",
    label: (t) => t("menu.metrics"),
    icon: <ThermometerIcon />,
  },
  {
    to: "/reservations",
    label: (t) => t("menu.reservations"),
    icon: <CalendarDays />,
  },
  { to: "/limits", label: (t) => t("menu.limits"), icon: <ChartLine /> },
  { to: "/maintenance", label: (t) => t("menu.maintenance"), icon: <Wrench /> },
] satisfies {
  to: string;
  label: (t: TFunction) => string;
  icon: React.ReactNode;
}[];

const RootLayout: React.FC = () => {
  const { t } = useTranslation();
  const matches = useMatches();
  const { roles, activeRole } = useUser();

  console.log("roles:", roles);
  console.log("activeRole:", activeRole);

  const lastMatch = matches.at(-1);

  const activeElement =
    menuItems
      .slice()
      .reverse()
      .find((item) => lastMatch?.pathname.startsWith(item.to))?.to ?? "/";

  const disableScroll =
    lastMatch?.handle instanceof Object && "noScroll" in lastMatch.handle;

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
          <MainMenuFooter />
        </SidebarFooter>
      </Sidebar>
      <main
        className={cn("flex-1", disableScroll ? "h-screen" : "min-h-screen")}
      >
        <div
          className={cn(
            "flex flex-col w-full px-10 py-8",
            disableScroll ? "h-screen" : "min-h-screen"
          )}
        >
          <Suspense>
            <Outlet />
          </Suspense>
        </div>
        <Toaster expand richColors />
      </main>
    </SidebarProvider>
  );
};

export default RootLayout;
