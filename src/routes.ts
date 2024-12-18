import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  route("login", "./pages/Login/index.tsx"),

  layout("./AuthGuard.tsx", [
    layout("./layout/RootLayout.tsx", [
      index("./App.tsx"),

      ...prefix("courses", [
        index("./pages/Courses/index.tsx"),
        route(":id", "./pages/Course/index.tsx"),
      ]),

      ...prefix("rg", [
        index("./pages/ResourceGroups/index.tsx"),
        route(":id", "./pages/ResourceGroupEditor/index.tsx"),
      ]),

      ...prefix("pools", [
        index("./pages/ResourceGroupPools/index.tsx"),
        route(":id", "./pages/ResourceGroupPool/index.tsx"),
      ]),

      ...prefix("teams", [
        index("./pages/Team/index.tsx"),
        route(":id", "./pages/Team/TeamDetailsPage.tsx"),
      ]),

      ...prefix("limits", [
        index("./pages/Clusters/index.tsx"),
        route(":id", "./pages/ClusterLimits/index.tsx"),
      ]),

      ...prefix("networks", [
        index("./pages/VnicProfiles/index.tsx"),
        route("vlans", "./pages/VlanRanges/index.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
