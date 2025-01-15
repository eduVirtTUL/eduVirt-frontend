import { Outlet, useMatches } from "react-router";
import { Role, useUser } from "./stores/userStore";
import React from "react";
import NotFoundPage from "./pages/NotFound";

export type RouteHandle = {
  roles: Role[] | "*";
  [x: string | number | symbol]: unknown;
};

const AuthGuard: React.FC = () => {
  const { activeRole } = useUser();
  const matches = useMatches();
  const lastMatch = matches.at(-1);
  const routeHandle = lastMatch?.handle as RouteHandle | undefined;

  if (
    !routeHandle ||
    (routeHandle.roles !== "*" && !routeHandle.roles.includes(activeRole))
  ) {
    return <NotFoundPage />;
  }

  return <Outlet />;
};

export default AuthGuard;
