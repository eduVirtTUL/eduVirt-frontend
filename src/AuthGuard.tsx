import { jwtDecode, JwtPayload } from "jwt-decode";
import { Outlet } from "react-router";
import { Role, useUser } from "./stores/userStore";
import React from "react";

const roleOrder: { role: Role; index: number }[] = [
  { role: "administrator", index: 0 },
  { role: "teacher", index: 1 },
  { role: "student", index: 2 },
];

type TokenPayload = {
  preferred_username: string;
  groups: string[];
} & JwtPayload;

const AuthGuard: React.FC = () => {
  const { set, changeActiveRole } = useUser();
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  React.useEffect(() => {
    if (!token) return;
    const tokenPayload = jwtDecode<TokenPayload>(token);

    const roles = tokenPayload.groups
      .map((group) => {
        if (group === "/ovirt-administrator") {
          return "administrator";
        }
        if (group === "/teacher") {
          return "teacher";
        }
        if (group === "/student") {
          return "student";
        }
        return undefined;
      })
      .filter((role): role is Role => role !== undefined);

    const activeRole = roleOrder
      .filter((role) => roles.includes(role.role))
      .sort((a, b) => a.index - b.index)[0];

    set({
      id: tokenPayload.sub ?? "",
      name: tokenPayload.preferred_username,
      roles: roles.length !== 0 ? roles : ["student"],
    });
    changeActiveRole(activeRole?.role ?? "student");
  }, [token, set, changeActiveRole]);

  if (!token) {
    window.location.href = "http://localhost:8080/auth/login";
    return null;
  }

  localStorage.setItem("token", token);

  return <Outlet />;
};

export default AuthGuard;
