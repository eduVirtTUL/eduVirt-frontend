import { ResourceGroupPoolDto } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

type ResourceGroupPoolCardProps = {
  pool: ResourceGroupPoolDto;
  courseId: string;
  clusterId: string;
};

const ResourceGroupPoolCard: React.FC<ResourceGroupPoolCardProps> = ({
  pool, courseId, clusterId
}) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{pool.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{pool.description}</p>
        <div className="flex justify-start">
          <Button asChild>
            <Link
              to={`/pools/${pool.id}`}
              state={{ courseId: courseId, clusterId: clusterId }}
            >
              {t("coursePools.openPool")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceGroupPoolCard;
