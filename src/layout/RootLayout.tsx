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
  CalendarDays,
  Group,
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
import { Role, useUser } from "@/stores/userStore";
import MainMenuFooter from "@/components/MainMenuFooter";

type menuItem = {
  to: string;
  label: (t: TFunction) => string;
  icon: React.ReactNode;
  roles: Role[];
}

const menuItems: menuItem[] = [
  {
    to: "/teams",
    label: (t) => t("menu.teams"),
    icon: <Users />,
    roles: ["student"],
  },
  // {
  //   to: "/rg",
  //   label: (t) => t("menu.resourceGroups"),
  //   icon: <Boxes />,
  //   roles: ["administrator", "teacher"],
  // },
  {
    to: "/pools",
    label: (t) => t("menu.resourceGroupPools"),
    icon: <Group />,
    roles: ["administrator", "teacher"],
  },
  {
    to: "/courses",
    label: (t) => t("menu.courses"),
    icon: <Book />,
    roles: ["administrator", "teacher"],
  },
  {
    to: "/networks",
    label: (t) => t("menu.networks"),
    icon: <Network />,
    roles: ["administrator"],
  },
  {
    to: "/metrics",
    label: (t) => t("menu.metrics"),
    icon: <ThermometerIcon />,
    roles: ["administrator"],
  },
  {
    to: "/reservations",
    label: (t) => t("menu.reservations"),
    icon: <CalendarDays />,
    roles: ["student"],
  },
  {
    to: "/limits",
    label: (t) => t("menu.limits"),
    icon: <ChartLine />,
    roles: ["administrator"],
  },
  {
    to: "/maintenance",
    label: (t) => t("menu.maintenance"),
    icon: <Wrench />,
    roles: ["administrator"],
  },
];

const RootLayout: React.FC = () => {
  const { t } = useTranslation();
  const matches = useMatches();
  const { activeRole } = useUser();

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
                {menuItems
                  .filter((item) => item.roles.includes(activeRole))
                  .map((item) => (
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
