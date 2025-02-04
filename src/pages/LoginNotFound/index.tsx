import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SirenIcon, ChevronLeft } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import logo from "@/assets/edu_2.png";
import { appEnv } from "@/environment";

const LoginNotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-screen h-screen flex flex-col items-center pt-40 gap-6">
      <img src={logo} className="w-1/5 min-w-64" />
      <Alert className="w-fit max-w-96">
        <SirenIcon className="w-4 h-4" />
        <AlertTitle>{t("loginNotFoundPage.title")}</AlertTitle>
        <AlertDescription>
          {t("loginNotFoundPage.description")}
        </AlertDescription>
      </Alert>
      <Button asChild>
        <a href={`${appEnv.ovirtEngineUrl}/web-ui`} target="_blank">
          {t("loginNotFoundPage.oVirtLogin")}
        </a>
      </Button>
      <Button asChild>
        <Link to="/login">
          <ChevronLeft />
          {t("loginNotFoundPage.goBackToLogin")}
        </Link>
      </Button>
    </div>
  );
};

export default LoginNotFoundPage;
