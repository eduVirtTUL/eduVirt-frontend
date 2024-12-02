import { RouteObject } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import RootLayout from "./layout/RootLayout";
import App from "./App";
import LoginPage from "./pages/Login";
import CoursesPage from "./pages/Courses";
import CoursePage from "./pages/Course";
import ResourceGroupPoolsPage from "./pages/ResourceGroupPools";
import VnicProfilesPage from "./pages/VnicProfiles";
import VlanRangesPage from "@/pages/VlanRanges";
import ResourceGroupEditor from "./pages/ResourceGroupEditor";

export const routes: RouteObject[] = [
  { path: "/login", Component: LoginPage },
  {
    Component: AuthGuard,
    children: [
      {
        Component: RootLayout,
        children: [
          { path: "/", Component: App },
          {
            path: "/courses",
            children: [
              { index: true, Component: CoursesPage },
              { path: ":id", Component: CoursePage },
            ],
          },
          {
            path: "/rg",
            children: [{ path: ":id", Component: ResourceGroupEditor }],
          },
          {
            path: "/pools",
            children: [{ index: true, Component: ResourceGroupPoolsPage }],
          },
          {
            // TODO maybe change to /networking or /vnic-profiles,
            //  actually we operating on vnic profiles and /networks may cause miss understanding
            path: "/networks",
            children: [
                { index: true, Component: VnicProfilesPage },
                { path: "vlans", Component: VlanRangesPage }
            ],
          }
        ],
      },
    ],
  },
];
