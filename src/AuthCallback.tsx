import { jwtDecode, JwtPayload } from "jwt-decode";
import React from "react";
import { useCookies } from "react-cookie";
import { Role, useUser } from "./stores/userStore";
import { Navigate } from "react-router";
import { privateAxios } from "@/data/privateAxios";

const roleOrder: { role: Role; index: number }[] = [
  { role: "administrator", index: 0 },
  { role: "teacher", index: 1 },
  { role: "student", index: 2 },
];

type TokenPayload = {
  preferred_username: string;
  groups: string[];
} & JwtPayload;

const AuthCallback: React.FC = () => {
  const [cookies, , removeCookie] = useCookies(["access_token"]);
  const { set, changeActiveRole } = useUser();

  let token = cookies.access_token as string | undefined;
  if (!token) {
    token = localStorage.getItem("token") ?? undefined;
  }

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

    const localStorageActiveRole = localStorage.getItem("activeRole") as
      | Role
      | undefined;
    if (!localStorageActiveRole) {
      changeActiveRole(activeRole?.role ?? "student");
    } else {
      if (roles.includes(localStorageActiveRole)) {
        changeActiveRole(localStorageActiveRole);
      }
    }

    localStorage.setItem("token", token);
  }, [token, set, changeActiveRole]);

  if (!token) {
    removeCookie("access_token", { domain: "localhost", path: "/"});
    localStorage.removeItem("token");
    window.location.href = import.meta.env.VITE_API_LOCATION + "/auth/login";
  } else {
    privateAxios.post<void>(`/auth/update-timezone-and-language`, null, {
      params: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language.split("-")[0] ?? '',
      }
    });
  }

  return <Navigate to={"/"} />;
};

export default AuthCallback;
