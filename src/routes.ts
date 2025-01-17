import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  route("login", "./pages/Login/index.tsx"),
  route("auth/callback", "./AuthCallback.tsx"),

  layout("./AuthGuard.tsx", [
    layout("./layout/RootLayout.tsx", [
      index("./App.tsx"),

      ...prefix("courses", [
        index("./pages/Courses/index.tsx"),
        route(":id", "./pages/Course/index.tsx"),
        route(":id/limits", "./pages/CourseLimits/index.tsx"),
        route(":id/teams", "./pages/Course/TeamsInCoursePage.tsx"),
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
        index("./pages/Teams/index.tsx"),
        route(":id", "./pages/TeamDetails/index.tsx"),
      ]),

      ...prefix("metrics", [index("./pages/Metrics/index.tsx")]),

      ...prefix("limits", [
        index("./pages/Clusters/index.tsx"),
        route(":id", "./pages/ClusterLimits/index.tsx"),
      ]),

      ...prefix("networks", [
        index("./pages/VnicProfiles/index.tsx"),
        route("vlans", "./pages/VlanRanges/index.tsx"),
      ]),

      ...prefix("reservations", [
        index("./pages/Reservations/index.tsx"),
        route(":id", "./pages/Reservation/index.tsx"),
        ...prefix("calendar/resource-group", [
          route(":id", "./pages/Reservations/ResourceGroupReservationCalendar.tsx"),
        ]),
        ...prefix("calendar/resource-group-pool", [
          route(":id", "./pages/Reservations/ResourceGroupPoolReservationCalendar.tsx"),
        ]),
        ...prefix("courses", [
          route(":id", "./pages/Reservations/ReservationList.tsx"),
        ]),
      ]),

      ...prefix("maintenance", [
        index("./pages/MaintenanceIntervals/index.tsx"),
        route("/clusters/:id", "./pages/MaintenanceIntervals/ClusterIntervalList.tsx"),
        ...prefix("calendar", [
          index("./pages/MaintenanceIntervals/MaintenanceCalendar.tsx"),
          route(":id", "./pages/MaintenanceIntervals/MaintenanceCalendar.tsx", { id: "id"}),
        ]),
      ]),
    ]),
  ]),
  route("*", "./pages/NotFound/index.tsx"),
] satisfies RouteConfig;