import { RouteObject } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import RootLayout from "./layout/RootLayout";
import App from "./App";
import LoginPage from "./pages/Login";
import CoursesPage from "./pages/Courses";
import CoursePage from "./pages/Course";
import ResourceGroupPoolsPage from "./pages/ResourceGroupPools";

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
          { path: "/rg", Component: App },
          {
            path: "/pools",
            children: [{ index: true, Component: ResourceGroupPoolsPage }],
          },
        ],
      },
    ],
  },
];
