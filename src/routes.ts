import { RouteObject } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import RootLayout from "./layout/RootLayout";
import App from "./App";
import LoginPage from "./pages/Login";
import CoursesPage from "./pages/Courses";
import CoursePage from "./pages/Course";
import ResourceGroupPoolsPage from "./pages/ResourceGroupPools";
import ResourceGroupEditor from "./pages/ResourceGroupEditor";
import TeamsPage from "./pages/Team";
import TeamDetailsPage from "./pages/Team/TeamDetailsPage";

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
            path: "/teams",
            children: [
              { index: true, Component: TeamsPage },
              { path: ":id", Component: TeamDetailsPage },
            ],
          },
        ],
      },
    ],
  },
];
