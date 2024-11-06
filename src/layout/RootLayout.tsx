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
  SidebarTrigger,
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

interface RootLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { to: "/", label: "Home", icon: <Home /> },
  { to: "/teams", label: "Teams", icon: <Users /> },
  { to: "/rg", label: "Resource Groups", icon: <Boxes /> },
  { to: "/rg-pools", label: "Resource Groups Pools", icon: <Group /> },
  { to: "/courses", label: "Courses", icon: <Book /> },
  { to: "/networks", label: "Networks", icon: <Network /> },
  { to: "/reservation", label: "Reservations", icon: <CalendarDays /> },
] satisfies {
  to: string;
  label: string;
  icon: React.ReactNode;
}[];

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
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
                    <SidebarMenuButton asChild>
                      <a href={item.to}>
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
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
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default RootLayout;
