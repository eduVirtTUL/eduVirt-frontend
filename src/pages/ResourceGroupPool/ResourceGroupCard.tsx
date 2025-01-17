import { ResourceGroupDto } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { CalendarIcon } from "lucide-react";

type ResourceGroupCardProps = {
  resourceGroup: ResourceGroupDto;
  courseId: string;
  clusterId: string;
};

const ResourceGroupCard: React.FC<ResourceGroupCardProps> = ({
  resourceGroup, courseId, clusterId
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{resourceGroup.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row flex-wrap items-center justify-start gap-2 pb-5">
          <Button asChild>
            <Link to={`/rg/${resourceGroup.id}`}>
              {t("resourceGroupPoolPage.openEditor")}
            </Link>
          </Button>
          <Button
            variant="secondary"
            className="text-wrap"
            onClick={() => navigate(`/reservations/calendar/resource-group/presentation/${resourceGroup.id}`, {
              state: { clusterId: clusterId, courseId: courseId}
            })}
            >
              <CalendarIcon />
              {t("resourceGroupPoolPage.calendar")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceGroupCard;
