import {
  ChevronUp,
  MonitorCogIcon,
  MoonIcon,
  SunIcon,
  UserCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useTranslation } from "react-i18next";
import { useTheme } from "./ThemeProvider";
import { useUser } from "@/stores/userStore";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const MainMenuFooter: React.FC = () => {
  const { t } = useTranslation();
  const { setTheme, theme } = useTheme();
  const { roles, activeRole, changeActiveRole, name } = useUser();
  const nav = useNavigate();
  const queryClient = useQueryClient();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="py-6">
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-row gap-2 items-center">
                  <UserCircle2 className="w-7 h-7" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{name}</span>
                    <span>{t(`roles.${activeRole}`)}</span>
                  </div>
                </div>

                <ChevronUp className="ml-auto" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {t("menu.theme.title")}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuCheckboxItem
                    onClick={() => setTheme("dark")}
                    checked={theme === "dark"}
                  >
                    <div className="flex flex-row items-center gap-1">
                      <MoonIcon className="w-4 h-4" />
                      <span>{t("menu.theme.dark")}</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    onClick={() => setTheme("light")}
                    checked={theme === "light"}
                  >
                    <div className="flex flex-row items-center gap-1">
                      <SunIcon className="w-4 h-4" />
                      <span>{t("menu.theme.light")}</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    onClick={() => setTheme("system")}
                    checked={theme === "system"}
                  >
                    <div className="flex flex-row items-center gap-1">
                      <MonitorCogIcon className="w-4 h-4" />
                      <span>{t("menu.theme.system")}</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {roles.length > 1 && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {t("menu.accessLevel.title")}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {roles.map((role) => (
                      <DropdownMenuCheckboxItem
                        key={role}
                        checked={role === activeRole}
                        onClick={() => {
                          changeActiveRole(role);
                          queryClient.invalidateQueries();
                        }}
                      >
                        <span>{t(`roles.${role}`)}</span>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("token");
                nav("/login");
              }}
            >
              <span>{t("menu.signOut")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default MainMenuFooter;
