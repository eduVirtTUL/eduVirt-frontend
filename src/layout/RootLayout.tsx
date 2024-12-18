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
  MonitorCogIcon,
  MoonIcon,
  Network,
  SunIcon,
  User2,
  Users,
  ChartLine,
} from "lucide-react";
import React, { Suspense } from "react";
import logo from "@/assets/edu_2.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, Outlet, useMatches } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

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
  {
    to: "/limits",
    label: (t) => t("menu.limits"),
    icon: <ChartLine />,
  },
] satisfies {
  to: string;
  label: (t: TFunction) => string;
  icon: React.ReactNode;
}[];

const RootLayout: React.FC = () => {
  const { t } = useTranslation();
  const matches = useMatches();
  const { setTheme } = useTheme();

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
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                          <MoonIcon />
                          <span>Dark</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                          <SunIcon />
                          <span>Light</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                          <MonitorCogIcon />
                          <span>System</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                  >
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
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
        <Toaster />
      </main>
    </SidebarProvider>
  );
};

export default RootLayout;
