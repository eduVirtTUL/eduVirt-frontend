import { Navigate, Outlet, useMatches } from "react-router";
import { Role, useUser } from "./stores/userStore";
import React from "react";
import NotFoundPage from "./pages/NotFound";
import { jwtDecode } from "jwt-decode";

export type RouteHandle = {
  roles: Role[] | "*";
  [x: string | number | symbol]: unknown;
};

const AuthGuard: React.FC = () => {
  const { activeRole } = useUser();
  const matches = useMatches();
  const lastMatch = matches.at(-1);
  const routeHandle = lastMatch?.handle as RouteHandle | undefined;
  const token = localStorage.getItem("refreshToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const { exp } = jwtDecode(token);
  const isExpired = Date.now() >= exp! * 1000;
  if (isExpired) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return <Navigate to={"/"} />;
  }

  if (
    !routeHandle ||
    (routeHandle.roles !== "*" && !routeHandle.roles.includes(activeRole))
  ) {
    return <NotFoundPage />;
  }

  return <Outlet />;
};

export default AuthGuard;
