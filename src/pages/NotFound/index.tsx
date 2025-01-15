import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChevronLeft, SirenIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="w-screen h-screen flex flex-col items-center pt-40 gap-6">
      <Alert className=" w-fit">
        <SirenIcon className="w-4 h-4" />
        <AlertTitle>{t("notFoundPage.title")}</AlertTitle>
        <AlertDescription>{t("notFoundPage.description")}</AlertDescription>
      </Alert>
      <Button asChild>
        <Link to="/">
          <ChevronLeft />
          {t("notFoundPage.back")}
        </Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
