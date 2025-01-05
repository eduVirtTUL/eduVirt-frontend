import {Link, useParams} from "react-router";
import {useTranslation} from "react-i18next";
import {Button} from "@/components/ui/button";
import {Undo2} from "lucide-react";
import React from "react";

const ReservationPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    <>
      <div className={"flex justify-start"}>
        <Link to={"/reservations"}>
          <Button variant="outline" size="icon" className="mr-5">
            <Undo2/>
          </Button>
        </Link>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("reservations.details.title") + id}
        </h3>
      </div>
    </>
  );
}

export default ReservationPage;