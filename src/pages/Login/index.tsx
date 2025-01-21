import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/edu_2.png";
import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import React from "react";
import i18next from "i18next";
import { appEnv } from "@/environment";

const LoginPage: React.FC = () => {
  const isExpired = React.useRef(false);

  const token = localStorage.getItem("token");

  if (token) {
    const { exp } = jwtDecode(token);
    isExpired.current = Date.now() >= exp! * 1000;
    if (!isExpired.current) {
      return <Navigate to={"/"} />;
    }

    localStorage.removeItem("token");
  }

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <Card>
        {isExpired.current && <p>Your session expired please login again.</p>}
        <CardContent className="flex flex-col items-center">
          <img src={logo} className="w-60" />
          <Button
            onClick={() => {
              window.location.href = appEnv.apiUrl + "/auth/login";
            }}
          >
            Login using oVirt SSO
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;

export const meta = () => {
  return [{ title: i18next.t("pageTitles.login") }];
};
